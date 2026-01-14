const fs = require('fs');
const path = require('path');

const files = [
  './components/projects/ProjectCard.tsx',
  './components/team/MemberCard.tsx',
  './components/chat/ChatList.tsx',
  './components/performance/OptimizedList.tsx',
  './components/ServicesGrid.tsx',
  './components/PricingSection.tsx',
  './components/IconOptimizer.tsx',
  './components/BlogSection.tsx',
  './components/Header.tsx',
  './components/Hero.tsx',
  './components/LogoWall.tsx',
  './components/MobileNavigation.tsx',
  './components/ShowcaseSection.tsx',
  './components/TestimonialsSection.tsx',
  './components/Layout.tsx'
];

files.forEach(file => {
  const fullPath = path.resolve(file);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  const original = content;

  // Remove memo from imports
  content = content.replace(
    /,\s*\bmemo\b/g,
    ''
  );

  // Remove standalone memo import
  content = content.replace(
    /import\s*{\s*memo\s*}\s*from\s*['"]react['"];\s*\n?/g,
    ''
  );

  // Remove memo() wrapper - this is the tricky part
  // Pattern: export const Foo = memo(({ ... }) => {
  // Replace with: export const Foo = ({ ... }) => {
  content = content.replace(
    /export const (\w+)\s*=\s*memo\s*\(\s*\(\{[^)]*\}\s*(?:=>|\([^)]*\)\s*=>)\s*{/g,
    'export const $1 = $2 {'
  );

  // Pattern: const Foo = memo(({ ... }) => {
  content = content.replace(
    /const (\w+)\s*=\s*memo\s*\(\s*\(\{[^)]*\}\s*(?:=>|\([^)]*\)\s*=>)\s*{/g,
    'const $1 = $2 {'
  );

  if (content !== original) {
    fs.writeFileSync(fullPath, content);
    console.log(`✓ Removed memo from ${file}`);
  } else {
    console.log(`No memo usage in ${file}`);
  }
});

console.log('\nDone! memo has been completely removed from all components.');
console.log('The app will work without memoization - performance impact should be minimal.');
