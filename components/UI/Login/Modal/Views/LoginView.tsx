export default function LoginView() {
  return (
    <div>
      {/* Heading */}
      <div className="mb-6">
        <h3 className="mb-1 font-quicksand-decorative text-lg font-bold text-text-primary sm:text-xl">
          Welcome Back
        </h3>

        <p className="font-sans-text text-base text-text-muted sm:text-lg">
          Login to grow and progress financially.
        </p>
      </div>

      {/* Login Form */}
      <form className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-sm font-medium text-text-secondary"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            required
            className="w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 sm:text-base"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-text-secondary"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="w-full rounded-cozy-sm border border-border bg-card px-3 py-2.5 text-sm text-text-primary transition-colors duration-200 placeholder:text-text-muted hover:border-secondary-hover focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 sm:text-base"
          />
        </div>
      </form>
    </div>
  );
}