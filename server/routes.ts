import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, insertClipSchema } from "@shared/schema";
// Removed ytdl-core due to reliability issues
import { z } from "zod";

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
        // Create video with mock data for demo purposes
        // In production, this would integrate with YouTube's official API
        try {
          const videoData = insertVideoSchema.parse({
            youtubeId,
            title: `Sample Video - ${youtubeId}`,
            description: "This is a demo video for the AI Video Clipper application. In production, this would fetch real YouTube video metadata.",
            duration: 600 + Math.floor(Math.random() * 1800), // 10-40 minutes
            thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
            channelName: "Demo Channel",
            viewCount: `${Math.floor(Math.random() * 1000000).toLocaleString()} views`,
            publishDate: new Date().toLocaleDateString(),
          });
          
          video = await storage.createVideo(videoData);
          
          // Generate AI suggestions
          const aiSuggestions = generateAiSuggestions(video.duration);
          const suggestionsToCreate = aiSuggestions.map(suggestion => ({
            videoId: video!.id,
            ...suggestion,
          }));
          
          await storage.createAiSuggestions(suggestionsToCreate);
          
        } catch (error) {
          console.error("Error creating video:", error);
          return res.status(400).json({ message: "Unable to process video information" });
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
      const clipData = insertClipSchema.parse(req.body);
      
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
      
      // Calculate duration and generate filename
      const duration = clipData.endTime - clipData.startTime;
      const fileName = `${video.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)}_${Date.now()}.${clipData.format}`;
      
      const clip = await storage.createClip({
        ...clipData,
        duration,
        fileName,
        processingStatus: "pending",
      });
      
      // Start processing (simulate async processing)
      setTimeout(async () => {
        try {
          // In a real implementation, this would use ffmpeg to clip the video
          // For now, we'll simulate the processing and create a mock download URL
          const downloadUrl = `/api/clips/${clip.id}/download`;
          const estimatedFileSize = Math.floor(duration * 1024 * 1024 * 0.1); // Rough estimate
          
          await storage.updateClipStatus(clip.id, "completed", downloadUrl, estimatedFileSize);
        } catch (error) {
          console.error("Error processing clip:", error);
          await storage.updateClipStatus(clip.id, "failed");
        }
      }, 3000); // Simulate 3 second processing time
      
      res.json(clip);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
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
      
      // In a real implementation, this would serve the actual video file
      // For now, we'll return a mock response
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader("Content-Disposition", `attachment; filename="${clip.fileName}"`);
      res.send(Buffer.from("Mock video file content"));
      
    } catch (error) {
      console.error("Error downloading clip:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
