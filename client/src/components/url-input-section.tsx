import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UrlInputSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export default function UrlInputSection({ onAnalyze, isLoading }: UrlInputSectionProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const validateYouTubeUrl = (url: string): boolean => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
    return pattern.test(url);
  };

  const handleSubmit = () => {
    if (!url) {
      setError("Please enter a YouTube URL");
      return;
    }
    
    if (!validateYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }
    
    setError("");
    onAnalyze(url);
  };

  const handleInputChange = (value: string) => {
    setUrl(value);
    if (error) setError("");
  };

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold youtube-dark mb-4">Clip YouTube Videos with AI</h2>
        <p className="youtube-gray text-lg max-w-2xl mx-auto">
          Paste any YouTube URL and let our AI create perfect clips for you. Download instantly.
        </p>
      </div>
      
      <div className="bg-youtube-light rounded-2xl p-8 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="url"
              placeholder="Paste YouTube URL here (e.g., https://youtube.com/watch?v=...)"
              value={url}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-youtube-red focus:ring-0 focus:outline-none transition-colors youtube-dark"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-youtube-red text-white px-8 py-3 rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center space-x-2 min-w-32"
          >
            <Search className="h-4 w-4" />
            <span>{isLoading ? "Analyzing..." : "Analyze"}</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
