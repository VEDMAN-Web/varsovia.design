#!/usr/bin/env node

/**
 * Convert JPEG/JPG images to WebP format with quality preservation
 * Maintains visual quality while reducing file size
 */

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const WEBP_QUALITY = 85; // High quality to preserve visual fidelity
const MIN_SIZE_KB = 5; // Only convert files larger than 5KB

const stats = {
  totalProcessed: 0,
  converted: 0,
  skipped: 0,
  totalOriginalSize: 0,
  totalWebPSize: 0,
  errors: [],
};

async function getAllJpegFiles(dir) {
  const files = [];
  
  async function scan(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg') {
          files.push(fullPath);
        }
      }
    }
  }
  
  await scan(dir);
  return files;
}

async function convertToWebP(inputPath) {
  try {
    const fileStats = await stat(inputPath);
    const fileSizeKB = fileStats.size / 1024;
    
    // Skip small files
    if (fileSizeKB < MIN_SIZE_KB) {
      console.log(`⏭️  Skipping ${basename(inputPath)} (${fileSizeKB.toFixed(1)}KB - too small)`);
      stats.skipped++;
      return null;
    }
    
    const outputPath = inputPath.replace(/\.(jpg|jpeg)$/i, '.webp');
    
    // Convert to WebP
    const info = await sharp(inputPath)
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(outputPath);
    
    const outputStats = await stat(outputPath);
    const originalSizeMB = fileStats.size / (1024 * 1024);
    const webpSizeMB = outputStats.size / (1024 * 1024);
    const reduction = ((fileStats.size - outputStats.size) / fileStats.size * 100).toFixed(1);
    
    stats.totalOriginalSize += fileStats.size;
    stats.totalWebPSize += outputStats.size;
    stats.converted++;
    
    console.log(`✅ ${basename(inputPath)}`);
    console.log(`   Original: ${originalSizeMB.toFixed(2)}MB → WebP: ${webpSizeMB.toFixed(2)}MB (${reduction}% reduction)`);
    
    return {
      original: inputPath,
      webp: outputPath,
      originalSize: fileStats.size,
      webpSize: outputStats.size,
      reduction: parseFloat(reduction),
    };
  } catch (error) {
    console.error(`❌ Error converting ${basename(inputPath)}:`, error.message);
    stats.errors.push({ file: inputPath, error: error.message });
    return null;
  }
}

async function main() {
  console.log('🔄 Starting JPEG to WebP conversion...\n');
  console.log(`📁 Scanning directory: ${PUBLIC_DIR}\n`);
  
  const jpegFiles = await getAllJpegFiles(PUBLIC_DIR);
  stats.totalProcessed = jpegFiles.length;
  
  console.log(`📊 Found ${jpegFiles.length} JPEG files\n`);
  
  if (jpegFiles.length === 0) {
    console.log('✨ No JPEG files found to convert');
    return;
  }
  
  const conversions = [];
  
  for (const file of jpegFiles) {
    const result = await convertToWebP(file);
    if (result) {
      conversions.push(result);
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONVERSION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files processed: ${stats.totalProcessed}`);
  console.log(`Successfully converted: ${stats.converted}`);
  console.log(`Skipped: ${stats.skipped}`);
  console.log(`Errors: ${stats.errors.length}`);
  console.log(`\nOriginal total size: ${(stats.totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`WebP total size: ${(stats.totalWebPSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total reduction: ${(((stats.totalOriginalSize - stats.totalWebPSize) / stats.totalOriginalSize) * 100).toFixed(1)}%`);
  console.log(`Space saved: ${((stats.totalOriginalSize - stats.totalWebPSize) / (1024 * 1024)).toFixed(2)} MB`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:');
    stats.errors.forEach(({ file, error }) => {
      console.log(`   ${basename(file)}: ${error}`);
    });
  }
  
  console.log('\n✨ Conversion complete!');
  console.log('\n⚠️  NEXT STEPS:');
  console.log('1. Update image references in components to use .webp');
  console.log('2. Verify images display correctly');
  console.log('3. Remove old .jpg/.jpeg files after verification');
}

main().catch(console.error);
