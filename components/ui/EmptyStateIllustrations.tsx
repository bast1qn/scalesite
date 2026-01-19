// React
import { type ReactNode } from 'react';

/**
 * Empty State Illustrations - Beautiful SVG illustrations for empty states
 *
 * These are minimal, clean illustrations inspired by Linear and Vercel's design language.
 * They use consistent stroke widths (2px) and subtle animations.
 */

// ============================================================================
// GENERIC EMPTY STATE
// ============================================================================

export const EmptyIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Document outline */}
    <rect x="28" y="16" width="72" height="96" rx="8" stroke="currentColor" strokeWidth="2" />
    {/* Document lines */}
    <path d="M40 40H88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 56H88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 72H72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Magnifying glass */}
    <circle cx="84" cy="84" r="20" stroke="currentColor" strokeWidth="2" />
    <path d="M98 98L110 110" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ============================================================================
// NO TICKETS ILLUSTRATION
// ============================================================================

export const EmptyTicketsIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Ticket outline */}
    <path
      d="M24 48C24 40 24 36 28 36H100C104 36 104 40 104 48V52C104 56 100 56 96 56C92 56 88 60 88 64C88 68 92 72 96 72C100 72 104 72 104 76V80C104 88 104 92 100 92H28C24 92 24 88 24 80V76C24 72 28 72 32 72C36 72 40 68 40 64C40 60 36 56 32 56C28 56 24 56 24 52V48Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Ticket divider */}
    <path d="M24 64H104" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
    {/* Plus icon */}
    <circle cx="64" cy="64" r="12" stroke="currentColor" strokeWidth="2" />
    <path d="M64 58V70M58 64H70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ============================================================================
// NO PROJECTS ILLUSTRATION
// ============================================================================

export const EmptyProjectsIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Folder outline */}
    <path
      d="M16 40C16 32 16 28 20 28H48L56 36H108C112 36 112 40 112 48V88C112 96 112 100 108 100H20C16 100 16 96 16 88V40Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Plus icon */}
    <circle cx="64" cy="68" r="16" stroke="currentColor" strokeWidth="2" />
    <path d="M64 60V76M56 68H72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ============================================================================
// NO ANALYTICS ILLUSTRATION
// ============================================================================

export const EmptyAnalyticsIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Chart outline */}
    <path d="M24 104V56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 104H104" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Empty bars */}
    <path d="M36 104V76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    <path d="M52 104V68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    <path d="M68 104V60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    <path d="M84 104V72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
  </svg>
);

// ============================================================================
// NO MESSAGES ILLUSTRATION
// ============================================================================

export const EmptyMessagesIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Message bubble */}
    <path
      d="M24 40C24 32 24 28 28 28H100C104 28 104 32 104 40V72C104 80 104 84 100 84H40L24 96V84H28C24 84 24 80 24 72V40Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Dots */}
    <circle cx="44" cy="56" r="3" fill="currentColor" />
    <circle cx="64" cy="56" r="3" fill="currentColor" />
    <circle cx="84" cy="56" r="3" fill="currentColor" />
  </svg>
);

// ============================================================================
// NO SEARCH RESULTS ILLUSTRATION
// ============================================================================

export const EmptySearchIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Magnifying glass */}
    <circle cx="52" cy="52" r="32" stroke="currentColor" strokeWidth="2" />
    <path d="M76 76L104 104" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Question mark */}
    <path
      d="M52 36V32C52 28 56 24 60 24C64 24 68 28 68 32V36C68 40 64 44 60 44V48"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="52" cy="56" r="2" fill="currentColor" />
  </svg>
);

// ============================================================================
// NO NOTIFICATIONS ILLUSTRATION
// ============================================================================

export const EmptyNotificationsIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Bell outline */}
    <path
      d="M64 24C48 24 36 36 36 52V64L28 76V80H100V76L92 64V52C92 36 80 24 64 24Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Bell clapper */}
    <path d="M56 84C56 92 60 96 64 96C68 96 72 92 72 84" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Zzz indicator */}
    <path d="M84 28L88 32L84 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M92 36L96 40L92 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// NO TEAM MEMBERS ILLUSTRATION
// ============================================================================

export const EmptyTeamIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Person 1 */}
    <circle cx="40" cy="40" r="12" stroke="currentColor" strokeWidth="2" />
    <path d="M24 80V68C24 64 28 60 32 60H48C52 60 56 64 56 68V80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Person 2 */}
    <circle cx="88" cy="40" r="12" stroke="currentColor" strokeWidth="2" />
    <path d="M72 80V68C72 64 76 60 80 60H96C100 60 104 64 104 68V80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Plus icon */}
    <circle cx="64" cy="64" r="8" fill="currentColor" />
    <path d="M64 60V68M60 64H68" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// ============================================================================
// ERROR ILLUSTRATIONS
// ============================================================================

export const NetworkErrorIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Computer */}
    <path
      d="M24 32H104C108 32 108 36 108 40V72C108 76 108 80 104 80H24C20 80 20 76 20 72V40C20 36 20 32 24 32Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M48 80V88H80V80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 88H88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* X mark */}
    <path d="M52 52L76 76M76 52L52 76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const NotFoundIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* File */}
    <path
      d="M36 20H76L92 36V100C92 104 92 108 88 108H36C32 108 32 104 32 100V28C32 24 32 20 36 20Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path d="M76 20V36H92" stroke="currentColor" strokeWidth="2" />
    {/* 404 text */}
    <path d="M44 64H52L44 52M52 64L44 76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M56 52V76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M68 64H76L68 52M76 64L68 76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const PermissionIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Lock body */}
    <path
      d="M40 56H88C92 56 92 60 92 64V88C92 92 92 96 88 96H40C36 96 36 92 36 88V64C36 60 36 56 40 56Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    {/* Lock shackle */}
    <path d="M48 56V44C48 36 52 32 64 32C76 32 80 36 80 44V56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Keyhole */}
    <circle cx="64" cy="76" r="6" stroke="currentColor" strokeWidth="2" />
    <path d="M64 82V88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TimeoutIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Clock */}
    <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="2" />
    {/* Clock hands */}
    <path d="M64 40V64L80 80" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Hour markers */}
    <path d="M64 28V32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M64 96V100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M28 64H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M96 64H100" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const GenericErrorIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Warning triangle */}
    <path
      d="M64 16L108 96H20L64 16Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Exclamation mark */}
    <path d="M64 44V68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="64" cy="80" r="3" fill="currentColor" />
  </svg>
);

// ============================================================================
// SUCCESS ILLUSTRATIONS
// ============================================================================

export const SuccessIllustration = (): ReactNode => (
  <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Circle */}
    <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="2" />
    {/* Checkmark */}
    <path d="M44 64L56 76L84 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ============================================================================
// EXPORT ALL
// ============================================================================

export const illustrations = {
  empty: EmptyIllustration,
  tickets: EmptyTicketsIllustration,
  projects: EmptyProjectsIllustration,
  analytics: EmptyAnalyticsIllustration,
  messages: EmptyMessagesIllustration,
  search: EmptySearchIllustration,
  notifications: EmptyNotificationsIllustration,
  team: EmptyTeamIllustration,

  // Errors
  network: NetworkErrorIllustration,
  notFound: NotFoundIllustration,
  permission: PermissionIllustration,
  timeout: TimeoutIllustration,
  generic: GenericErrorIllustration,

  // Success
  success: SuccessIllustration,
} as const;

export default illustrations;
