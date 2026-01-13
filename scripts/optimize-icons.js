#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Mapping of lucide-react icon names to their file paths
// This maps icon names from PascalCase to kebab-case
const toKebabCase = (str) => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

const optimizeFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Match lucide-react imports
    const importRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"];/g;
    const matches = [...content.matchAll(importRegex)];

    matches.forEach(match => {
        const imports = match[1].split(',').map(s => s.trim()).filter(Boolean);
        if (imports.length === 0) return;

        // Generate individual imports
        const individualImports = imports.map(icon => {
            const kebabName = toKebabCase(icon);
            return `import ${icon} from 'lucide-react/dist/esm/icons/${kebabName}';`;
        }).join('\n');

        // Replace the original import
        content = content.replace(match[0], individualImports);
        modified = true;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Optimized: ${filePath}`);
        return true;
    }
    return false;
};

// Find all .tsx and .ts files
const findFiles = (dir, ext = ['.tsx', '.ts']) => {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // Skip node_modules and dist
            if (!['node_modules', 'dist', '.git'].includes(entry.name)) {
                files.push(...findFiles(fullPath, ext));
            }
        } else if (ext.some(e => entry.name.endsWith(e))) {
            files.push(fullPath);
        }
    }
    return files;
};

// Main execution
const componentsDir = path.join(__dirname, '..', 'components');
const files = findFiles(componentsDir);

console.log(`🔍 Found ${files.length} files to check...`);
let optimizedCount = 0;

files.forEach(file => {
    try {
        if (optimizeFile(file)) {
            optimizedCount++;
        }
    } catch (error) {
        console.error(`✗ Error processing ${file}:`, error.message);
    }
});

console.log(`\n✨ Optimized ${optimizedCount} files!`);

// Build to verify
console.log('\n🔨 Building to verify...');
try {
    execSync('npm run build', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('\n✅ Build successful!');
} catch (error) {
    console.error('\n❌ Build failed. Please check for errors.');
    process.exit(1);
}
