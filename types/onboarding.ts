export type OnboardingData = {
	fullName: string;
	startingBalance: string;
	theme: 'light' | 'dark';
};

export type OnboardingStepProps = {
	data: OnboardingData;
	updateData: (fields: Partial<OnboardingData>) => void;
};
