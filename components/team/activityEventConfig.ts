// ============================================
// ACTIVITY EVENT CONFIGURATION
// Event type configurations for TeamActivityFeed
// ============================================

import React from 'react';

export type ActivityEventType =
    | 'member_invited'
    | 'member_joined'
    | 'member_removed'
    | 'role_changed'
    | 'permission_updated'
    | 'project_created'
    | 'project_updated'
    | 'project_deleted'
    | 'content_generated'
    | 'invoice_sent'
    | 'invoice_paid'
    | 'settings_updated'
    | 'login'
    | 'logout'
    | 'all';

export type ActivityCategory = 'all' | 'team' | 'project' | 'billing' | 'system';

export interface EventTypeConfig {
    label: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    borderColor: string;
    category: 'team' | 'project' | 'billing' | 'system';
}

export const eventTypeConfig: Record<ActivityEventType, EventTypeConfig> = {
    member_invited: {
        label: 'Member Invited',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8a3 3 0 013-3h12a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3V8zM12 8v4m0 0h4m-4 0H8" />
            </svg>
        ),
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-300 dark:border-blue-700',
        category: 'team'
    },
    member_joined: {
        label: 'Member Joined',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
        ),
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-300 dark:border-green-700',
        category: 'team'
    },
    member_removed: {
        label: 'Member Removed',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM13 7h4m-4 0v4m0-4h4" />
            </svg>
        ),
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-300',
        borderColor: 'border-red-300 dark:border-red-700',
        category: 'team'
    },
    role_changed: {
        label: 'Role Changed',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
        ),
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        borderColor: 'border-yellow-300 dark:border-yellow-700',
        category: 'team'
    },
    permission_updated: {
        label: 'Permission Updated',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        textColor: 'text-purple-700 dark:text-purple-300',
        borderColor: 'border-purple-300 dark:border-purple-700',
        category: 'team'
    },
    project_created: {
        label: 'Project Created',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
        ),
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-300 dark:border-green-700',
        category: 'project'
    },
    project_updated: {
        label: 'Project Updated',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-300 dark:border-blue-700',
        category: 'project'
    },
    project_deleted: {
        label: 'Project Deleted',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        ),
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-300',
        borderColor: 'border-red-300 dark:border-red-700',
        category: 'project'
    },
    content_generated: {
        label: 'Content Generated',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        textColor: 'text-indigo-700 dark:text-indigo-300',
        borderColor: 'border-indigo-300 dark:border-indigo-700',
        category: 'project'
    },
    invoice_sent: {
        label: 'Invoice Sent',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        borderColor: 'border-yellow-300 dark:border-yellow-700',
        category: 'billing'
    },
    invoice_paid: {
        label: 'Invoice Paid',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-300 dark:border-green-700',
        category: 'billing'
    },
    settings_updated: {
        label: 'Settings Updated',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        textColor: 'text-gray-700 dark:text-gray-300',
        borderColor: 'border-gray-300 dark:border-gray-700',
        category: 'system'
    },
    login: {
        label: 'Login',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
        ),
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        textColor: 'text-emerald-700 dark:text-emerald-300',
        borderColor: 'border-emerald-300 dark:border-emerald-700',
        category: 'system'
    },
    logout: {
        label: 'Logout',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
        ),
        bgColor: 'bg-slate-50 dark:bg-slate-900/20',
        textColor: 'text-slate-700 dark:text-slate-300',
        borderColor: 'border-slate-300 dark:border-slate-700',
        category: 'system'
    },
    all: {
        label: 'All Events',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
        ),
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        textColor: 'text-gray-700 dark:text-gray-300',
        borderColor: 'border-gray-300 dark:border-gray-700',
        category: 'system'
    }
};

export const categoryFilters: Record<ActivityCategory, ActivityEventType[]> = {
    all: ['all'],
    team: ['member_invited', 'member_joined', 'member_removed', 'role_changed', 'permission_updated'],
    project: ['project_created', 'project_updated', 'project_deleted', 'content_generated'],
    billing: ['invoice_sent', 'invoice_paid'],
    system: ['settings_updated', 'login', 'logout']
};
