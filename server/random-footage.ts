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

// Generate random footage using FFmpeg
async function generateRandomFootage(outputPath: string, duration: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create abstract patterns and shapes
    const patterns = [
      'testsrc2=duration={}:size=640x180:rate=30',
      'mandelbrot=size=640x180:rate=30',
      'life=s=640x180:mold=10:r=30:ratio=0.1:death_color=#C83232:life_color=#00ff00',
      'noise=alls=20:allf=t+u'
    ];
    
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const filterPattern = selectedPattern.replace('{}', duration.toString());
    
    ffmpeg()
      .input(filterPattern)
      .inputFormat('lavfi')
      .videoCodec('libx264')
      .audioCodec('aac')
      .complexFilter([
        // Add some visual effects
        '[0:v]hue=h=sin(2*PI*t)*360:s=1+0.5*sin(2*PI*t)[colored]',
        '[colored]fade=in:0:30[faded]',
        // Generate simple audio tone
        'sine=frequency=220:duration=' + duration + '[audio]'
      ])
      .outputOptions([
        '-map', '[faded]',
        '-map', '[audio]',
        '-t', duration.toString(),
        '-pix_fmt', 'yuv420p'
      ])
      .output(outputPath)
      .on('error', (err) => {
        console.error('Random footage generation error:', err);
        reject(err);
      })
      .on('end', () => {
        console.log('Random footage generated successfully');
        resolve();
      })
      .run();
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