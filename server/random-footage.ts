import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';

async function ensureRandomFootageDir() {
  const dir = path.join(process.cwd(), 'uploads', 'random-footage');
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
  return dir;
}

// Generate random footage using a simple approach without lavfi
async function generateRandomFootage(outputPath: string, duration: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create a simple video using a solid color approach that works with most FFmpeg builds
    ffmpeg()
      .input('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
      .inputFormat('image2')
      .loop()
      .videoCodec('libx264')
      .audioCodec('aac')
      .outputOptions([
        '-t', duration.toString(),
        '-r', '30',
        '-pix_fmt', 'yuv420p',
        '-vf', 'scale=640:180'
      ])
      .output(outputPath)
      .on('error', (err) => {
        console.error('Random footage generation error:', err);
        // If this fails, try creating a minimal video without audio
        createMinimalVideo(outputPath, duration)
          .then(resolve)
          .catch(reject);
      })
      .on('end', () => {
        console.log('Random footage generated successfully');
        resolve();
      })
      .run();
  });
}

// Create a minimal video as fallback
async function createMinimalVideo(outputPath: string, duration: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create a simple 1x1 pixel image and scale it up
    const pixelData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
    const tempImagePath = path.join(path.dirname(outputPath), `temp_pixel_${Date.now()}.png`);
    
    fs.writeFile(tempImagePath, pixelData)
      .then(() => {
        ffmpeg()
          .input(tempImagePath)
          .loop()
          .videoCodec('libx264')
          .outputOptions([
            '-t', duration.toString(),
            '-r', '30',
            '-pix_fmt', 'yuv420p',
            '-vf', 'scale=640:180'
          ])
          .output(outputPath)
          .on('error', (err) => {
            console.error('Minimal video creation error:', err);
            // Clean up temp file
            fs.unlink(tempImagePath).catch(() => {});
            reject(err);
          })
          .on('end', () => {
            console.log('Minimal video created successfully');
            // Clean up temp file
            fs.unlink(tempImagePath).catch(() => {});
            resolve();
          })
          .run();
      })
      .catch(reject);
  });
}

// Combine main clip with random footage
export async function addRandomFootageToClip(mainClipPath: string, outputPath: string, duration: number): Promise<void> {
  const randomFootageDir = await ensureRandomFootageDir();
  const randomFootagePath = path.join(randomFootageDir, `random_${Date.now()}.mp4`);
  
  try {
    // Generate random footage
    await generateRandomFootage(randomFootagePath, duration);
    
    // Combine main clip (top) with random footage (bottom)
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(mainClipPath)
        .input(randomFootagePath)
        .complexFilter([
          // Resize main video to take up top 75% of screen
          '[0:v]scale=640:360[main]',
          // Keep random footage at bottom 25%
          '[1:v]scale=640:120[random]',
          // Stack them vertically
          '[main][random]vstack=inputs=2[stacked]',
          // Mix audio from both sources
          '[0:a][1:a]amix=inputs=2:duration=shortest[audio]'
        ])
        .outputOptions([
          '-map', '[stacked]',
          '-map', '[audio]',
          '-c:v', 'libx264',
          '-c:a', 'aac',
          '-preset', 'fast'
        ])
        .output(outputPath)
        .on('error', (err) => {
          console.error('Clip combination error:', err);
          reject(err);
        })
        .on('end', () => {
          console.log('Random footage added to clip successfully');
          resolve();
        })
        .run();
    });
  } finally {
    // Clean up temporary random footage file
    try {
      await fs.unlink(randomFootagePath);
    } catch (err) {
      console.warn('Could not clean up random footage file:', err);
    }
  }
}