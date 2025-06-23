import { videos, clips, aiSuggestions, type Video, type InsertVideo, type Clip, type InsertClip, type AiSuggestion, type InsertAiSuggestion } from "@shared/schema";

export interface IStorage {
  // Video operations
  getVideo(id: number): Promise<Video | undefined>;
  getVideoByYoutubeId(youtubeId: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  
  // Clip operations
  getClip(id: number): Promise<Clip | undefined>;
  getClipsByVideoId(videoId: number): Promise<Clip[]>;
  createClip(clip: InsertClip & { duration: number }): Promise<Clip>;
  updateClipStatus(id: number, status: string, downloadUrl?: string, fileSize?: number): Promise<Clip | undefined>;
  
  // AI Suggestion operations
  getAiSuggestionsByVideoId(videoId: number): Promise<AiSuggestion[]>;
  createAiSuggestions(suggestions: InsertAiSuggestion[]): Promise<AiSuggestion[]>;
}

export class MemStorage implements IStorage {
  private videos: Map<number, Video>;
  private clips: Map<number, Clip>;
  private aiSuggestions: Map<number, AiSuggestion>;
  private currentVideoId: number;
  private currentClipId: number;
  private currentSuggestionId: number;

  constructor() {
    this.videos = new Map();
    this.clips = new Map();
    this.aiSuggestions = new Map();
    this.currentVideoId = 1;
    this.currentClipId = 1;
    this.currentSuggestionId = 1;
  }

  async getVideo(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async getVideoByYoutubeId(youtubeId: string): Promise<Video | undefined> {
    return Array.from(this.videos.values()).find(
      (video) => video.youtubeId === youtubeId,
    );
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = this.currentVideoId++;
    const video: Video = { 
      ...insertVideo,
      id, 
      createdAt: new Date(),
      description: insertVideo.description ?? null,
      thumbnailUrl: insertVideo.thumbnailUrl ?? null,
      channelName: insertVideo.channelName ?? null,
      viewCount: insertVideo.viewCount ?? null,
      publishDate: insertVideo.publishDate ?? null
    };
    this.videos.set(id, video);
    return video;
  }

  async getClip(id: number): Promise<Clip | undefined> {
    return this.clips.get(id);
  }

  async getClipsByVideoId(videoId: number): Promise<Clip[]> {
    return Array.from(this.clips.values()).filter(
      (clip) => clip.videoId === videoId,
    );
  }

  async createClip(insertClip: InsertClip & { duration: number }): Promise<Clip> {
    const id = this.currentClipId++;
    const clip: Clip = { 
      ...insertClip, 
      id, 
      createdAt: new Date(),
      quality: insertClip.quality ?? "720p",
      format: insertClip.format ?? "mp4",
      fileSize: insertClip.fileSize ?? null,
      fileName: insertClip.fileName ?? null,
      downloadUrl: insertClip.downloadUrl ?? null,
      isAiGenerated: insertClip.isAiGenerated ?? false,
      processingStatus: insertClip.processingStatus ?? "pending"
    };
    this.clips.set(id, clip);
    return clip;
  }

  async updateClipStatus(id: number, status: string, downloadUrl?: string, fileSize?: number): Promise<Clip | undefined> {
    const clip = this.clips.get(id);
    if (!clip) return undefined;
    
    const updatedClip: Clip = {
      ...clip,
      processingStatus: status,
      downloadUrl: downloadUrl || clip.downloadUrl,
      fileSize: fileSize || clip.fileSize,
    };
    
    this.clips.set(id, updatedClip);
    return updatedClip;
  }

  async getAiSuggestionsByVideoId(videoId: number): Promise<AiSuggestion[]> {
    return Array.from(this.aiSuggestions.values()).filter(
      (suggestion) => suggestion.videoId === videoId,
    );
  }

  async createAiSuggestions(insertSuggestions: InsertAiSuggestion[]): Promise<AiSuggestion[]> {
    const suggestions: AiSuggestion[] = [];
    
    for (const insertSuggestion of insertSuggestions) {
      const id = this.currentSuggestionId++;
      const suggestion: AiSuggestion = { 
        ...insertSuggestion, 
        id, 
        createdAt: new Date(),
        description: insertSuggestion.description ?? null,
        confidence: insertSuggestion.confidence ?? 0.8
      };
      this.aiSuggestions.set(id, suggestion);
      suggestions.push(suggestion);
    }
    
    return suggestions;
  }
}

export const storage = new MemStorage();
