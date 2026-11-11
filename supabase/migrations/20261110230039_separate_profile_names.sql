
-- 1. Add the user's actual full name.
-- Nullable to preserve compatibility with existing profiles.
ALTER TABLE public.profiles
ADD COLUMN full_name text;


-- 2. Remove the previous onboarding function.
-- Its old signature accepted only three parameters.
DROP FUNCTION public.complete_onboarding(text, numeric, text);


-- 3. Create the updated onboarding function.
CREATE FUNCTION public.complete_onboarding(
    p_full_name text,
    p_display_name text,
    p_starting_balance numeric,
    p_theme text
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $function$
DECLARE
    v_user_id uuid;
    v_onboarding_completed boolean;
    v_full_name text;
    v_display_name text;
BEGIN
    -- 1. Verify the authenticated user's identity.
    v_user_id := (SELECT auth.uid());

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;


    -- 2. Normalize and validate names.
    v_full_name := NULLIF(btrim(p_full_name), '');
    v_display_name := NULLIF(btrim(p_display_name), '');

    IF v_full_name IS NULL THEN
        RAISE EXCEPTION 'Full name is required';
    END IF;

    IF char_length(v_full_name) > 60 THEN
        RAISE EXCEPTION 'Full name must be 60 characters or fewer';
    END IF;

    IF v_display_name IS NOT NULL
       AND char_length(v_display_name) > 60 THEN
        RAISE EXCEPTION 'Display name must be 60 characters or fewer';
    END IF;

    -- Use the full name when no display name is provided.
    v_display_name := COALESCE(v_display_name, v_full_name);


    -- 3. Validate the theme.
    IF p_theme IS NULL
       OR p_theme NOT IN ('light', 'dark') THEN
        RAISE EXCEPTION 'Invalid theme';
    END IF;


    -- 4. Validate the starting balance.
    IF p_starting_balance IS NOT NULL
       AND (
           p_starting_balance < 0
           OR p_starting_balance > 9999999999.99
           OR p_starting_balance <> round(p_starting_balance, 2)
       ) THEN
        RAISE EXCEPTION 'Invalid starting balance';
    END IF;


    -- 5. Lock the user's profile and check onboarding status.
    SELECT onboarding_completed
    INTO v_onboarding_completed
    FROM public.profiles
    WHERE id = v_user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found';
    END IF;

    -- Make repeated submissions safe.
    IF v_onboarding_completed THEN
        RETURN;
    END IF;


    -- 6. Update the profile.
    UPDATE public.profiles
    SET
        full_name = v_full_name,
        display_name = v_display_name,
        theme = p_theme
    WHERE id = v_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile update failed';
    END IF;


    -- 7. Create the Main Account if it doesn't exist.
    -- Preserve an existing account and its balance.
    INSERT INTO public.accounts (
        user_id,
        name,
        account_type,
        initial_balance
    )
    VALUES (
        v_user_id,
        'Main Account',
        'checking',
        COALESCE(p_starting_balance, 0)
    )
    ON CONFLICT (user_id)
        WHERE name = 'Main Account'
    DO NOTHING;


    -- 8. Mark onboarding complete.
    UPDATE public.profiles
    SET onboarding_completed = true
    WHERE id = v_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Could not complete onboarding';
    END IF;

END;
$function$;


-- 9. Restrict execution to authenticated users.
REVOKE ALL ON FUNCTION public.complete_onboarding(
    text, text, numeric, text
) FROM PUBLIC, anon, service_role;

GRANT EXECUTE ON FUNCTION public.complete_onboarding(
    text, text, numeric, text
) TO authenticated;
