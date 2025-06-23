import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Scissors, Play, Wand2, Crosshair } from "lucide-react";
import { VideoData, AiSuggestion } from "@/lib/types";

import VideoEditor, { VideoEdits } from "./video-editor";
import PreviewModal from "./preview-modal";

interface ManualClipEditorProps {
  video: VideoData;
  suggestion?: AiSuggestion;
  onGenerateClip: (clipData: {
    videoId: number;
    title: string;
    startTime: number;
    endTime: number;
    quality: string;
    format: string;
    isAiGenerated: boolean;
    zoomLevel?: number;
    cropX?: number;
    cropY?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hasRandomFootage?: boolean;
  }) => void;
}

export default function ManualClipEditor({ video, suggestion, onGenerateClip }: ManualClipEditorProps) {
  const [startMinutes, setStartMinutes] = useState(0);
  const [startSeconds, setStartSeconds] = useState(0);
  const [endMinutes, setEndMinutes] = useState(0);
  const [endSeconds, setEndSeconds] = useState(30);
  const [quality, setQuality] = useState("720p");
  const [format, setFormat] = useState("mp4");
  const [title, setTitle] = useState("");
  const [videoEdits, setVideoEdits] = useState<VideoEdits>({
    zoomLevel: 1.0,
    cropX: 0,
    cropY: 0,
    brightness: 0,
    contrast: 1.0,
    saturation: 1.0,
    hasRandomFootage: false,
  });

  // Update fields when suggestion changes
  useEffect(() => {
    if (suggestion) {
      const startMin = Math.floor(suggestion.startTime / 60);
      const startSec = Math.floor(suggestion.startTime % 60);
      const endMin = Math.floor(suggestion.endTime / 60);
      const endSec = Math.floor(suggestion.endTime % 60);
      
      setStartMinutes(startMin);
      setStartSeconds(startSec);
      setEndMinutes(endMin);
      setEndSeconds(endSec);
      setTitle(suggestion.title);
    }
  }, [suggestion]);

  const startTime = startMinutes * 60 + startSeconds;
  const endTime = endMinutes * 60 + endSeconds;
  const clipDuration = Math.max(0, endTime - startTime);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const estimateFileSize = (duration: number, quality: string): string => {
    const multipliers = {
      "480p": 0.5,
      "720p": 1.0,
      "1080p": 2.0
    };
    const baseSize = duration * 1.5; // MB per second baseline
    const size = baseSize * (multipliers[quality as keyof typeof multipliers] || 1);
    return `~${Math.round(size)} MB`;
  };

  const handleGenerateClip = () => {
    if (clipDuration <= 0) return;
    
    onGenerateClip({
      videoId: video.id,
      title: title || `${video.title} - Clip`,
      startTime,
      endTime,
      quality,
      format,
      isAiGenerated: !!suggestion,
      ...videoEdits,
    });
  };

  const handleApplyEdits = (edits: VideoEdits) => {
    setVideoEdits(edits);
  };

  const isValid = clipDuration > 0 && endTime <= video.duration && startTime < endTime;

  return (
    <section className="mb-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-xl font-semibold youtube-dark mb-6 flex items-center">
          <Scissors className="text-youtube-red mr-3 h-6 w-6" />
          Custom Clip Editor
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Timeline Controls */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Set Clip Timing</h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Clip Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter clip title"
                  className="w-full"
                />
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Start Time</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max={Math.floor(video.duration / 60)}
                    value={startMinutes}
                    onChange={(e) => setStartMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="00"
                    className="w-16 text-center"
                  />
                  <span className="text-gray-500">:</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={startSeconds}
                    onChange={(e) => setStartSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    placeholder="00"
                    className="w-16 text-center"
                  />
                  <Button variant="ghost" size="sm" className="text-youtube-blue hover:text-blue-700 ml-4">
                    <Crosshair className="h-4 w-4 mr-1" />
                    Current
                  </Button>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">End Time</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max={Math.floor(video.duration / 60)}
                    value={endMinutes}
                    onChange={(e) => setEndMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="00"
                    className="w-16 text-center"
                  />
                  <span className="text-gray-500">:</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={endSeconds}
                    onChange={(e) => setEndSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    placeholder="00"
                    className="w-16 text-center"
                  />
                  <Button variant="ghost" size="sm" className="text-youtube-blue hover:text-blue-700 ml-4">
                    <Crosshair className="h-4 w-4 mr-1" />
                    Current
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Clip Duration: <span className={clipDuration > 0 ? "" : "text-red-500"}>{formatDuration(clipDuration)}</span></span>
                  <span>File Size: {estimateFileSize(clipDuration, quality)}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Maximum clip length: 10 minutes
                </div>
                {!isValid && (
                  <div className="text-xs text-red-500 mt-1">
                    {endTime > video.duration ? "End time exceeds video duration" :
                     startTime >= endTime ? "Start time must be before end time" :
                     "Invalid clip timing"}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Preview Controls */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Preview & Quality</h4>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Video Quality</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p HD (Recommended)</SelectItem>
                    <SelectItem value="1080p">1080p Full HD</SelectItem>
                    <SelectItem value="480p">480p (Smaller file)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">Output Format</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mp4">MP4 (Universal)</SelectItem>
                    <SelectItem value="webm">WebM (Web optimized)</SelectItem>
                    <SelectItem value="gif">GIF (Animation)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex space-x-3">
                <PreviewModal 
                  video={video}
                  startTime={startTime}
                  endTime={endTime}
                  videoEdits={videoEdits}
                  disabled={!isValid}
                />
                <Button 
                  onClick={handleGenerateClip}
                  disabled={!isValid}
                  className="flex-1 bg-youtube-red text-white hover:bg-red-600"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Clip
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <VideoEditor onApplyEdits={handleApplyEdits} initialEdits={videoEdits} />
        </div>
      </div>
    </section>
  );
}
