#!/usr/bin/env node

// ========================================================================
// SCRIPT: Fix Framer Motion Imports for Tree-Shaking
// ========================================================================
// Replaces direct imports from 'framer-motion' with '@/lib/motion'
// This enables proper tree-shaking and reduces bundle size
// ========================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const componentsDir = './components';
const pagesDir = './pages';
const libDir = './lib';

const replacements = [
  // Replace direct imports
  {
    pattern: /from ['"]framer-motion['"]/g,
    replacement: "from '@/lib/motion'"
  },
  // Fix destructured imports
  {
    pattern: /import\s*{([^}]+)}\s*from\s*['"]@\/lib\/motion['"]/g,
    replacement: (match, imports) => {
      // Clean up the imports
      const cleanedImports = imports.split(',').map(i => i.trim()).join(', ');
      return `import { ${cleanedImports} } from '@/lib/motion'`;
    }
  }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const { pattern, replacement } of replacements) {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

function walkDirectory(dir, callback) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath, callback);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      callback(filePath);
    }
  }
}

console.log('🔧 Fixing Framer Motion imports...\n');

let fixedCount = 0;
walkDirectory(componentsDir, (file) => {
  if (processFile(file)) fixedCount++;
});
walkDirectory(pagesDir, (file) => {
  if (processFile(file)) fixedCount++;
});
walkDirectory(libDir, (file) => {
  if (processFile(file)) fixedCount++;
});

console.log(`\n✅ Fixed ${fixedCount} files`);
console.log('\n📊 Running TypeScript check...\n');

try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('\n✅ TypeScript check passed!');
} catch (error) {
  console.log('\n⚠️  TypeScript check failed - please review changes');
  process.exit(1);
}
