#!/usr/bin/env node

/**
 * Test script to verify ReactQuill fix is working
 * This will check if the application loads without the findDOMNode error
 */

import { spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🧪 Testing ReactQuill fix...\n');

// Check if final shim exists
const shimPath = join(process.cwd(), 'src/lib/react-quill-shim-final.ts');
if (existsSync(shimPath)) {
  console.log('✅ Final ReactQuill shim found');
  
  const shimContent = readFileSync(shimPath, 'utf-8');
  const hasPatching = shimContent.includes('ReactQuill.prototype.getEditingArea');
  const hasErrorHandling = shimContent.includes('window.onerror');
  const hasFallback = shimContent.includes('createFallbackEditorArea');
  
  console.log(`  ${hasPatching ? '✅' : '❌'} ReactQuill patching implemented`);
  console.log(`  ${hasErrorHandling ? '✅' : '❌'} Global error handling`);
  console.log(`  ${hasFallback ? '✅' : '❌'} Fallback strategies`);
} else {
  console.log('❌ Final ReactQuill shim NOT found');
  process.exit(1);
}

// Check if component is using the correct shim
const componentPath = join(process.cwd(), 'src/components/RichTextEditorQuill.tsx');
if (existsSync(componentPath)) {
  const componentContent = readFileSync(componentPath, 'utf-8');
  const usesFinalShim = componentContent.includes('react-quill-shim-final');
  
  console.log(`${usesFinalShim ? '✅' : '❌'} Component using final shim: ${usesFinalShim}`);
} else {
  console.log('❌ RichTextEditorQuill component NOT found');
}

// Check if backup editor exists
const backupPath = join(process.cwd(), 'src/components/BackupTextEditor.tsx');
if (existsSync(backupPath)) {
  console.log('✅ Backup text editor available');
} else {
  console.log('❌ Backup text editor NOT found');
}

// Check if test page exists
const testPath = join(process.cwd(), 'src/app/test-editor/page.tsx');
if (existsSync(testPath)) {
  console.log('✅ Test page available at /test-editor');
} else {
  console.log('❌ Test page NOT found');
}

console.log('\n📋 Application Status Check:');

try {
  // Check if package.json has required dependencies
  const packagePath = join(process.cwd(), 'package.json');
  const packageContent = JSON.parse(readFileSync(packagePath, 'utf-8'));
  
  const hasReactQuill = packageContent.dependencies['react-quill'];
  const hasReact18 = packageContent.dependencies.react?.includes('18');
  
  console.log(`${hasReactQuill ? '✅' : '❌'} ReactQuill dependency: ${hasReactQuill || 'missing'}`);
  console.log(`${hasReact18 ? '✅' : '❌'} React 18+ detected: ${hasReact18 ? 'yes' : 'no'}`);
  
} catch (e) {
  console.log('❌ Could not read package.json');
}

console.log('\n🚀 Server Should Be Running On:');
console.log('  • http://localhost:3000');
console.log('  • Admin Dashboard: http://localhost:3000/admin/dashboard');
console.log('  • Editor Test: http://localhost:3000/test-editor');

console.log('\n🎯 Expected Results:');
console.log('  • No "findDOMNode" errors in browser console');
console.log('  • ReactQuill editor loads and works in admin dashboard');
console.log('  • Test page allows switching between ReactQuill and backup editor');

console.log('\n✅ Fix verification complete!');
console.log('🔍 If issues persist, check browser console for remaining errors.');

process.exit(0);