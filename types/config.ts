/**
 * Configuration Type Definitions
 * Centralized types for configurator and configuration components
 */

// ============================================================================
// COLOR PALETTE TYPES
// ============================================================================

/**
 * Color role in palette
 */
export type ColorRole = 'primary' | 'secondary' | 'accent' | 'background' | 'text' | 'border';

/**
 * Color palette data
 */
export interface ColorPalette {
  id?: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  isCustom?: boolean;
}

/**
 * Preset color palettes
 */
export interface PresetPalette {
  name: string;
  colors: ColorPalette;
  description?: string;
}

// ============================================================================
// LAYOUT TYPES
// ============================================================================

/**
 * Layout types
 */
export type LayoutType = 'modern' | 'classic' | 'minimal' | 'bold' | 'corporate';

/**
 * Container width presets
 */
export type ContainerWidth = 'narrow' | 'medium' | 'wide' | 'full';

/**
 * Spacing scale
 */
export type SpacingScale = 'compact' | 'comfortable' | 'spacious';

/**
 * Layout configuration
 */
export interface LayoutConfig {
  type: LayoutType;
  containerWidth: ContainerWidth;
  spacing: SpacingScale;
  borderRadius: 'sharp' | 'rounded' | 'circular';
  shadowIntensity: 'none' | 'light' | 'medium' | 'heavy';
  headerStyle: 'static' | 'sticky' | 'floating';
  footerStyle: 'simple' | 'rich' | 'minimal';
}

// ============================================================================
// TYPOGRAPHY TYPES
// ============================================================================

/**
 * Font family categories
 */
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display';

/**
 * Font weight values
 */
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Typography scale
 */
export type TypographyScale = 'small' | 'medium' | 'large' | 'extra_large';

/**
 * Typography configuration
 */
export interface TypographyConfig {
  fontFamily: FontFamily;
  headingFont?: FontFamily;
  scale: TypographyScale;
  lineHeight: 'tight' | 'normal' | 'relaxed';
  headingWeight: FontWeight;
  bodyWeight: FontWeight;
}

/**
 * Font preset data
 */
export interface FontPreset {
  name: string;
  family: string;
  category: FontFamily;
  weights: FontWeight[];
  preview?: string;
}

// ============================================================================
// COMPONENT STYLE TYPES
// ============================================================================

/**
 * Button style variants
 */
export type ButtonStyle = 'solid' | 'outline' | 'ghost' | 'link';

/**
 * Button shape
 */
export type ButtonShape = 'rectangle' | 'rounded' | 'pill' | 'circle';

/**
 * Card style
 */
export type CardStyle = 'flat' | 'elevated' | 'outlined' | 'gradient';

/**
 * Input field style
 */
export type InputStyle = 'underline' | 'outline' | 'filled' | 'none';

/**
 * Component style configuration
 */
export interface ComponentStyleConfig {
  buttons: {
    style: ButtonStyle;
    shape: ButtonShape;
    size: 'small' | 'medium' | 'large';
  };
  cards: {
    style: CardStyle;
    padding: 'none' | 'small' | 'medium' | 'large';
  };
  inputs: {
    style: InputStyle;
    size: 'small' | 'medium' | 'large';
  };
}

// ============================================================================
// WEBSITE CONFIGURATION TYPES
// ============================================================================

/**
 * Complete website configuration
 */
export interface WebsiteConfig {
  id?: string;
  project_id: string;
  colors: ColorPalette;
  layout: LayoutConfig;
  typography: TypographyConfig;
  components: ComponentStyleConfig;
  custom_css?: string;
  custom_js?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Configuration preset
 */
export interface ConfigPreset {
  id: string;
  name: string;
  description?: string;
  category: 'business' | 'creative' | 'minimal' | 'corporate' | 'ecommerce';
  config: Partial<WebsiteConfig>;
  preview_image?: string;
}

// ============================================================================
// CONFIGURATOR COMPONENT PROPS
// ============================================================================

/**
 * Props for Configurator component
 */
export interface ConfiguratorProps {
  projectId: string;
  initialConfig?: WebsiteConfig;
  onSave?: (config: WebsiteConfig) => void;
  onPreview?: (config: WebsiteConfig) => void;
  allowCustomCSS?: boolean;
  allowCustomJS?: boolean;
  presets?: ConfigPreset[];
}

/**
 * Props for ColorPalettePicker component
 */
export interface ColorPalettePickerProps {
  selectedPalette: ColorPalette;
  onChange: (palette: ColorPalette) => void;
  presets?: PresetPalette[];
  allowCustom?: boolean;
}

/**
 * Props for LayoutSelector component
 */
export interface LayoutSelectorProps {
  selectedLayout: LayoutConfig;
  onChange: (layout: LayoutConfig) => void;
  presets?: Partial<LayoutConfig>[];
}

/**
 * Props for TypographyPicker component
 */
export interface TypographyPickerProps {
  selectedTypography: TypographyConfig;
  onChange: (typography: TypographyConfig) => void;
  fontPresets?: FontPreset[];
}
