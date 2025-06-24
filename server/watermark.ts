import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

// Watermark configuration
const WATERMARK_DIR = path.join(process.cwd(), 'watermarks');
const WATERMARK_SIZE = '120x120'; // Size of watermark in pixels
const WATERMARK_POSITION = 'W-w-20:H-h-20'; // Bottom right with 20px padding

// Supported image formats
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];

/**
 * Ensures the watermark directory exists
 */
async function ensureWatermarkDir() {
  try {
    await fs.access(WATERMARK_DIR);
  } catch {
    await fs.mkdir(WATERMARK_DIR, { recursive: true });
    console.log('Created watermark directory:', WATERMARK_DIR);
  }
}

/**
 * Gets a random watermark from the watermark directory
 */
async function getRandomWatermark(): Promise<string | null> {
  try {
    await ensureWatermarkDir();
    
    const files = await fs.readdir(WATERMARK_DIR);
    const imageFiles = files.filter((file: string) => 
      SUPPORTED_FORMATS.some(format => 
        file.toLowerCase().endsWith(format)
      )
    );
    
    if (imageFiles.length === 0) {
      console.log('No watermark images found in directory:', WATERMARK_DIR);
      return null;
    }
    
    const randomFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    const watermarkPath = path.join(WATERMARK_DIR, randomFile);
    
    console.log('Selected watermark:', randomFile);
    return watermarkPath;
  } catch (error) {
    console.error('Error getting random watermark:', error);
    return null;
  }
}

/**
 * Adds a watermark to a video clip
 */
export async function addWatermarkToClip(
  inputPath: string, 
  outputPath: string, 
  watermarkPath?: string
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      // Get watermark path if not provided
      let finalWatermarkPath = watermarkPath;
      
      if (!finalWatermarkPath) {
        const randomWatermark = await getRandomWatermark();
        if (randomWatermark) {
          finalWatermarkPath = randomWatermark;
        }
      } else {
        // If only filename is provided, construct full path
        if (!path.isAbsolute(finalWatermarkPath)) {
          finalWatermarkPath = path.join(WATERMARK_DIR, finalWatermarkPath);
        }
      }
      
      if (!finalWatermarkPath) {
        console.log('No watermark available, creating clip without watermark');
        // If no watermark, just copy the file
        await fs.copyFile(inputPath, outputPath);
        resolve();
        return;
      }
      
      // Check if watermark file exists
      if (!fsSync.existsSync(finalWatermarkPath)) {
        console.error('Watermark file not found:', finalWatermarkPath);
        console.log('Available watermarks directory:', WATERMARK_DIR);
        try {
          const files = await fs.readdir(WATERMARK_DIR);
          console.log('Files in watermark directory:', files);
        } catch (dirError) {
          console.error('Could not read watermark directory:', dirError);
        }
        await fs.copyFile(inputPath, outputPath);
        resolve();
        return;
      }
      
      console.log('Adding watermark to clip:', path.basename(finalWatermarkPath));
      console.log('Full watermark path:', finalWatermarkPath);
      
      ffmpeg()
        .input(inputPath)
        .input(finalWatermarkPath)
        .complexFilter([
          // Scale watermark to desired size and make it more visible
          '[1:v]scale=' + WATERMARK_SIZE + '[watermark]',
          // Overlay watermark on video at bottom center with better visibility
          '[0:v][watermark]overlay=W-w-20:H-h-20[output]'
        ])
        .outputOptions([
          '-map', '[output]',
          '-map', '0:a', // Keep original audio
          '-c:v', 'libx264',
          '-c:a', 'aac',
          '-preset', 'fast',
          '-pix_fmt', 'yuv420p'
        ])
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('Watermark FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          const percent = progress.percent || 0;
          console.log('Watermark processing: ' + Math.round(percent) + '% done');
        })
        .on('end', () => {
          console.log('Watermark added successfully');
          resolve();
        })
        .on('error', (error) => {
          console.error('Watermark error:', error);
          // Fallback: copy original file without watermark
          fs.copyFile(inputPath, outputPath)
            .then(() => {
              console.log('Fallback: copied original file without watermark');
              resolve();
            })
            .catch(reject);
        })
        .run();
        
    } catch (error) {
      console.error('Error in addWatermarkToClip:', error);
      // Fallback: copy original file
      try {
        await fs.copyFile(inputPath, outputPath);
        resolve();
      } catch (copyError) {
        reject(copyError);
      }
    }
  });
}

/**
 * Lists available watermarks
 */
export async function getAvailableWatermarks(): Promise<string[]> {
  try {
    await ensureWatermarkDir();
    const files = await fs.readdir(WATERMARK_DIR);
    return files.filter((file: string) => 
      SUPPORTED_FORMATS.some(format => 
        file.toLowerCase().endsWith(format)
      )
    );
  } catch (error) {
    console.error('Error listing watermarks:', error);
    return [];
  }
}

/**
 * Creates a sample watermark if none exist
 */
export async function createSampleWatermark(): Promise<void> {
  try {
    await ensureWatermarkDir();
    const files = await getAvailableWatermarks();
    
    if (files.length === 0) {
      console.log('Creating sample watermark...');
      // Create a simple text-based watermark using FFmpeg
      const samplePath = path.join(WATERMARK_DIR, 'sample_watermark.png');
      
      return new Promise((resolve, reject) => {
        ffmpeg()
          .input('color=c=white:s=120x120:d=1')
          .input('anullsrc=channel_layout=stereo:sample_rate=44100')
          .complexFilter([
            'drawtext=text=\'AI CLIPPER\':fontcolor=black:fontsize=20:x=(w-text_w)/2:y=(h-text_h)/2'
          ])
          .outputOptions([
            '-frames:v', '1',
            '-pix_fmt', 'yuv420p'
          ])
          .output(samplePath)
          .on('end', () => {
            console.log('Sample watermark created:', samplePath);
            resolve();
          })
          .on('error', (error) => {
            console.error('Error creating sample watermark:', error);
            resolve(); // Don't fail if sample creation fails
          })
          .run();
      });
    }
  } catch (error) {
    console.error('Error creating sample watermark:', error);
  }
} 