import React, { useState, useEffect } from 'react';
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
import ThumbnailGenerator from "@/components/thumbnail-generator";
import type { ViralAnalysis } from "@/components/ai-viral-analysis";

type AppStep = 'input' | 'analysis' | 'processing' | 'voiceover' | 'completed';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('input');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AiSuggestion | null>(null);
  const [processingClipId, setProcessingClipId] = useState<number | null>(null);
  const [completedClip, setCompletedClip] = useState<ClipData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viralAnalysis, setViralAnalysis] = useState<ViralAnalysis | null>(null);
  const [voiceoverRequested, setVoiceoverRequested] = useState(false);
  
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
      setVoiceoverRequested(clip.aiVoiceOver || false);
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
    enabled: !!processingClipId && (currentStep === 'processing' || currentStep === 'voiceover'),
    refetchInterval: 1000, // Poll every second
  });

  // Handle clip status changes
  useEffect(() => {
    if (!clipStatus || !processingClipId) return;

    const clip = clipStatus as ClipData;
    
    if (clip.processingStatus === 'completed' && currentStep === 'processing') {
      // Clip processing is complete, check if voiceover is needed
      if (clip.aiVoiceOver && clip.narrationScript && !clip.voiceoverAdded && !clip.voiceoverProcessing) {
        // Start voiceover processing
        setCurrentStep('voiceover');
        handleVoiceoverGeneration(clip);
      } else {
        // No voiceover needed, complete
        setCompletedClip(clip);
        setCurrentStep('completed');
        setProcessingClipId(null);
      }
    } else if (clip.processingStatus === 'completed' && currentStep === 'voiceover') {
      // Check if voiceover is complete
      if (clip.voiceoverAdded && !clip.voiceoverProcessing) {
        setCompletedClip(clip);
        setCurrentStep('completed');
        setProcessingClipId(null);
      }
    }
  }, [clipStatus, currentStep, processingClipId]);

  const handleVoiceoverGeneration = async (clip: ClipData) => {
    toast({
      title: "Adding AI Voice Over...",
      description: "Generating narration and merging with your video.",
    });
    
    try {
      const response = await apiRequest('POST', '/api/clips/voiceover', {
        clipId: clip.id,
        narrationScript: clip.narrationScript,
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Voiceover generation started successfully
          toast({
            title: "Voice Over Processing",
            description: "Your narrated video is being generated.",
          });
        } else {
          throw new Error(result.message || 'Voiceover generation failed');
        }
      } else {
        const errorData = await response.json();
        if (response.status === 400 && errorData.message?.includes('already generated')) {
          // Voiceover already exists
          setCompletedClip({ 
            ...clip, 
            voiceoverAdded: true,
            voiceoverProcessing: false 
          });
          setCurrentStep('completed');
          setProcessingClipId(null);
          toast({
            title: "Voice Over Ready!",
            description: "Your narrated video is already available.",
          });
        } else {
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }
      }
    } catch (error: any) {
      console.error('Voiceover generation failed:', error);
      setCompletedClip({ 
        ...clip, 
        voiceoverProcessing: false 
      });
      setCurrentStep('completed');
      setProcessingClipId(null);
      toast({
        title: "Voice Over Failed",
        description: error.message || 'Failed to add AI voice over.',
        variant: "destructive",
      });
    }
  };

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

  const handleGenerateClip = async (clipData: any) => {
    createClipMutation.mutate(clipData);
  };

  const handleCreateAnother = () => {
    setCurrentStep('input');
    setVideoData(null);
    setSuggestions([]);
    setSelectedSuggestion(null);
    setProcessingClipId(null);
    setCompletedClip(null);
    setVoiceoverRequested(false);
  };

  // Calculate processing progress
  const getProcessingProgress = () => {
    if (!clipStatus || typeof clipStatus !== 'object' || !('processingStatus' in clipStatus)) {
      return 20;
    }

    const clip = clipStatus as ClipData;
    
    if (currentStep === 'processing') {
      switch (clip.processingStatus) {
        case 'pending': return 20;
        case 'processing': return 70;
        case 'completed': return 100;
        default: return 20;
      }
    } else if (currentStep === 'voiceover') {
      if (clip.voiceoverProcessing) {
        return 85; // Voiceover is being processed
      } else if (clip.voiceoverAdded) {
        return 100; // Voiceover is complete
      } else {
        return 80; // Waiting for voiceover to start
      }
    }
    
    return 20;
  };

  const getProcessingStep = () => {
    if (currentStep === 'processing') {
      return 'processing';
    } else if (currentStep === 'voiceover') {
      return 'voiceover';
    }
    return 'processing';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            Transform Your Videos with AI
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Create viral content, optimize for social media, and generate professional thumbnails with our advanced AI-powered platform
          </p>
        </div>

        <UrlInputSection 
          onAnalyze={handleAnalyze}
          isLoading={analyzeMutation.isPending}
        />

        {currentStep !== 'input' && videoData && (
          <div className="space-y-8">
            <VideoAnalysis video={videoData} />
            <AIViralAnalysis video={videoData} onAnalysis={(analysis) => setViralAnalysis(analysis)} />
            <ThumbnailGenerator video={videoData} thumbnailSuggestion={viralAnalysis?.thumbnailSuggestion} />
          </div>
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

        {(currentStep === 'processing' || currentStep === 'voiceover') && (
          <ProcessingStatus 
            progress={getProcessingProgress()} 
            step={getProcessingStep()}
            voiceoverRequested={voiceoverRequested}
            isDemoVideo={(clipStatus as ClipData)?.isDemoVideo}
          />
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
