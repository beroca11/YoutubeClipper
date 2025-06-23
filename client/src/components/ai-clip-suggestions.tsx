import { useState } from "react";
import { AiSuggestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Bot, RotateCcw, Clock } from "lucide-react";

interface AiClipSuggestionsProps {
  suggestions: AiSuggestion[];
  onUseSuggestion: (suggestion: AiSuggestion) => void;
  onRegenerate: () => void;
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'highlight':
      return 'from-blue-50 to-purple-50 border-blue-100 bg-blue-100 text-blue-800';
    case 'action':
      return 'from-green-50 to-teal-50 border-green-100 bg-green-100 text-green-800';
    case 'scenic':
      return 'from-orange-50 to-red-50 border-orange-100 bg-orange-100 text-orange-800';
    default:
      return 'from-gray-50 to-gray-50 border-gray-100 bg-gray-100 text-gray-800';
  }
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export default function AiClipSuggestions({ suggestions, onUseSuggestion, onRegenerate }: AiClipSuggestionsProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<AiSuggestion | null>(null);

  const handleSuggestionClick = (suggestion: AiSuggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const handleUseSuggestion = () => {
    if (selectedSuggestion) {
      onUseSuggestion(selectedSuggestion);
    }
  };

  return (
    <section className="mb-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold youtube-dark flex items-center">
            <Bot className="text-youtube-blue mr-3 h-6 w-6" />
            AI Clip Suggestions
          </h3>
          <Button 
            variant="ghost"
            onClick={onRegenerate}
            className="text-youtube-blue hover:text-blue-700 text-sm font-medium"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Regenerate
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {suggestions.map((suggestion) => {
            const colorClasses = getCategoryColor(suggestion.category);
            const isSelected = selectedSuggestion?.id === suggestion.id;
            
            return (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`bg-gradient-to-br ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} rounded-xl p-4 border ${colorClasses.split(' ')[2]} hover:shadow-md transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`${colorClasses.split(' ')[3]} ${colorClasses.split(' ')[4]} ${colorClasses.split(' ')[5]} text-xs font-medium px-2 py-1 rounded-full capitalize`}>
                    {suggestion.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatDuration(suggestion.duration)}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{suggestion.title}</h4>
                {suggestion.description && (
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                )}
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatTime(suggestion.startTime)} - {formatTime(suggestion.endTime)}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="text-center">
          <Button
            onClick={handleUseSuggestion}
            disabled={!selectedSuggestion}
            className="bg-youtube-blue text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Use Selected Suggestion
          </Button>
        </div>
      </div>
    </section>
  );
}
