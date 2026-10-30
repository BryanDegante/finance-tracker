export type OnboardingData = {
	primaryGoal: string;
	fullName: string;
	startingBalance: string;
	income: string;
	appMode: string;
	theme: 'light' | 'dark';
};

export type OnboardingStepProps = {
	data: OnboardingData;
	updateData: (fields: Partial<OnboardingData>) => void;
};
