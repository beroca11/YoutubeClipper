import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, insertClipSchema } from "@shared/schema";
import { z } from "zod";
import { processVideoClip, getVideoInfo, getClipFilePath } from "./video-processor";
import fs from 'fs';

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
  
  // Create clip
  app.post("/api/clips", async (req, res) => {
    try {
      console.log("Creating clip for video ID:", clipData.videoId);
      
      // Calculate duration from start and end times
      const duration = req.body.endTime - req.body.startTime;
      const clipDataWithDuration = { ...req.body, duration };
      
      const clipData = insertClipSchema.parse(clipDataWithDuration);
      
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
      
      const clip = await storage.createClip({
        ...clipData,
        fileName,
        processingStatus: "pending",
      });
      
      // Start real video processing
      processVideoAsync(clip.id, video.youtubeId, clipData.startTime, clipData.endTime, clipData.quality || "720p", clipData.format || "mp4", fileName);
      
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
      
      if (!clip || clip.processingStatus !== "completed") {
        return res.status(404).json({ message: "Clip not ready for download" });
      }
      
      // Serve the actual video file
      const filePath = getClipFilePath(clip.fileName!);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Video file not found" });
      }
      
      const stats = fs.statSync(filePath);
      const mimeType = clip.format === 'gif' ? 'image/gif' : 
                      clip.format === 'webm' ? 'video/webm' : 'video/mp4';
      
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Length", stats.size);
      res.setHeader("Content-Disposition", `attachment; filename="${clip.fileName}"`);
      
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
    } catch (error) {
      console.error("Error downloading clip:", error);
      res.status(500).json({ message: "Internal server error" });
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
    fileName: string
  ) {
    try {
      // Update status to processing
      await storage.updateClipStatus(clipId, "processing");
      
      // Process the video clip
      const result = await processVideoClip({
        youtubeId,
        startTime,
        endTime,
        quality,
        format,
        outputFileName: fileName
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
