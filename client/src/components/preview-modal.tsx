import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Play, X } from "lucide-react";
import { VideoData } from "@/lib/types";
import { VideoEdits } from "./video-editor";

interface PreviewModalProps {
  video: VideoData;
  startTime: number;
  endTime: number;
  videoEdits: VideoEdits;
  disabled?: boolean;
}

export default function PreviewModal({ video, startTime, endTime, videoEdits, disabled }: PreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const generatePreviewUrl = () => {
    return `https://www.youtube.com/embed/${video.youtubeId}?start=${Math.floor(startTime)}&end=${Math.floor(endTime)}&autoplay=1`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="flex-1"
          disabled={disabled}
        >
          <Play className="h-4 w-4 mr-2" />
          Preview Clip
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Preview: {video.title}
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={generatePreviewUrl()}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium">Clip Info</h4>
              <div className="space-y-1 text-muted-foreground">
                <p>Start: {formatTime(startTime)}</p>
                <p>End: {formatTime(endTime)}</p>
                <p>Duration: {formatTime(endTime - startTime)}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Applied Effects</h4>
              <div className="space-y-1 text-muted-foreground">
                {videoEdits.zoomLevel !== 1.0 && <p>Zoom: {videoEdits.zoomLevel.toFixed(1)}x</p>}
                {videoEdits.brightness !== 0 && <p>Brightness: {videoEdits.brightness > 0 ? '+' : ''}{videoEdits.brightness.toFixed(1)}</p>}
                {videoEdits.contrast !== 1.0 && <p>Contrast: {videoEdits.contrast.toFixed(1)}x</p>}
                {videoEdits.saturation !== 1.0 && <p>Saturation: {videoEdits.saturation.toFixed(1)}x</p>}
                {videoEdits.hasRandomFootage && <p>Random footage: Enabled</p>}
                {Object.values(videoEdits).every((v, i) => 
                  i === 6 ? !v : (i === 0 ? v === 1.0 : (i === 1 || i === 2 ? v === 0 : v === 1.0))
                ) && <p>No effects applied</p>}
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This preview shows the original video segment. 
              The actual downloaded clip will include all applied effects (zoom, color corrections, random footage).
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}