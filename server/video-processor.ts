import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const CLIPS_DIR = path.join(UPLOADS_DIR, 'clips');

async function ensureDirectories() {
  try {
    await mkdir(UPLOADS_DIR, { recursive: true });
    await mkdir(CLIPS_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating directories:', error);
  }
}

interface ClipOptions {
  youtubeId: string;
  startTime: number;
  endTime: number;
  quality: string;
  format: string;
  outputFileName: string;
}

export async function processVideoClip(options: ClipOptions): Promise<{
  filePath: string;
  fileSize: number;
}> {
  await ensureDirectories();
  
  const { youtubeId, startTime, endTime, quality, format, outputFileName } = options;
  const videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
  
  // Download paths
  const tempVideoPath = path.join(UPLOADS_DIR, `temp_${youtubeId}_${Date.now()}.mp4`);
  const outputPath = path.join(CLIPS_DIR, outputFileName);
  
  try {
    // Step 1: Download the video
    console.log('Downloading video from YouTube...');
    await downloadVideo(videoUrl, tempVideoPath, quality);
    
    // Step 2: Clip the video
    console.log('Creating video clip...');
    await createClip(tempVideoPath, outputPath, startTime, endTime, format);
    
    // Step 3: Get file stats
    const stats = fs.statSync(outputPath);
    
    // Clean up temp file
    await unlink(tempVideoPath);
    
    return {
      filePath: outputPath,
      fileSize: stats.size
    };
    
  } catch (error) {
    // Clean up temp file if it exists
    try {
      if (fs.existsSync(tempVideoPath)) {
        await unlink(tempVideoPath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up temp file:', cleanupError);
    }
    
    throw error;
  }
}

function downloadVideo(videoUrl: string, outputPath: string, quality: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Get video quality format
      const qualityFilter = getQualityFilter(quality);
      
      const stream = ytdl(videoUrl, { 
        filter: qualityFilter,
        quality: 'highest'
      });
      
      const writeStream = fs.createWriteStream(outputPath);
      
      stream.pipe(writeStream);
      
      stream.on('error', (error) => {
        console.error('Stream error:', error);
        reject(error);
      });
      
      writeStream.on('error', (error) => {
        console.error('Write stream error:', error);
        reject(error);
      });
      
      writeStream.on('finish', () => {
        console.log('Video download completed');
        resolve();
      });
      
    } catch (error) {
      reject(error);
    }
  });
}

function createClip(inputPath: string, outputPath: string, startTime: number, endTime: number, format: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const duration = endTime - startTime;
    
    let command = ffmpeg(inputPath)
      .seekInput(startTime)
      .duration(duration)
      .output(outputPath);
    
    // Set format-specific options
    if (format === 'gif') {
      command = command
        .fps(15)
        .size('640x360')
        .format('gif');
    } else if (format === 'webm') {
      command = command
        .videoCodec('libvpx')
        .audioCodec('libvorbis')
        .format('webm');
    } else {
      // MP4 default
      command = command
        .videoCodec('libx264')
        .audioCodec('aac')
        .format('mp4');
    }
    
    command
      .on('start', (commandLine) => {
        console.log('FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        console.log('Processing: ' + Math.round(progress.percent) + '% done');
      })
      .on('end', () => {
        console.log('Video clipping completed');
        resolve();
      })
      .on('error', (error) => {
        console.error('FFmpeg error:', error);
        reject(error);
      })
      .run();
  });
}

function getQualityFilter(quality: string): (format: any) => boolean {
  switch (quality) {
    case '480p':
      return (format: any) => format.container === 'mp4' && format.qualityLabel === '480p';
    case '720p':
      return (format: any) => format.container === 'mp4' && format.qualityLabel === '720p';
    case '1080p':
      return (format: any) => format.container === 'mp4' && format.qualityLabel === '1080p';
    default:
      return (format: any) => format.container === 'mp4';
  }
}

export async function getVideoInfo(url: string) {
  try {
    const info = await ytdl.getInfo(url);
    const videoDetails = info.videoDetails;
    
    return {
      youtubeId: videoDetails.videoId,
      title: videoDetails.title,
      description: videoDetails.description || null,
      duration: parseInt(videoDetails.lengthSeconds),
      thumbnailUrl: videoDetails.thumbnails[videoDetails.thumbnails.length - 1]?.url || null,
      channelName: videoDetails.author.name || null,
      viewCount: videoDetails.viewCount || null,
      publishDate: videoDetails.publishDate || null,
    };
  } catch (error) {
    console.error('Error getting video info:', error);
    throw new Error('Unable to fetch video information');
  }
}

export function getClipFilePath(fileName: string): string {
  return path.join(CLIPS_DIR, fileName);
}