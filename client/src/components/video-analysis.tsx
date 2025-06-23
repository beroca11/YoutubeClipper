import { VideoData } from "@/lib/types";
import { Eye, Calendar, User, Play } from "lucide-react";

interface VideoAnalysisProps {
  video: VideoData;
}

export default function VideoAnalysis({ video }: VideoAnalysisProps) {
  return (
    <section className="mb-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold youtube-dark mb-6">Video Analysis</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Video Preview */}
            <div className="md:col-span-1">
              <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer">
                {video.thumbnailUrl ? (
                  <img 
                    src={video.thumbnailUrl}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Play className="text-white text-4xl h-16 w-16" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="text-white text-4xl h-16 w-16" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                  {video.formattedDuration || `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}`}
                </div>
              </div>
            </div>
            
            {/* Video Info */}
            <div className="md:col-span-2">
              <h4 className="font-semibold text-lg youtube-dark mb-3">
                {video.title}
              </h4>
              <div className="space-y-3 text-sm youtube-gray">
                <div className="flex items-center space-x-4">
                  {video.viewCount && (
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-2" />
                      {video.viewCount} views
                    </span>
                  )}
                  {video.publishDate && (
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {video.publishDate}
                    </span>
                  )}
                </div>
                {video.channelName && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 mr-2" />
                    <span>{video.channelName}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">Verified</span>
                  </div>
                )}
                {video.description && (
                  <p className="youtube-gray line-clamp-3">
                    {video.description.substring(0, 200)}...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
