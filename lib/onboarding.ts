// Enhanced Onboarding service for QuoteFast Dashboard
// Provides comprehensive user onboarding data management with validation and analytics

import { logger } from './logger';

// Enhanced onboarding data interface with comprehensive user profiling
export interface OnboardingData {
  // Basic user information
  step: number;
  completed: boolean;
  userId?: string;
  companyName?: string;
  
  // User type and business details
  userType: 'freelancer' | 'small-business' | 'enterprise';
  industry: 'it' | 'bouw' | 'consultancy' | 'ecommerce' | 'retail' | 'healthcare' | 'education' | 'general';
  teamSize: '1-5' | '6-20' | '21-50' | '50+';
  
  // Goals and preferences
  goals: string[];
  usageGoals: ('offertes' | 'factureren' | 'crm' | 'projectmanagement' | 'rapportage')[];
  aiFeatureInterests: ('ai-offerte-generator' | 'ai-content' | 'ai-analytics' | 'ai-automation')[];
  
  // Workflow preferences
  workflowPreferences: {
    automationLevel: 'minimaal' | 'gemiddeld' | 'maximum';
    integrationNeeds: ('email' | 'boekhouding' | 'crm' | 'projectmanagement' | 'betalingen' | 'calendar')[];
    reportingFrequency: 'dagelijks' | 'wekelijks' | 'maandelijks';
  };
  
  // UI preferences
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: 'nl' | 'en';
    timezone: string;
  };
  
  // Progress tracking
  progress: {
    stepsCompleted: number[];
    lastUpdated: string;
    timeSpent: number; // in minutes
  };
  
  // Analytics and insights
  analytics: {
    onboardingStartTime: string;
    completionTime?: string;
    skippedSteps: number[];
    helpRequests: number;
  };
}

// Comprehensive default onboarding data
export const defaultOnboardingData: OnboardingData = {
  step: 1,
  completed: false,
  userType: 'small-business',
  industry: 'general',
  teamSize: '1-5',
  goals: [],
  usageGoals: ['offertes', 'factureren'],
  aiFeatureInterests: ['ai-offerte-generator'],
  workflowPreferences: {
    automationLevel: 'gemiddeld',
    integrationNeeds: ['email', 'boekhouding'],
    reportingFrequency: 'wekelijks',
  },
  preferences: {
    theme: 'system',
    notifications: true,
    language: 'nl',
    timezone: 'Europe/Amsterdam',
  },
  progress: {
    stepsCompleted: [],
    lastUpdated: new Date().toISOString(),
    timeSpent: 0,
  },
  analytics: {
    onboardingStartTime: new Date().toISOString(),
    skippedSteps: [],
    helpRequests: 0,
  },
};

// Validation schema for onboarding data
export interface OnboardingValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Enhanced onboarding service class
export class OnboardingService {
  private static readonly STORAGE_KEY = 'quotefast-onboarding-data';
  private static readonly VERSION_KEY = 'quotefast-onboarding-version';
  private static readonly CURRENT_VERSION = '2.0.0';

  /**
   * Validates onboarding data structure and content
   */
  static validateOnboardingData(data: Partial<OnboardingData>): OnboardingValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!data.userType || !['freelancer', 'small-business', 'enterprise'].includes(data.userType)) {
      errors.push('Valid user type is required');
    }

    if (!data.industry || !['it', 'bouw', 'consultancy', 'ecommerce', 'retail', 'healthcare', 'education', 'general'].includes(data.industry)) {
      errors.push('Valid industry selection is required');
    }

    if (!data.teamSize || !['1-5', '6-20', '21-50', '50+'].includes(data.teamSize)) {
      errors.push('Valid team size selection is required');
    }

    // Goals validation
    if (!data.usageGoals || data.usageGoals.length === 0) {
      warnings.push('No usage goals selected - this may limit personalization');
    }

    // Workflow preferences validation
    if (!data.workflowPreferences?.automationLevel) {
      warnings.push('Automation level not specified - using default');
    }

    // Progress validation
    if (data.progress && data.progress.stepsCompleted.length > 10) {
      warnings.push('Unusual number of completed steps detected');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Saves onboarding data with validation and error handling
   */
  static saveOnboardingData(data: OnboardingData): boolean {
    try {
      // Validate data before saving
      const validation = this.validateOnboardingData(data);
      
      if (!validation.isValid) {
        logger.error('Onboarding data validation failed', 'onboarding', validation.errors);
        return false;
      }

      // Log warnings if any
      if (validation.warnings.length > 0) {
        logger.warn('Onboarding data validation warnings', 'onboarding', validation.warnings);
      }

      if (typeof window !== 'undefined') {
        // Add metadata
        const dataWithMetadata = {
          ...data,
          progress: {
            ...data.progress,
            lastUpdated: new Date().toISOString(),
          },
          _metadata: {
            version: this.CURRENT_VERSION,
            savedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
          },
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataWithMetadata));
        localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
        
        logger.info('Onboarding data saved successfully', 'onboarding', {
          step: data.step,
          completed: data.completed,
          industry: data.industry,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('Failed to save onboarding data', 'onboarding', error);
      return false;
    }
  }

  /**
   * Retrieves onboarding data with migration support
   */
  static getOnboardingData(): OnboardingData {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        const version = localStorage.getItem(this.VERSION_KEY);
        
        if (stored) {
          const parsedData = JSON.parse(stored);
          
          // Check if migration is needed
          if (version !== this.CURRENT_VERSION) {
            logger.info('Migrating onboarding data to new version', 'onboarding', {
              from: version,
              to: this.CURRENT_VERSION,
            });
            
            const migratedData = this.migrateOnboardingData(parsedData, version || '1.0.0');
            this.saveOnboardingData(migratedData);
            return migratedData;
          }
          
          return parsedData;
        }
      }
      
      logger.info('No onboarding data found, returning defaults', 'onboarding');
      return defaultOnboardingData;
    } catch (error) {
      logger.error('Failed to retrieve onboarding data', 'onboarding', error);
      return defaultOnboardingData;
    }
  }

  /**
   * Migrates onboarding data from older versions
   */
  private static migrateOnboardingData(data: any, fromVersion: string): OnboardingData {
    const migrated: OnboardingData = { ...defaultOnboardingData };

    // Migrate from version 1.0.0 to 2.0.0
    if (fromVersion === '1.0.0') {
      migrated.step = data.step || 1;
      migrated.completed = data.completed || false;
      migrated.userType = data.userType || 'small-business';
      migrated.industry = data.industry || 'general';
      migrated.goals = data.goals || [];
      migrated.preferences = {
        theme: data.preferences?.theme || 'system',
        notifications: data.preferences?.notifications !== false,
        language: 'nl',
        timezone: 'Europe/Amsterdam',
      };
      
      // Set default values for new fields
      migrated.teamSize = '1-5';
      migrated.usageGoals = ['offertes', 'factureren'];
      migrated.aiFeatureInterests = ['ai-offerte-generator'];
      migrated.workflowPreferences = {
        automationLevel: 'gemiddeld',
        integrationNeeds: ['email', 'boekhouding'],
        reportingFrequency: 'wekelijks',
      };
      migrated.progress = {
        stepsCompleted: [],
        lastUpdated: new Date().toISOString(),
        timeSpent: 0,
      };
      migrated.analytics = {
        onboardingStartTime: new Date().toISOString(),
        skippedSteps: [],
        helpRequests: 0,
      };
    }

    return migrated;
  }

  /**
   * Updates onboarding progress
   */
  static updateProgress(step: number, completed: boolean = true): boolean {
    try {
      const data = this.getOnboardingData();
      
      if (completed && !data.progress.stepsCompleted.includes(step)) {
        data.progress.stepsCompleted.push(step);
      }
      
      data.step = step;
      data.completed = completed;
      
      return this.saveOnboardingData(data);
    } catch (error) {
      logger.error('Failed to update onboarding progress', 'onboarding', error);
      return false;
    }
  }

  /**
   * Records analytics events
   */
  static recordAnalyticsEvent(event: 'step_completed' | 'step_skipped' | 'help_requested' | 'onboarding_completed', data?: any): void {
    try {
      const onboardingData = this.getOnboardingData();
      
      switch (event) {
        case 'step_completed':
          if (data?.step && !onboardingData.progress.stepsCompleted.includes(data.step)) {
            onboardingData.progress.stepsCompleted.push(data.step);
          }
          break;
        case 'step_skipped':
          if (data?.step && !onboardingData.analytics.skippedSteps.includes(data.step)) {
            onboardingData.analytics.skippedSteps.push(data.step);
          }
          break;
        case 'help_requested':
          onboardingData.analytics.helpRequests++;
          break;
        case 'onboarding_completed':
          onboardingData.analytics.completionTime = new Date().toISOString();
          onboardingData.completed = true;
          break;
      }
      
      this.saveOnboardingData(onboardingData);
      
      logger.info('Onboarding analytics event recorded', 'onboarding', { event, data });
    } catch (error) {
      logger.error('Failed to record onboarding analytics', 'onboarding', error);
    }
  }

  /**
   * Clears onboarding data (for testing or reset)
   */
  static clearOnboardingData(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.VERSION_KEY);
        logger.info('Onboarding data cleared', 'onboarding');
      }
    } catch (error) {
      logger.error('Failed to clear onboarding data', 'onboarding', error);
    }
  }

  /**
   * Gets onboarding completion percentage
   */
  static getCompletionPercentage(): number {
    const data = this.getOnboardingData();
    const totalSteps = 8; // Total onboarding steps
    const completedSteps = data.progress.stepsCompleted.length;
    return Math.round((completedSteps / totalSteps) * 100);
  }

  /**
   * Checks if onboarding is completed
   */
  static isOnboardingCompleted(): boolean {
    const data = this.getOnboardingData();
    return data.completed || this.getCompletionPercentage() >= 100;
  }
}

// Legacy functions for backward compatibility
export const saveOnboardingData = (data: OnboardingData): boolean => {
  return OnboardingService.saveOnboardingData(data);
};

export const getOnboardingData = (): OnboardingData => {
  return OnboardingService.getOnboardingData();
};

// Export the service as default
export default OnboardingService;