// Newsletter Components

// Foundation (Woche 23)
export { default as CampaignList } from './CampaignList';
export type { Campaign, CampaignStats, CampaignListProps } from './CampaignList';

export { default as CampaignBuilder } from './CampaignBuilder';
export type { CampaignData, CampaignBuilderProps } from './CampaignBuilder';

export { default as SubscriberList } from './SubscriberList';
export type { Subscriber, SubscriberStatus, SubscriberListProps } from './SubscriberList';

export { default as EmailPreview } from './EmailPreview';
export type { EmailPreviewProps } from './EmailPreview';

// Sending & Integration (Woche 24)
export { default as SendGridIntegration } from './SendGridIntegration';
export type { SendingStats, SendGridIntegrationProps } from './SendGridIntegration';

export { default as CampaignScheduler } from './CampaignScheduler';
export type { ScheduledCampaign, CampaignSchedulerProps } from './CampaignScheduler';

// Analytics (Woche 24)
export { default as AnalyticsCharts } from './AnalyticsCharts';
export type { CampaignAnalytics, AnalyticsChartsProps } from './AnalyticsCharts';

// Automation (Woche 24)
export { default as AutomationRules } from './AutomationRules';
export type { AutomationRule, AutomationRulesProps } from './AutomationRules';

// Unsubscribe (Woche 24)
export { default as UnsubscribeHandler } from './UnsubscribeHandler';
export type { UnsubscribeHandlerProps } from './UnsubscribeHandler';
