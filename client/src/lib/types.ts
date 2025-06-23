export interface VideoData {
  id: number;
  youtubeId: string;
  title: string;
  description?: string;
  duration: number;
  formattedDuration?: string;
  thumbnailUrl?: string;
  channelName?: string;
  viewCount?: string;
  publishDate?: string;
}

export interface AiSuggestion {
  id: number;
  videoId: number;
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  duration: number;
  category: string;
  confidence: number;
}

export interface ClipData {
  id: number;
  videoId: number;
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
  quality: string;
  format: string;
  fileSize?: number;
  fileName?: string;
  downloadUrl?: string;
  isAiGenerated: boolean;
  processingStatus: string;
  // Video editing features
  zoomLevel?: number;
  cropX?: number;
  cropY?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hasRandomFootage?: boolean;
}

export interface AnalyzeResponse {
  video: VideoData;
  suggestions: AiSuggestion[];
}
