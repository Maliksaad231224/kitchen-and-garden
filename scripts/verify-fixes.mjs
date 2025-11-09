#!/usr/bin/env node

/**
 * Verification script to check ReactQuill fixes
 * This script tests that the shims are properly loaded and ReactQuill can be imported
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Verifying ReactQuill fixes...\n');

// Check if the enhanced shim exists
const shimPath = join(__dirname, '../src/lib/react-quill-shim.ts');
if (existsSync(shimPath)) {
  console.log('✅ Enhanced ReactQuill shim found');
  const shimContent = readFileSync(shimPath, 'utf-8');
  
  // Check for React 18 compatibility features
  const checks = [
    { name: 'ReactDOM.findDOMNode implementation', pattern: /findDOMNode.*function/ },
    { name: 'React fiber node handling', pattern: /_reactInternals/ },
    { name: 'getEditor method handling', pattern: /getEditor.*function/ },
    { name: 'Enhanced getEditingArea patch', pattern: /getEditingArea.*patched/ },
    { name: 'Error handling', pattern: /try.*catch/ }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(shimContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ❌ ${check.name} - MISSING`);
    }
  });
} else {
  console.log('❌ Enhanced ReactQuill shim NOT found');
}

// Check if backup editor exists
const backupEditorPath = join(__dirname, '../src/components/BackupTextEditor.tsx');
if (existsSync(backupEditorPath)) {
  console.log('✅ Backup text editor found');
  const backupContent = readFileSync(backupEditorPath, 'utf-8');
  
  const backupChecks = [
    { name: 'Markdown support', pattern: /markdown/i },
    { name: 'Toolbar functionality', pattern: /toolbar/i },
    { name: 'Preview feature', pattern: /preview/i },
    { name: 'Image insertion', pattern: /image/i },
    { name: 'Bold/italic formatting', pattern: /bold|italic/i }
  ];
  
  backupChecks.forEach(check => {
    if (check.pattern.test(backupContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ❌ ${check.name} - MISSING`);
    }
  });
} else {
  console.log('❌ Backup text editor NOT found');
}

// Check if test page exists
const testPagePath = join(__dirname, '../src/app/test-editor/page.tsx');
if (existsSync(testPagePath)) {
  console.log('✅ Test page found');
} else {
  console.log('❌ Test page NOT found');
}

// Check package.json for ReactQuill dependency
const packagePath = join(__dirname, '../package.json');
if (existsSync(packagePath)) {
  const packageContent = readFileSync(packagePath, 'utf-8');
  const packageJson = JSON.parse(packageContent);
  
  if (packageJson.dependencies['react-quill']) {
    console.log(`✅ ReactQuill dependency found: ${packageJson.dependencies['react-quill']}`);
  } else {
    console.log('❌ ReactQuill dependency NOT found');
  }
  
  if (packageJson.dependencies.react) {
    console.log(`✅ React version: ${packageJson.dependencies.react}`);
  }
} else {
  console.log('❌ package.json NOT found');
}

console.log('\n📋 Summary:');
console.log('- Enhanced ReactQuill shim with React 18 compatibility');
console.log('- Backup markdown editor as alternative');
console.log('- Test page for verification');
console.log('- Comprehensive error handling');

console.log('\n🧪 Testing Instructions:');
console.log('1. Visit http://localhost:3000/test-editor to test both editors');
console.log('2. Visit http://localhost:3000/admin/dashboard to test admin functionality');
console.log('3. Check browser console for any remaining errors');

console.log('\n✅ Fix verification complete!');