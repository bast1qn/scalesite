import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamRole } from './RoleBadge';

/**
 * TeamInvite Component
 *
 * Form for inviting new team members
 *
 * @param onInvite - Callback when invite is sent
 * @param isLoading - Loading state
 * @param className - Additional CSS classes
 */

export interface TeamInviteProps {
    onInvite: (email: string, role: TeamRole, message?: string) => Promise<void>;
    isLoading?: boolean;
    className?: string;
}

const TeamInvite: React.FC<TeamInviteProps> = ({
    onInvite,
    isLoading = false,
    className = ''
}) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<TeamRole>('Member');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ email?: string }>({});
    const [showSuccess, setShowSuccess] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const newErrors: { email?: string } = {};
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Invalid email format';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Send invite
        try {
            await onInvite(email.trim(), role, message.trim() || undefined);

            // Show success message
            setShowSuccess(true);

            // Reset form
            setEmail('');
            setRole('Member');
            setMessage('');
            setErrors({});

            // Hide success message after 3 seconds
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to send invite:', error);
        }
    };

    const roles: { value: TeamRole; label: string; description: string }[] = [
        {
            value: 'Admin',
            label: 'Admin',
            description: 'Full access to team settings and member management'
        },
        {
            value: 'Member',
            label: 'Member',
            description: 'Can access and edit projects'
        },
        {
            value: 'Viewer',
            label: 'Viewer',
            description: 'Read-only access to projects'
        }
    ];

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Invite Team Member
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Send an invitation to join your team
                </p>
            </div>

            {/* Success Message */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                Invitation sent successfully!
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({});
                        }}
                        placeholder="colleague@example.com"
                        disabled={isLoading}
                        className={`
                            w-full px-4 py-2 rounded-lg border
                            bg-white dark:bg-gray-900
                            text-gray-900 dark:text-gray-100
                            placeholder-gray-400 dark:placeholder-gray-500
                            transition-colors duration-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            ${errors.email
                                ? 'border-red-300 dark:border-red-700'
                                : 'border-gray-300 dark:border-gray-600'
                            }
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Role Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Role <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                        {roles.map((roleOption) => (
                            <label
                                key={roleOption.value}
                                className={`
                                    flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                                    ${role === roleOption.value
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                    }
                                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value={roleOption.value}
                                    checked={role === roleOption.value}
                                    onChange={(e) => setRole(e.target.value as TeamRole)}
                                    disabled={isLoading}
                                    className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {roleOption.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                        {roleOption.description}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Personal Message (Optional) */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Personal Message <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a personal note to your invitation..."
                        rows={3}
                        disabled={isLoading}
                        maxLength={500}
                        className={`
                            w-full px-4 py-2 rounded-lg border
                            bg-white dark:bg-gray-900
                            text-gray-900 dark:text-gray-100
                            placeholder-gray-400 dark:placeholder-gray-500
                            transition-colors duration-200
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            border-gray-300 dark:border-gray-600
                            resize-none
                            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                        {message.length} / 500
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    className={`
                        w-full px-6 py-3 rounded-lg font-semibold
                        transition-all duration-200
                        flex items-center justify-center gap-2
                        ${isLoading || !email.trim()
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                        }
                    `}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending Invite...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send Invitation
                        </>
                    )}
                </button>
            </form>

            {/* Info Note */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>
                        The invited user will receive an email with a link to join your team.
                        The invitation expires in 7 days.
                    </span>
                </p>
            </div>
        </div>
    );
};

export default TeamInvite;
