// Clerk availability check
export const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const isClerkAvailable = !!clerkPubKey;
