#!/usr/bin/env node

/**
 * Simple Build Script for Render
 * This script provides detailed error information for debugging
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔨 YouTube Clipper - Simple Build Script');
console.log('=========================================');

try {
  // Check current directory
  console.log('📁 Current directory:', process.cwd());
  console.log('📁 Files in current directory:', fs.readdirSync('.'));

  // Check if client directory exists
  if (!fs.existsSync('client')) {
    throw new Error('client directory not found');
  }
  console.log('✅ client directory found');

  // Check if client/src exists
  if (!fs.existsSync('client/src')) {
    throw new Error('client/src directory not found');
  }
  console.log('✅ client/src directory found');

  // Check if client/index.html exists
  if (!fs.existsSync('client/index.html')) {
    throw new Error('client/index.html not found');
  }
  console.log('✅ client/index.html found');

  // Check if vite.config.ts exists
  if (!fs.existsSync('vite.config.ts')) {
    throw new Error('vite.config.ts not found');
  }
  console.log('✅ vite.config.ts found');

  // Check Node.js version
  console.log('📋 Node.js version:', process.version);

  // Check if vite is available
  try {
    const viteVersion = execSync('npx vite --version', { encoding: 'utf8' });
    console.log('✅ vite version:', viteVersion.trim());
  } catch (error) {
    console.log('❌ vite not available:', error.message);
    throw error;
  }

  // Build client
  console.log('🎨 Building client...');
  execSync('npx vite build --mode production', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  console.log('✅ Client build successful');

  // Check if dist/public was created
  if (!fs.existsSync('dist/public')) {
    throw new Error('dist/public directory not created');
  }
  console.log('✅ dist/public directory created');

  // Build server
  console.log('⚙️ Building server...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { 
    stdio: 'inherit' 
  });
  console.log('✅ Server build successful');

  // Check if dist/index.js was created
  if (!fs.existsSync('dist/index.js')) {
    throw new Error('dist/index.js not created');
  }
  console.log('✅ dist/index.js created');

  console.log('🎉 Build completed successfully!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
} 