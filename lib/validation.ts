export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('min_length');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('lowercase');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('uppercase');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('number');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
};
