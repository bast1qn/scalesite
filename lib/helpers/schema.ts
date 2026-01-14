import { SCHEMA_CONSTANTS } from '../constants/schema';

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const downloadFile = (content: string, filename: string, mimeType = 'text/html'): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const generateJsonLdScript = (schema: Record<string, unknown>): string => {
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
};

export const validateJson = (data: unknown): boolean => {
  try {
    JSON.stringify(data);
    return true;
  } catch {
    return false;
  }
};

export const createCopyHandler = (
  getCopiedState: () => boolean,
  setCopiedState: (value: boolean) => void,
  content: string
): () => void => {
  return () => {
    copyToClipboard(content);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), SCHEMA_CONSTANTS.COPY_FEEDBACK_DURATION);
  };
};

export const clearFormData = <T extends Record<string, unknown>>(
  formData: T,
  setFormData: (data: T) => void
): void => {
  const cleared = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: '' }), {} as T);
  setFormData(cleared);
};

export const parseFloatSafe = (value: string): number | null => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
};

export const parseIntSafe = (value: string): number | null => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
};
