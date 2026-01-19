#!/usr/bin/env node
/**
 * Fix Circular Dependencies Script
 * Replaces './index' imports with direct imports
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Mapping of exports from components/index.ts
const EXPORT_MAPPING: Record<string, string> = {
  // Layout
  'Layout': './Layout',
  'Header': './Header',
  'Footer': './Footer',
  'BackToTopButton': './BackToTopButton',
  'MobileNavigation': './MobileNavigation',

  // Animation
  'AnimatedSection': './AnimatedSection',
  'StaggerContainer': './AnimatedSection',
  'StaggerItem': './AnimatedSection',
  'PageTransition': './PageTransition',

  // Hero & Main Sections
  'Hero': './Hero',
  'UspSection': './UspSection',
  'ProcessSteps': './ProcessSteps',
  'ReasonsSection': './ReasonsSection',
  'TestimonialsSection': './TestimonialsSection',
  'FinalCtaSection': './FinalCtaSection',

  // Services & Features
  'ServicesGrid': './ServicesGrid',
  'ServiceFeatures': './ServiceFeatures',
  'AfterHandoverSection': './AfterHandoverSection',
  'ResourcesSection': './ResourcesSection',
  'NotOfferedSection': './NotOfferedSection',

  // Pricing & Offer
  'PricingSection': './PricingSection',
  'OfferCalculator': './OfferCalculator',

  // Interactive Components
  'InteractiveTimeline': './InteractiveTimeline',

  // Utilities
  'ErrorBoundary': './ErrorBoundary',

  // Content Components
  'CommonErrors': './CommonErrors',
  'ChecklistTeaser': './ChecklistTeaser',
  'NewsletterSection': './NewsletterSection',

  // Projects & Showcase
  'ShowcasePreview': './ShowcasePreview',
  'DeviceMockupCarousel': './DeviceMockupCarousel',
  'BlogSection': './BlogSection',
};

function fixImportsInFile(filePath: string): void {
  const content = readFileSync(filePath, 'utf-8');
  let modified = false;

  // Find all imports from './index'
  const importRegex = /import\s+(?:(?!\{[\s\S]*?\}).)*?\{([^}]+)\}\s+from\s+['"]\.\/index['"];?/g;

  const newContent = content.replace(importRegex, (match, imports) => {
    // Parse imported items
    const items = imports.split(',').map(s => s.trim().split(' as ')[0].trim());
    const directImports: string[] = [];

    for (const item of items) {
      const targetPath = EXPORT_MAPPING[item];
      if (targetPath) {
        directImports.push(`{ ${item} } from '${targetPath}'`);
        modified = true;
      } else {
        // Keep items not in mapping as-is
        directImports.push(`{ ${item} } from './index'`);
      }
    }

    return directImports.map(imp => `import ${imp};`).join('\n');
  });

  if (modified) {
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✓ Fixed: ${filePath}`);
  }
}

// Get all files with circular imports
const filesWithCircularDeps = execSync(
  `grep -r "from './index'" components --include="*.tsx" --include="*.ts" -l`,
  { encoding: 'utf-8' }
).split('\n').filter(Boolean);

console.log(`Found ${filesWithCircularDeps.length} files with circular dependencies\n`);

filesWithCircularDeps.forEach(fixImportsInFile);

console.log('\n✅ Circular dependencies fixed!');
