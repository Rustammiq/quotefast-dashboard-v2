// Onboarding service for QuoteFast

export interface OnboardingData {
  step: number;
  completed: boolean;
  userType: 'freelancer' | 'small-business' | 'enterprise';
  industry: string;
  goals: string[];
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
}

export const defaultOnboardingData: OnboardingData = {
  step: 1,
  completed: false,
  userType: 'small-business',
  industry: 'general',
  goals: [],
  preferences: {
    theme: 'system',
    notifications: true,
  },
};

export const saveOnboardingData = (data: OnboardingData): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('onboarding-data', JSON.stringify(data));
  }
};

export const getOnboardingData = (): OnboardingData => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('onboarding-data');
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return defaultOnboardingData;
};