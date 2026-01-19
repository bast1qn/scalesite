/**
 * Onboarding Type Definitions
 *
 * PURPOSE: Shared types to avoid circular dependencies
 * LOCATION: components/onboarding/types.ts
 * ARCHITECTURE: Enterprise-grade type organization
 */

/**
 * Onboarding Step Type
 */
export type OnboardingStep = 'basic-info' | 'business-data' | 'design-prefs' | 'content-req';

/**
 * Onboarding Data Interface
 * Contains all data collected during the onboarding process
 */
export interface OnboardingData {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;

  // Step 2: Business Data (Woche 6)
  companyName?: string;
  logoUrl?: string;
  industry?: string;
  websiteType?: string;

  // Step 3: Design Preferences (Woche 6)
  colorPalette?: string;
  layout?: string;
  font?: string;

  // Step 4: Content Requirements (Woche 6)
  requiredPages?: string[];
  features?: string[];
  timeline?: string;
  budget?: string;
}

/**
 * Step Props Interface
 */
export interface StepProps {
  data: OnboardingData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (field: string, value: string) => void;
}
