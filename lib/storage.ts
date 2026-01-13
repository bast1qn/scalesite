// ============================================
// STORAGE - File Upload Management
// Supabase Storage Integration
// ============================================

import { supabase } from './supabase';

interface UploadResult {
    success: boolean;
    url?: string;
    path?: string;
    error?: string;
}

interface FileMetadata {
    name: string;
    size: number;
    type: string;
}

/**
 * Upload a file to Supabase Storage
 * @param file - File object to upload
 * @param path - Storage path (e.g., 'uploads/avatars/', 'attachments/')
 * @param bucket - Bucket name (default: 'attachments')
 * @returns Upload result with public URL
 */
export const uploadFile = async (
    file: File,
    path: string = 'uploads/',
    bucket: string = 'attachments'
): Promise<UploadResult> => {
    try {
        // Validate file
        const validation = validateFile(file);
        if (!validation.isValid) {
            return { success: false, error: validation.errors[0] };
        }

        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}-${random}.${extension}`;
        const filePath = `${path}${filename}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (error) {
            console.error('Upload error:', error);
            return { success: false, error: error.message };
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return {
            success: true,
            url: publicUrl,
            path: data.path
        };
    } catch (error) {
        console.error('Upload exception:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed'
        };
    }
};

/**
 * Upload multiple files
 * @param files - Array of files to upload
 * @param path - Storage path
 * @param bucket - Bucket name
 * @returns Array of upload results
 */
export const uploadMultipleFiles = async (
    files: File[],
    path: string = 'uploads/',
    bucket: string = 'attachments'
): Promise<UploadResult[]> => {
    const uploadPromises = files.map(file => uploadFile(file, path, bucket));
    return Promise.all(uploadPromises);
};

/**
 * Delete a file from Supabase Storage
 * @param path - File path in storage
 * @param bucket - Bucket name
 * @returns Success status
 */
export const deleteFile = async (
    path: string,
    bucket: string = 'attachments'
): Promise<{ success: boolean; error?: string }> => {
    try {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Delete failed'
        };
    }
};

/**
 * Get a public URL for a file
 * @param path - File path in storage
 * @param bucket - Bucket name
 * @returns Public URL
 */
export const getPublicUrl = (
    path: string,
    bucket: string = 'attachments'
): string => {
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
};

/**
 * List all files in a bucket/path
 * @param path - Path to list
 * @param bucket - Bucket name
 * @returns Array of files
 */
export const listFiles = async (
    path?: string,
    bucket: string = 'attachments'
) => {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .list(path);

        if (error) {
            return { files: [], error: error.message };
        }

        return { files: data || [], error: null };
    } catch (error) {
        return {
            files: [],
            error: error instanceof Error ? error.message : 'List failed'
        };
    }
};

// ============================================
// FILE VALIDATION
// ============================================

interface ValidationResult {
    isValid: boolean;
    errors: string[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv'
];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];

/**
 * Validate file before upload
 * @param file - File to validate
 * @returns Validation result
 */
const validateFile = (file: File): ValidationResult => {
    const errors: string[] = [];

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        errors.push(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push('File type not allowed');
    }

    // Check for empty file
    if (file.size === 0) {
        errors.push('File is empty');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validate image file
 * @param file - File to validate
 * @returns Validation result
 */
export const validateImageFile = (file: File): ValidationResult => {
    const errors: string[] = [];

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        errors.push('Invalid image format. Allowed: JPEG, PNG, GIF, WebP');
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB for images
        errors.push('Image size exceeds 5MB limit');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validate document file
 * @param file - File to validate
 * @returns Validation result
 */
export const validateDocumentFile = (file: File): ValidationResult => {
    const errors: string[] = [];

    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
        errors.push('Invalid document format. Allowed: PDF, DOC, DOCX, TXT, CSV');
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB for documents
        errors.push('Document size exceeds 20MB limit');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Get file extension from filename
 * @param filename - File name
 * @returns File extension (e.g., "jpg")
 */
export const getFileExtension = (filename: string): string => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Check if file is an image
 * @param file - File to check
 * @returns True if file is an image
 */
export const isImage = (file: File): boolean => {
    return ALLOWED_IMAGE_TYPES.includes(file.type);
};

/**
 * Check if file is a document
 * @param file - File to check
 * @returns True if file is a document
 */
export const isDocument = (file: File): boolean => {
    return ALLOWED_DOCUMENT_TYPES.includes(file.type);
};
