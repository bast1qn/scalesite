/**
 * User Mapping Service
 * Single Responsibility: Transform external user data to internal format
 */

import type { AppUser } from './AuthTypes';
import type { User } from '@clerk/clerk-react';

export class UserMapper {
  /**
   * Maps Clerk user to AppUser format
   */
  static mapClerkUserToAppUser(clerkUser: User): AppUser {
    const unsafeMetadata = clerkUser.unsafeMetadata || {};
    const emailAddresses = clerkUser.emailAddresses;
    const primaryEmail = emailAddresses && emailAddresses.length > 0
      ? emailAddresses[0]?.emailAddress
      : null;

    return {
      id: clerkUser.id,
      name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim()
        || unsafeMetadata.name?.toString() || '',
      email: primaryEmail || unsafeMetadata.email?.toString() || '',
      company: (unsafeMetadata.company?.toString()) || null,
      role: (unsafeMetadata.role?.toString() as 'team' | 'user' | 'owner') || 'user',
      referral_code: (unsafeMetadata.referral_code?.toString()) || null
    };
  }

  /**
   * Validates that user data meets minimum requirements
   */
  static validateAppUser(user: AppUser | null): user is AppUser {
    return user !== null
      && typeof user.id === 'string'
      && typeof user.email === 'string'
      && user.email.length > 0;
  }
}
