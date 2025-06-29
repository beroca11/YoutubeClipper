#!/usr/bin/env node

/**
 * Custom Build Script for Render Deployment
 * This script handles the build process with better error handling
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔨 YouTube Clipper - Custom Build Script');
console.log('=========================================');

try {
  // Check environment
  console.log('📋 Environment Check:');
  console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`- Platform: ${process.platform}`);
  console.log(`- Node version: ${process.version}`);
  
  // Ensure we're in the right directory
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found. Make sure you\'re in the project root directory.');
  }

  // Install dependencies if needed
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm ci', { stdio: 'inherit' });
  } else {
    console.log('✅ node_modules found');
  }

  // Ensure esbuild is available
  console.log('🔧 Checking build tools...');
  try {
    execSync('npx esbuild --version', { stdio: 'pipe' });
    console.log('✅ esbuild is available');
  } catch (error) {
    console.log('⚠️ esbuild not found, installing...');
    execSync('npm install esbuild', { stdio: 'inherit' });
  }

  // Ensure vite is available
  try {
    execSync('npx vite --version', { stdio: 'pipe' });
    console.log('✅ vite is available');
  } catch (error) {
    console.log('⚠️ vite not found, installing...');
    execSync('npm install vite', { stdio: 'inherit' });
  }

  // Create dist directory if it doesn't exist
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
    console.log('📁 Created dist directory');
  }

  // Build client
  console.log('🎨 Building client...');
  try {
    execSync('npx vite build', { stdio: 'inherit' });
    console.log('✅ Client build successful');
  } catch (error) {
    console.error('❌ Client build failed:', error.message);
    throw error;
  }

  // Build server
  console.log('⚙️ Building server...');
  try {
    execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist', { stdio: 'inherit' });
    console.log('✅ Server build successful');
  } catch (error) {
    console.error('❌ Server build failed:', error.message);
    throw error;
  }

  // Verify build output
  console.log('🔍 Verifying build output...');
  
  const expectedFiles = [
    'dist/index.js',
    'dist/public/index.html',
    'dist/public/assets'
  ];

  for (const file of expectedFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      throw new Error(`Build verification failed: ${file} not found`);
    }
  }

  // Copy necessary files for production
  console.log('📋 Copying production files...');
  
  // Copy watermarks directory if it exists
  if (fs.existsSync('watermarks')) {
    if (!fs.existsSync('dist/watermarks')) {
      fs.mkdirSync('dist/watermarks', { recursive: true });
    }
    // Use Node.js fs operations instead of cp command
    const copyDir = (src, dest) => {
      const items = fs.readdirSync(src);
      items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    };
    copyDir('watermarks', 'dist/watermarks');
    console.log('✅ Watermarks copied');
  }

  // Copy uploads directory if it exists
  if (fs.existsSync('uploads')) {
    if (!fs.existsSync('dist/uploads')) {
      fs.mkdirSync('dist/uploads', { recursive: true });
    }
    // Use Node.js fs operations instead of cp command
    const copyDir = (src, dest) => {
      const items = fs.readdirSync(src);
      items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const stat = fs.statSync(srcPath);
        if (stat.isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath, { recursive: true });
          }
          copyDir(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    };
    copyDir('uploads', 'dist/uploads');
    console.log('✅ Uploads copied');
  }

  console.log('🎉 Build completed successfully!');
  console.log('📁 Build output:');
  
  // List build output
  const listFiles = (dir, prefix = '') => {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        console.log(`${prefix}📁 ${item}/`);
        listFiles(fullPath, prefix + '  ');
      } else {
        console.log(`${prefix}📄 ${item}`);
      }
    });
  };

  listFiles('dist');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
} 