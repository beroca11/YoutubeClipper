import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, insertClipSchema } from "@shared/schema";
import { z } from "zod";
import { processVideoClip, getVideoInfo, getClipFilePath } from "./video-processor";
import { AIAgent, type ViralAnalysis, type ContentExplanation, type SocialMediaOptimization } from "./ai-agent";
import fs from 'fs';
import express from 'express';
import { videos, clips } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { VideoProcessor } from './video-processor';
import path from 'path';
import ytdl from '@distube/ytdl-core';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';

const router = express.Router();
const videoProcessor = new VideoProcessor();
const aiAgent = AIAgent.getInstance();

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function generateAiSuggestions(duration: number) {
  const suggestions = [];
  const categories = ['highlight', 'action', 'scenic'] as const;
  const titles = {
    highlight: ['Key Moment', 'Main Point', 'Highlight Reel', 'Best Part'],
    action: ['Action Sequence', 'Dynamic Scene', 'Movement', 'Activity'],
    scenic: ['Beautiful View', 'Landscape', 'Visual Appeal', 'Scenery']
  } as const;
  
  for (let i = 0; i < 3; i++) {
    const category = categories[i];
    const startTime = Math.random() * (duration * 0.7);
    const clipDuration = 30 + Math.random() * 90; // 30-120 seconds
    const endTime = Math.min(startTime + clipDuration, duration);
    
    suggestions.push({
      title: titles[category][Math.floor(Math.random() * titles[category].length)],
      description: `AI-generated ${category} clip`,
      startTime,
      endTime,
      duration: endTime - startTime,
      category,
      confidence: 0.7 + Math.random() * 0.3,
    });
  }
  
  return suggestions;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Analyze YouTube video
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: "URL is required" });
      }
      
      const youtubeId = extractYouTubeId(url);
      if (!youtubeId) {
        return res.status(400).json({ message: "Invalid YouTube URL" });
      }
      
      // Check if video already exists
      let video = await storage.getVideoByYoutubeId(youtubeId);
      
      if (!video) {
        // Fetch real video metadata from YouTube
        try {
          const videoInfo = await getVideoInfo(url);
          
          const videoData = insertVideoSchema.parse(videoInfo);
          video = await storage.createVideo(videoData);
          
          // Generate AI suggestions
          const aiSuggestions = generateAiSuggestions(video.duration);
          const suggestionsToCreate = aiSuggestions.map(suggestion => ({
            videoId: video!.id,
            ...suggestion,
          }));
          
          await storage.createAiSuggestions(suggestionsToCreate);
          
        } catch (error) {
          console.error("Error fetching video info:", error);
          return res.status(400).json({ message: "Unable to fetch video information. Please ensure the URL is valid and the video is publicly accessible." });
        }
      }
      
      // Get AI suggestions
      const suggestions = await storage.getAiSuggestionsByVideoId(video.id);
      
      res.json({
        video: {
          ...video,
          formattedDuration: formatDuration(video.duration),
        },
        suggestions,
      });
      
    } catch (error) {
      console.error("Error analyzing video:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // AI Viral Analysis
  app.post("/api/ai/analyze-virality", async (req, res) => {
    try {
      const { videoId } = req.body;
      
      const video = await storage.getVideo(videoId);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      const analysis = await aiAgent.analyzeVideoForVirality(video);
      res.json(analysis);
      
    } catch (error) {
      console.error("Error analyzing virality:", error);
      res.status(500).json({ error: "Failed to analyze virality" });
    }
  });

  // AI Content Explanation
  app.post("/api/ai/generate-explanation", async (req, res) => {
    try {
      const { videoId } = req.body;
      
      const video = await storage.getVideo(videoId);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      const explanation = await aiAgent.generateContentExplanation(video);
      res.json(explanation);
      
    } catch (error) {
      console.error("Error generating explanation:", error);
      res.status(500).json({ error: "Failed to generate explanation" });
    }
  });

  // AI Social Media Optimization
  app.post("/api/ai/optimize-social-media", async (req, res) => {
    try {
      const { videoId, platform } = req.body;
      
      const video = await storage.getVideo(videoId);
      if (!video) {
        return res.status(404).json({ error: "Video not found" });
      }
      
      const optimization = await aiAgent.optimizeForSocialMedia(video, platform);
      res.json(optimization);
      
    } catch (error) {
      console.error("Error optimizing for social media:", error);
      res.status(500).json({ error: "Failed to optimize for social media" });
    }
  });
  
  // Enhanced clip creation with TikTok optimization
  app.post("/api/clips", async (req, res) => {
    try {
      // Calculate duration from start and end times
      const duration = req.body.endTime - req.body.startTime;
      const clipDataWithDuration = { ...req.body, duration };
      
      const clipData = insertClipSchema.parse(clipDataWithDuration);
      console.log('Creating clip with video edits:', {
        zoomLevel: clipData.zoomLevel,
        cropX: clipData.cropX,
        cropY: clipData.cropY,
        brightness: clipData.brightness,
        contrast: clipData.contrast,
        saturation: clipData.saturation,
        hasRandomFootage: clipData.hasRandomFootage,
        addWatermark: req.body.addWatermark,
        aspectRatio: clipData.aspectRatio,
        resolution: req.body.resolution,
        orientation: req.body.orientation
      });

      // Validate the video exists
      const video = await storage.getVideo(clipData.videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Validate clip timing
      if (clipData.startTime >= clipData.endTime) {
        return res.status(400).json({ message: "Start time must be before end time" });
      }
      
      if (clipData.endTime > video.duration) {
        return res.status(400).json({ message: "End time exceeds video duration" });
      }
      
      // Generate filename
      const fileName = `${video.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)}_${Date.now()}.${clipData.format || 'mp4'}`;
      
      // Safety check: Disable random footage if it's causing issues
      // This prevents the ENOENT errors we've been seeing
      const safeRandomFootage = false; // Temporarily disabled for stability
      
      if (clipData.hasRandomFootage && !safeRandomFootage) {
        console.log('Random footage requested but disabled for stability');
      }
      
      const clip = await storage.createClip({
        ...clipData,
        fileName,
        processingStatus: "pending",
      });

      // Start enhanced video processing with TikTok optimization
      processVideoAsync(
        clip.id, 
        video.youtubeId, 
        clipData.startTime, 
        clipData.endTime, 
        clipData.quality || "1080p", 
        clipData.format || "mp4", 
        fileName,
        {
          zoomLevel: clipData.zoomLevel,
          cropX: clipData.cropX,
          cropY: clipData.cropY,
          brightness: clipData.brightness,
          contrast: clipData.contrast,
          saturation: clipData.saturation,
          hasRandomFootage: safeRandomFootage, // Use safe version instead of clipData.hasRandomFootage
          aspectRatio: clipData.aspectRatio,
          resolution: req.body.resolution,
          orientation: req.body.orientation,
          customSubtitles: req.body.customSubtitles,
          visualEffects: req.body.visualEffects,
          transitions: req.body.transitions,
          addWatermark: req.body.addWatermark,
          watermarkPath: req.body.watermarkPath
        }
      );

      res.json(clip);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ message: "Invalid clip data", errors: error.errors });
      }
      console.error("Error creating clip:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get clip status
  app.get("/api/clips/:id", async (req, res) => {
    try {
      const clipId = parseInt(req.params.id);
      const clip = await storage.getClip(clipId);
      
      if (!clip) {
        return res.status(404).json({ message: "Clip not found" });
      }
      
      res.json(clip);
      
    } catch (error) {
      console.error("Error fetching clip:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Download clip
  app.get("/api/clips/:id/download", async (req, res) => {
    try {
      const clipId = parseInt(req.params.id);
      const clip = await storage.getClip(clipId);

      console.log(`[Download] Request for clipId: ${clipId}, voiceover: ${req.query.voiceover}`);

      if (!clip || clip.processingStatus !== "completed") {
        console.log(`[Download] Clip not ready for download: ${clipId}`);
        return res.status(404).json({ message: "Clip not ready for download" });
      }

      // Check for voiceover query param
      let filePath = getClipFilePath(clip.fileName!);
      if (req.query.voiceover === '1') {
        // Try to serve the voiceover version if it exists
        const voiceoverPath = filePath.replace(/\.[^.]+$/, '_with_voiceover.mp4');
        console.log(`[Download] Checking for voiceover file: ${voiceoverPath}`);
        if (fs.existsSync(voiceoverPath)) {
          filePath = voiceoverPath;
          console.log(`[Download] Voiceover file found, serving: ${filePath}`);
        } else {
          console.log(`[Download] Voiceover file not found, falling back to original.`);
        }
      } else {
        console.log(`[Download] Serving original file: ${filePath}`);
      }

      if (!fs.existsSync(filePath)) {
        console.log(`[Download] File not found: ${filePath}`);
        return res.status(404).json({ message: "Video file not found" });
      }

      const stats = fs.statSync(filePath);
      const mimeType = 'video/mp4';

      // Set CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Content-Disposition");
      
      // Set content headers
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Length", stats.size);
      res.setHeader("Content-Disposition", `attachment; filename="${clip.fileName}"`);
      res.setHeader("Cache-Control", "no-cache");

      console.log(`[Download] Serving file: ${filePath}, size: ${stats.size} bytes`);

      const fileStream = fs.createReadStream(filePath);
      
      fileStream.on('error', (error) => {
        console.error(`[Download] File stream error:`, error);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error reading file" });
        }
      });
      
      fileStream.pipe(res);

    } catch (error) {
      console.error(`[Download] Error downloading clip:`, error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Handle CORS preflight for download endpoint
  app.options("/api/clips/:id/download", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Content-Disposition");
    res.status(200).end();
  });

  // AI thumbnail generation endpoint
  app.post("/api/ai/generate-thumbnail", async (req, res) => {
    try {
      const { videoId, template, design } = req.body;
      // Get video data
      const video = await storage.getVideo(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      // Use thumbnailSuggestion or video title as prompt
      const prompt = design?.title || video.title || "Viral video thumbnail";
      // Use OpenAI DALL·E to generate a thumbnail
      if (process.env.OPENAI_API_KEY) {
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const dalleResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: `Create a vibrant, eye-catching YouTube/TikTok/Instagram video thumbnail for: ${prompt}. Use bold colors, clear subject, and professional design. No text overlays.`,
          n: 1,
          size: "1024x1024"
        });
        const imageUrls = Array.isArray(dalleResponse.data) ? dalleResponse.data.map(img => img.url).filter(Boolean) : [];
        return res.json({ thumbnails: imageUrls });
      }
      // Fallback: return placeholder
      const mockThumbnails = [
        `https://via.placeholder.com/1280x720/ff6b6b/ffffff?text=${encodeURIComponent(prompt)}`
      ];
      res.json({ thumbnails: mockThumbnails });
    } catch (error) {
      console.error("Error generating thumbnails:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Watermark management endpoints
  app.get("/api/watermarks", async (req, res) => {
    try {
      const { getAvailableWatermarks } = await import('./watermark');
      const watermarks = await getAvailableWatermarks();
      res.json({ watermarks });
    } catch (error) {
      console.error("Error listing watermarks:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/watermarks/sample", async (req, res) => {
    try {
      const { createSampleWatermark } = await import('./watermark');
      await createSampleWatermark();
      res.json({ message: "Sample watermark created successfully" });
    } catch (error) {
      console.error("Error creating sample watermark:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/watermarks/upload", async (req, res) => {
    try {
      // This would need multer or similar middleware for file uploads
      // For now, we'll create a simple endpoint that returns success
      // In a real implementation, you'd handle the file upload here
      res.json({ message: "Watermark upload endpoint - implement with multer" });
    } catch (error) {
      console.error("Error uploading watermark:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/watermarks/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const watermarkPath = path.join(process.cwd(), 'watermarks', filename);
      
      if (!fs.existsSync(watermarkPath)) {
        return res.status(404).json({ message: "Watermark not found" });
      }
      
      const stats = fs.statSync(watermarkPath);
      const ext = path.extname(filename).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : 
                      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                      ext === '.gif' ? 'image/gif' :
                      ext === '.webp' ? 'image/webp' : 'image/png';
      
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Length", stats.size);
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
      
      const fileStream = fs.createReadStream(watermarkPath);
      fileStream.pipe(res);
      
    } catch (error) {
      console.error("Error serving watermark:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Add AI Voice Over to a clip
  app.post('/api/clips/voiceover', async (req, res) => {
    try {
      const { clipId } = req.body;
      console.log('[VoiceOver] Request received:', { clipId });
      if (!clipId) {
        console.error('[VoiceOver] Missing clipId');
        return res.status(400).json({ message: 'clipId is required' });
      }
      const clip = await storage.getClip(clipId);
      if (!clip || !clip.fileName) {
        console.error('[VoiceOver] Clip not found:', clipId);
        return res.status(404).json({ message: 'Clip not found' });
      }
      // Fetch the associated video
      const video = await storage.getVideo(clip.videoId);
      if (!video) {
        console.error('[VoiceOver] Video not found for clip:', clipId);
        return res.status(404).json({ message: 'Video not found for clip' });
      }
      const clipPath = getClipFilePath(clip.fileName);
      const audioPath = clipPath.replace(/\.[^.]+$/, '_voiceover.mp3');
      const outputPath = clipPath.replace(/\.[^.]+$/, '_with_voiceover.mp4');

      // 1. Generate narration text using AI
      console.log('[VoiceOver] Generating narration text...');
      const narrationScript = await aiAgent.generateNarrationForClip(clip, video);
      console.log('[VoiceOver] Narration script:', narrationScript);

      // 2. Generate TTS audio using OpenAI
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        console.error('[VoiceOver] OpenAI API key not configured');
        return res.status(500).json({ message: 'OpenAI API key not configured' });
      }
      console.log('[VoiceOver] Calling OpenAI TTS API...');
      const ttsResponse = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1',
          input: narrationScript,
          voice: 'alloy',
        },
        {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        }
      );
      fs.writeFileSync(audioPath, ttsResponse.data);
      const audioStats = fs.statSync(audioPath);
      console.log(`[VoiceOver] Audio file written: ${audioPath}, size: ${audioStats.size} bytes`);

      // 3. Merge audio with video using FFmpeg
      console.log('[VoiceOver] Starting FFmpeg merge...');
      await new Promise<void>((resolve, reject) => {
        ffmpeg()
          .input(clipPath)
          .input(audioPath)
          .outputOptions([
            '-map', '0:v:0',
            '-map', '1:a:0',
            '-c:v', 'copy',
            '-shortest'
          ])
          .save(outputPath)
          .on('start', (cmd: any) => console.log('[VoiceOver] FFmpeg command:', cmd))
          .on('end', () => { console.log('[VoiceOver] FFmpeg merge complete:', outputPath); resolve(); })
          .on('error', (err: any) => { console.error('[VoiceOver] FFmpeg error:', err); reject(err); });
      });

      // Update the clip's downloadUrl and status
      const downloadUrl = `/api/clips/${clipId}/download?voiceover=1`;
      await storage.updateClipStatus(clipId, 'completed', downloadUrl);
      const updatedClip = await storage.getClip(clipId);

      res.json({ success: true, outputPath, downloadUrl, clip: updatedClip });
    } catch (error: any) {
      console.error('[VoiceOver] Error:', error);
      res.status(500).json({ message: 'Failed to add voice over', error: error.message });
    }
  });

  const httpServer = createServer(app);
  // Helper function for async video processing
  async function processVideoAsync(
    clipId: number,
    youtubeId: string, 
    startTime: number, 
    endTime: number, 
    quality: string, 
    format: string, 
    fileName: string,
    editOptions?: {
      zoomLevel?: number;
      cropX?: number;
      cropY?: number;
      brightness?: number;
      contrast?: number;
      saturation?: number;
      hasRandomFootage?: boolean;
      aspectRatio?: string;
      resolution?: string;
      orientation?: string;
      customSubtitles?: string[];
      visualEffects?: any;
      transitions?: any;
      addWatermark?: boolean;
      watermarkPath?: string;
    }
  ) {
    try {
      // Update status to processing
      await storage.updateClipStatus(clipId, "processing");
      
      console.log('Using standard video processing');
      
      // Use the original processVideoClip for all processing
      const result = await processVideoClip({
        youtubeId,
        startTime,
        endTime,
        quality,
        format,
        outputFileName: fileName,
        zoomLevel: editOptions?.zoomLevel,
        cropX: editOptions?.cropX,
        cropY: editOptions?.cropY,
        brightness: editOptions?.brightness,
        contrast: editOptions?.contrast,
        saturation: editOptions?.saturation,
        hasRandomFootage: editOptions?.hasRandomFootage,
        aspectRatio: editOptions?.aspectRatio,
        resolution: editOptions?.resolution,
        orientation: editOptions?.orientation,
        addWatermark: editOptions?.addWatermark,
        watermarkPath: editOptions?.watermarkPath
      });
      
      // Update status to completed
      const downloadUrl = `/api/clips/${clipId}/download`;
      await storage.updateClipStatus(clipId, "completed", downloadUrl, result.fileSize);
      
    } catch (error) {
      console.error("Error processing video clip:", error);
      await storage.updateClipStatus(clipId, "failed");
    }
  }

  return httpServer;
}
