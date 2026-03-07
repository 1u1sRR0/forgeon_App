// Feature flags for the application

export const features = {
  // Course system feature flag
  courseSystem: process.env.NEXT_PUBLIC_ENABLE_COURSE_SYSTEM === 'true',
  
  // Opportunities discovery
  opportunities: true,
  
  // Market gaps analysis
  marketGaps: true,
  
  // Market intelligence
  marketIntelligence: true,
  
  // Assistant system
  assistant: true,
  
  // Floating assistant widget
  floatingWidget: true,
  
  // OAuth providers
  oauth: {
    google: !!process.env.GOOGLE_CLIENT_ID,
    github: !!process.env.GITHUB_CLIENT_ID,
  },
};

export function isFeatureEnabled(feature: keyof typeof features): boolean {
  const value = features[feature];
  return typeof value === 'boolean' ? value : false;
}
