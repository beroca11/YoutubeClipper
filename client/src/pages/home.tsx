import React, { useState } from 'react';
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { VideoData, AiSuggestion, ClipData, AnalyzeResponse } from "@/lib/types";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UrlInputSection from "@/components/url-input-section";
import VideoAnalysis from "@/components/video-analysis";
import AiClipSuggestions from "@/components/ai-clip-suggestions";
import ManualClipEditor from "@/components/manual-clip-editor";
import ProcessingStatus from "@/components/processing-status";
import DownloadSection from "@/components/download-section";
import FeaturesSection from "@/components/features-section";
import AIViralAnalysis from "@/components/ai-viral-analysis";

type AppStep = 'input' | 'analysis' | 'processing' | 'completed';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('input');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AiSuggestion | null>(null);
  const [processingClipId, setProcessingClipId] = useState<number | null>(null);
  const [completedClip, setCompletedClip] = useState<ClipData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();

  // Analyze video mutation
  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest('POST', '/api/analyze', { url });
      return response.json() as Promise<AnalyzeResponse>;
    },
    onSuccess: (data) => {
      setVideoData(data.video);
      setSuggestions(data.suggestions);
      setCurrentStep('analysis');
      toast({
        title: "Video analyzed successfully!",
        description: "AI suggestions have been generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create clip mutation
  const createClipMutation = useMutation({
    mutationFn: async (clipData: any) => {
      const response = await apiRequest('POST', '/api/clips', clipData);
      return response.json() as Promise<ClipData>;
    },
    onSuccess: (clip) => {
      setProcessingClipId(clip.id);
      setCurrentStep('processing');
      toast({
        title: "Clip creation started!",
        description: "Your video is being processed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create clip",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Poll clip status when processing
  const { data: clipStatus } = useQuery({
    queryKey: [`/api/clips/${processingClipId}`],
    enabled: !!processingClipId && currentStep === 'processing',
    refetchInterval: 1000, // Poll every second
  });

  // Check if clip is completed
  if (clipStatus && (clipStatus as ClipData).processingStatus === 'completed' && currentStep === 'processing') {
    setCompletedClip(clipStatus as ClipData);
    setCurrentStep('completed');
    setProcessingClipId(null);
    queryClient.invalidateQueries({ queryKey: [`/api/clips/${processingClipId}`] });
  }

  const handleAnalyze = (url: string) => {
    analyzeMutation.mutate(url);
  };

  const handleUseSuggestion = (suggestion: AiSuggestion) => {
    setSelectedSuggestion(suggestion);
  };

  const handleRegenerate = () => {
    // In a real app, this would call the API to regenerate suggestions
    toast({
      title: "Regenerating suggestions",
      description: "New AI suggestions will be available shortly.",
    });
  };

  const handleGenerateClip = (clipData: any) => {
    createClipMutation.mutate(clipData);
  };

  const handleCreateAnother = () => {
    setCurrentStep('input');
    setVideoData(null);
    setSuggestions([]);
    setSelectedSuggestion(null);
    setProcessingClipId(null);
    setCompletedClip(null);
  };

  // Calculate processing progress (mock)
  const processingProgress = clipStatus && typeof clipStatus === 'object' && 'processingStatus' in clipStatus ? 
    (clipStatus as ClipData).processingStatus === 'pending' ? 20 :
    (clipStatus as ClipData).processingStatus === 'processing' ? 70 :
    (clipStatus as ClipData).processingStatus === 'completed' ? 100 : 0
    : 20;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <UrlInputSection 
          onAnalyze={handleAnalyze}
          isLoading={analyzeMutation.isPending}
        />

        {currentStep !== 'input' && videoData && (
          <VideoAnalysis video={videoData} />
        )}

        {currentStep !== 'input' && videoData && (
          <AIViralAnalysis video={videoData} />
        )}

        {currentStep === 'analysis' && suggestions.length > 0 && (
          <>
            <AiClipSuggestions
              suggestions={suggestions}
              onUseSuggestion={handleUseSuggestion}
              onRegenerate={handleRegenerate}
            />
            
            <ManualClipEditor
              video={videoData!}
              suggestion={selectedSuggestion || undefined}
              onGenerateClip={handleGenerateClip}
            />
          </>
        )}

        {currentStep === 'processing' && (
          <ProcessingStatus progress={processingProgress} />
        )}

        {currentStep === 'completed' && completedClip && (
          <DownloadSection
            clip={completedClip}
            onCreateAnother={handleCreateAnother}
          />
        )}

        <FeaturesSection />
      </main>

      <Footer />
    </div>
  );
}
