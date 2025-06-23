import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipData } from "@/lib/types";
import { Check, Download, Share, Plus, Loader2 } from "lucide-react";

interface DownloadSectionProps {
  clip: ClipData;
  onCreateAnother: () => void;
}

export default function DownloadSection({ clip, onCreateAnother }: DownloadSectionProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "Unknown size";
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    if (!clip.downloadUrl) return;
    
    setIsDownloading(true);
    
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = clip.downloadUrl;
      link.download = clip.fileName || 'video-clip.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="mb-12">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200 p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <Check className="text-green-600 text-3xl h-12 w-12" />
          </div>
          <h3 className="text-xl font-semibold youtube-dark mb-2">Your Clip is Ready!</h3>
          <p className="youtube-gray">Perfect! Your video clip has been processed and is ready for download.</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 mb-6 max-w-md mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
              <div className="text-white text-xs">VIDEO</div>
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-medium text-gray-900">{clip.fileName || 'video-clip.mp4'}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Duration: <span>{formatDuration(clip.duration)}</span></div>
                <div>Size: <span>{formatFileSize(clip.fileSize)}</span></div>
                <div>Quality: <span>{clip.quality} {clip.format.toUpperCase()}</span></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleDownload}
            disabled={isDownloading || !clip.downloadUrl}
            className="bg-youtube-red text-white px-8 py-3 rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Clip
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="border-2 border-youtube-blue text-youtube-blue px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors font-medium flex items-center justify-center"
          >
            <Share className="h-4 w-4 mr-2" />
            Share Clip
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={onCreateAnother}
            className="text-youtube-blue hover:text-blue-700 font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Another Clip
          </Button>
        </div>
      </div>
    </section>
  );
}
