import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useToast } from '../hooks/use-toast';

interface TikTokOptimizationProps {
  videoId: number;
  onOptimize: (options: TikTokOptimizationOptions) => void;
  isProcessing?: boolean;
}

interface TikTokOptimizationOptions {
  addSubtitles: boolean;
  subtitleStyle: 'modern' | 'classic' | 'bold' | 'minimal';
  addVisualEffects: boolean;
  optimizeForMobile: boolean;
  enhanceAudio: boolean;
  addWatermark: boolean;
  customSubtitles: string[];
  visualEffects: {
    brightness: number;
    contrast: number;
    saturation: number;
    gamma: number;
    blur: number;
    speed: number;
  };
  transitions: {
    type: 'fade' | 'slide' | 'zoom' | 'dissolve';
    duration: number;
  };
}

export function TikTokOptimizer({ videoId, onOptimize, isProcessing }: TikTokOptimizationProps) {
  const { toast } = useToast();
  const [options, setOptions] = useState<TikTokOptimizationOptions>({
    addSubtitles: true,
    subtitleStyle: 'modern',
    addVisualEffects: true,
    optimizeForMobile: true,
    enhanceAudio: true,
    addWatermark: false,
    customSubtitles: [''],
    visualEffects: {
      brightness: 0.1,
      contrast: 1.1,
      saturation: 1.2,
      gamma: 1.05,
      blur: 0,
      speed: 1.0
    },
    transitions: {
      type: 'fade',
      duration: 0.5
    }
  });

  const handleOptimize = () => {
    if (options.customSubtitles.length === 0 || options.customSubtitles[0].trim() === '') {
      toast({
        title: "Subtitles Required",
        description: "Please add at least one subtitle for TikTok optimization.",
        variant: "destructive"
      });
      return;
    }

    onOptimize(options);
    toast({
      title: "TikTok Optimization Started",
      description: "Your video is being optimized for TikTok with advanced features.",
    });
  };

  const addSubtitle = () => {
    setOptions(prev => ({
      ...prev,
      customSubtitles: [...prev.customSubtitles, '']
    }));
  };

  const removeSubtitle = (index: number) => {
    setOptions(prev => ({
      ...prev,
      customSubtitles: prev.customSubtitles.filter((_, i) => i !== index)
    }));
  };

  const updateSubtitle = (index: number, value: string) => {
    setOptions(prev => ({
      ...prev,
      customSubtitles: prev.customSubtitles.map((subtitle, i) => 
        i === index ? value : subtitle
      )
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎬 TikTok Optimizer
          <Badge variant="secondary">Advanced</Badge>
        </CardTitle>
        <CardDescription>
          Create TikTok-ready content with AI-powered optimization, creative subtitles, and visual effects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="subtitles">Subtitles</TabsTrigger>
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Subtitle Style</Label>
                <Select 
                  value={options.subtitleStyle} 
                  onValueChange={(value: any) => setOptions(prev => ({ ...prev, subtitleStyle: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Transition Type</Label>
                <Select 
                  value={options.transitions.type} 
                  onValueChange={(value: any) => setOptions(prev => ({ 
                    ...prev, 
                    transitions: { ...prev.transitions, type: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fade">Fade</SelectItem>
                    <SelectItem value="slide">Slide</SelectItem>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="dissolve">Dissolve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Add Subtitles</Label>
                <Switch 
                  checked={options.addSubtitles}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, addSubtitles: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Visual Effects</Label>
                <Switch 
                  checked={options.addVisualEffects}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, addVisualEffects: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Mobile Optimization</Label>
                <Switch 
                  checked={options.optimizeForMobile}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, optimizeForMobile: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Enhance Audio</Label>
                <Switch 
                  checked={options.enhanceAudio}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, enhanceAudio: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Add Watermark</Label>
                <Switch 
                  checked={options.addWatermark}
                  onCheckedChange={(checked) => setOptions(prev => ({ ...prev, addWatermark: checked }))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subtitles" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Custom Subtitles</Label>
                <Button variant="outline" size="sm" onClick={addSubtitle}>
                  Add Subtitle
                </Button>
              </div>

              {options.customSubtitles.map((subtitle, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Subtitle ${index + 1}`}
                    value={subtitle}
                    onChange={(e) => updateSubtitle(index, e.target.value)}
                    className="flex-1"
                  />
                  {options.customSubtitles.length > 1 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeSubtitle(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              <div className="text-xs text-muted-foreground">
                Subtitles will be displayed sequentially throughout the video duration
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Brightness</Label>
                <Slider
                  value={[options.visualEffects.brightness]}
                  onValueChange={([value]) => setOptions(prev => ({
                    ...prev,
                    visualEffects: { ...prev.visualEffects, brightness: value }
                  }))}
                  max={1}
                  min={-1}
                  step={0.1}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {options.visualEffects.brightness}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Contrast</Label>
                <Slider
                  value={[options.visualEffects.contrast]}
                  onValueChange={([value]) => setOptions(prev => ({
                    ...prev,
                    visualEffects: { ...prev.visualEffects, contrast: value }
                  }))}
                  max={2}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {options.visualEffects.contrast}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Saturation</Label>
                <Slider
                  value={[options.visualEffects.saturation]}
                  onValueChange={([value]) => setOptions(prev => ({
                    ...prev,
                    visualEffects: { ...prev.visualEffects, saturation: value }
                  }))}
                  max={2}
                  min={0}
                  step={0.1}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {options.visualEffects.saturation}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Gamma</Label>
                <Slider
                  value={[options.visualEffects.gamma]}
                  onValueChange={([value]) => setOptions(prev => ({
                    ...prev,
                    visualEffects: { ...prev.visualEffects, gamma: value }
                  }))}
                  max={2}
                  min={0.5}
                  step={0.05}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {options.visualEffects.gamma}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Blur</Label>
                <Slider
                  value={[options.visualEffects.blur]}
                  onValueChange={([value]) => setOptions(prev => ({
                    ...prev,
                    visualEffects: { ...prev.visualEffects, blur: value }
                  }))}
                  max={10}
                  min={0}
                  step={0.5}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {options.visualEffects.blur}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Speed</Label>
                <Slider
                  value={[options.visualEffects.speed]}
                  onValueChange={([value]) => setOptions(prev => ({
                    ...prev,
                    visualEffects: { ...prev.visualEffects, speed: value }
                  }))}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {options.visualEffects.speed}x
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Transition Duration (seconds)</Label>
                <Slider
                  value={[options.transitions.duration]}
                  onValueChange={([value]) => setOptions(prev => ({
                    ...prev,
                    transitions: { ...prev.transitions, duration: value }
                  }))}
                  max={2}
                  min={0.1}
                  step={0.1}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Current: {options.transitions.duration}s
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm font-medium">Optimization Features</Label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Vertical Format (9:16)
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Mobile-Optimized Audio
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    TikTok Algorithm Ready
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Engagement Optimized
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-end">
          <Button 
            onClick={handleOptimize} 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Optimizing for TikTok...
              </>
            ) : (
              'Create TikTok-Ready Video'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 