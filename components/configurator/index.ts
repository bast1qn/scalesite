/**
 * Configurator Module - Barrel Export
 *
 * ARCHITECTURE: Enterprise-grade module organization
 * PURPOSE: Single entry point for all configurator components
 * BENEFITS:
 * - Clean import paths: import { Configurator } from '@/components/configurator'
 * - Tree-shaking friendly
 * - Prevents circular dependencies
 * - Clear module boundaries
 */

// Main component
export { Configurator } from './Configurator';

// Sub-components
export { ColorPalettePicker } from './ColorPalettePicker';
export { ContentEditor } from './ContentEditor';
export { DeviceToggle } from './DeviceToggle';
export { LayoutSelector } from './LayoutSelector';
export { PreviewFrame } from './PreviewFrame';
export { AIContentGenerator } from './AIContentGenerator';

// Types
export type {
    DeviceType,
    ColorPalette,
    ContentConfig,
    ProjectConfig
} from './Configurator';

// Constants
export { getDefaultColors, getDefaultContent } from './Configurator';
