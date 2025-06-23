import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { VideoData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, TrendingUp, Brain, Share2, Target, Clock, Hash, Eye } from "lucide-react";

interface ViralAnalysis {
  viralityScore: number;
  viralFactors: string[];
  targetAudience: string[];
  bestPostingTime: string;
  hashtags: string[];
  description: string;
  title: string;
  thumbnailSuggestion: string;
  engagementPrediction: number;
}

interface ContentExplanation {
  summary: string;
  keyPoints: string[];
  emotionalTone: string;
  trendingTopics: string[];
  callToAction: string;
}

interface SocialMediaOptimization {
  platform: string;
  optimalLength: number;
  hook: string;
  description: string;
  hashtags: string[];
  postingTime: string;
}

interface AIViralAnalysisProps {
  video: VideoData;
}

export default function AIViralAnalysis({ video }: AIViralAnalysisProps) {
  const [viralAnalysis, setViralAnalysis] = useState<ViralAnalysis | null>(null);
  const [contentExplanation, setContentExplanation] = useState<ContentExplanation | null>(null);
  const [socialOptimizations, setSocialOptimizations] = useState<SocialMediaOptimization[]>([]);
  const { toast } = useToast();

  // Viral analysis mutation
  const viralAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/analyze-virality', { videoId: video.id });
      return response.json() as Promise<ViralAnalysis>;
    },
    onSuccess: (data) => {
      setViralAnalysis(data);
      toast({
        title: "Viral Analysis Complete!",
        description: `Virality Score: ${(data.viralityScore * 100).toFixed(1)}%`,
      });
    },
    onError: (error: any) => {
      console.error('Viral analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze video. Check your OpenAI API key configuration.",
        variant: "destructive",
      });
    },
  });

  // Content explanation mutation
  const contentExplanationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/ai/generate-explanation', { videoId: video.id });
      return response.json() as Promise<ContentExplanation>;
    },
    onSuccess: (data) => {
      setContentExplanation(data);
      toast({
        title: "Content Explanation Generated!",
        description: "AI has analyzed the video content.",
      });
    },
    onError: (error: any) => {
      console.error('Content explanation error:', error);
      toast({
        title: "Explanation Failed",
        description: error.message || "Failed to generate explanation. Check your OpenAI API key configuration.",
        variant: "destructive",
      });
    },
  });

  // Social media optimization mutation
  const socialOptimizationMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await apiRequest('POST', '/api/ai/optimize-social-media', { 
        videoId: video.id, 
        platform 
      });
      return response.json() as Promise<SocialMediaOptimization>;
    },
    onSuccess: (data) => {
      setSocialOptimizations(prev => [...prev, data]);
      toast({
        title: `${data.platform} Optimization Complete!`,
        description: `Optimal length: ${data.optimalLength}s`,
      });
    },
    onError: (error: any) => {
      console.error('Social optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: error.message || "Failed to optimize for social media. Check your OpenAI API key configuration.",
        variant: "destructive",
      });
    },
  });

  const platforms = ['TikTok', 'Instagram', 'YouTube Shorts', 'Twitter'];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Viral Analysis Agent
          </CardTitle>
          <CardDescription>
            Analyze your video for maximum social media virality and engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => viralAnalysisMutation.mutate()}
              disabled={viralAnalysisMutation.isPending}
              className="w-full"
            >
              {viralAnalysisMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TrendingUp className="h-4 w-4 mr-2" />
              )}
              Analyze Virality
            </Button>

            <Button
              onClick={() => contentExplanationMutation.mutate()}
              disabled={contentExplanationMutation.isPending}
              className="w-full"
              variant="outline"
            >
              {contentExplanationMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Brain className="h-4 w-4 mr-2" />
              )}
              Generate Explanation
            </Button>

            <Button
              onClick={() => socialOptimizationMutation.mutate('TikTok')}
              disabled={socialOptimizationMutation.isPending}
              className="w-full"
              variant="secondary"
            >
              {socialOptimizationMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              Optimize for TikTok
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="virality" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="virality">Viral Analysis</TabsTrigger>
          <TabsTrigger value="explanation">Content Explanation</TabsTrigger>
          <TabsTrigger value="optimization">Social Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="virality" className="space-y-4">
          {viralAnalysis ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Viral Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Virality Score</span>
                    <span className="text-2xl font-bold text-green-600">
                      {(viralAnalysis.viralityScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={viralAnalysis.viralityScore * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Target Audience
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {viralAnalysis.targetAudience.map((audience, index) => (
                        <Badge key={index} variant="secondary">{audience}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Best Posting Time
                    </h4>
                    <p className="text-sm text-muted-foreground">{viralAnalysis.bestPostingTime}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Recommended Hashtags
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {viralAnalysis.hashtags.map((hashtag, index) => (
                      <Badge key={index} variant="outline">{hashtag}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Viral Factors</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {viralAnalysis.viralFactors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">AI-Generated Title</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">{viralAnalysis.title}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">AI-Generated Description</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">{viralAnalysis.description}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Engagement Prediction
                  </h4>
                  <p className="text-lg font-semibold text-blue-600">
                    {viralAnalysis.engagementPrediction.toFixed(1)}% engagement rate
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Click "Analyze Virality" to get AI-powered viral analysis
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="explanation" className="space-y-4">
          {contentExplanation ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Content Explanation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Summary</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">{contentExplanation.summary}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Key Points</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {contentExplanation.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Emotional Tone</h4>
                    <Badge variant="outline">{contentExplanation.emotionalTone}</Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Trending Topics</h4>
                    <div className="flex flex-wrap gap-1">
                      {contentExplanation.trendingTopics.map((topic, index) => (
                        <Badge key={index} variant="secondary">{topic}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Call to Action</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">{contentExplanation.callToAction}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Click "Generate Explanation" to get AI-powered content analysis
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {platforms.map((platform) => (
              <Button
                key={platform}
                onClick={() => socialOptimizationMutation.mutate(platform)}
                disabled={socialOptimizationMutation.isPending}
                variant="outline"
                size="sm"
              >
                {platform}
              </Button>
            ))}
          </div>

          {socialOptimizations.length > 0 && (
            <div className="space-y-4">
              {socialOptimizations.map((optimization, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Share2 className="h-5 w-5" />
                      {optimization.platform} Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Optimal Length</h4>
                        <p className="text-sm">{optimization.optimalLength} seconds</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Best Posting Time</h4>
                        <p className="text-sm">{optimization.postingTime}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Hook</h4>
                      <p className="text-sm bg-muted p-3 rounded-md">{optimization.hook}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Description</h4>
                      <p className="text-sm bg-muted p-3 rounded-md">{optimization.description}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Hashtags</h4>
                      <div className="flex flex-wrap gap-1">
                        {optimization.hashtags.map((hashtag, hashtagIndex) => (
                          <Badge key={hashtagIndex} variant="outline">{hashtag}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 