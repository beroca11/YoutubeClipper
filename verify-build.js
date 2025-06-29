#!/usr/bin/env node

/**
 * Build Verification Script
 * This script helps verify that the build process works correctly
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 YouTube Clipper - Build Verification');
console.log('=======================================');

try {
  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found. Make sure you\'re in the project root directory.');
  }

  console.log('✅ Found package.json');

  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm ci', { stdio: 'inherit' });
  } else {
    console.log('✅ node_modules found');
  }

  // Check if esbuild is available
  try {
    execSync('npx esbuild --version', { stdio: 'pipe' });
    console.log('✅ esbuild is available');
  } catch (error) {
    console.log('❌ esbuild not found, installing...');
    execSync('npm install esbuild', { stdio: 'inherit' });
  }

  // Check if vite is available
  try {
    execSync('npx vite --version', { stdio: 'pipe' });
    console.log('✅ vite is available');
  } catch (error) {
    console.log('❌ vite not found, installing...');
    execSync('npm install vite', { stdio: 'inherit' });
  }

  // Run the build
  console.log('🔨 Running build...');
  execSync('npm run build', { stdio: 'inherit' });

  // Verify build output
  console.log('🔍 Verifying build output...');
  
  if (fs.existsSync('dist/index.js')) {
    console.log('✅ Server build successful (dist/index.js)');
  } else {
    throw new Error('Server build failed - dist/index.js not found');
  }

  if (fs.existsSync('dist/public')) {
    console.log('✅ Client build successful (dist/public)');
  } else {
    throw new Error('Client build failed - dist/public not found');
  }

  console.log('🎉 Build verification completed successfully!');
  console.log('🚀 Ready for deployment');

} catch (error) {
  console.error('❌ Build verification failed:', error.message);
  process.exit(1);
} 