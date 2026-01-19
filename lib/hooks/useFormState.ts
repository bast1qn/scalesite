/**
 * useFormState Hook
 * Manages form state, validation, and submission
 * Consolidates duplicate form state logic across components
 */

import { useState, useCallback, FormEvent } from 'react';

export interface UseFormStateOptions<T> {
  /** Initial form values */
  initialValues: T;
  /** Validation function */
  validate?: (values: T) => Record<keyof T, string> | Record<string, string> | null;
  /** Submit handler */
  onSubmit: (values: T) => Promise<void> | void;
  /** Reset form after successful submit */
  resetOnSubmit?: boolean;
  /** Callback on successful submit */
  onSuccess?: () => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

export interface UseFormStateReturn<T> {
  /** Current form values */
  values: T;
  /** Update a single field value */
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  /** Update multiple field values */
  setFields: (fields: Partial<T>) => void;
  /** Reset form to initial values */
  reset: () => void;
  /** Current validation errors */
  errors: Record<keyof T, string> | Record<string, string>;
  /** Whether form has validation errors */
  hasErrors: boolean;
  /** Clear all errors */
  clearErrors: () => void;
  /** Clear error for a specific field */
  clearFieldError: <K extends keyof T>(field: K) => void;
  /** Whether form is submitting */
  isSubmitting: boolean;
  /** Whether form is dirty (has unsaved changes) */
  isDirty: boolean;
  /** Submit handler */
  handleSubmit: (event?: FormEvent) => Promise<void>;
  /** Validate form */
  validateForm: () => boolean;
}

/**
 * Hook for managing form state and validation
 * @param options - Form configuration options
 * @returns Form state and methods
 */
export function useFormState<T extends Record<string, any>>(
  options: UseFormStateOptions<T>
): UseFormStateReturn<T> {
  const {
    initialValues,
    validate,
    onSubmit,
    resetOnSubmit = false,
    onSuccess,
    onError,
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);

    // Clear error for this field when value changes
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setFields = useCallback((fields: Partial<T>) => {
    setValues((prev) => ({ ...prev, ...fields }));
    setIsDirty(true);
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsDirty(false);
    setIsSubmitting(false);
  }, [initialValues]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback(<K extends keyof T>(field: K) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!validate) return true;

    const validationErrors = validate(values);
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return false;
    }

    clearErrors();
    return true;
  }, [values, validate, clearErrors]);

  const handleSubmit = useCallback(async (event?: FormEvent) => {
    event?.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);

      if (resetOnSubmit) {
        reset();
      } else {
        setIsDirty(false);
      }

      onSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('An error occurred');
      onError?.(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit, resetOnSubmit, reset, onSuccess, onError]);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    values,
    setFieldValue,
    setFields,
    reset,
    errors,
    hasErrors,
    clearErrors,
    clearFieldError,
    isSubmitting,
    isDirty,
    handleSubmit,
    validateForm,
  };
}

/**
 * Hook for managing modal state
 * @param initialOpen - Initial modal open state
 * @returns Modal state and methods
 */
export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [data, setData] = useState<any>(null);

  const open = useCallback((modalData?: any) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    isClosed: !isOpen,
    data,
    open,
    close,
    toggle,
    setData,
  };
}

/**
 * Hook for managing tab state
 * @param initialTab - Initial active tab
 * @returns Tab state and methods
 */
export function useTabs<T extends string>(initialTab: T) {
  const [activeTab, setActiveTab] = useState<T>(initialTab);

  const isActiveTab = useCallback((tab: T): boolean => {
    return activeTab === tab;
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    isActiveTab,
  };
}
