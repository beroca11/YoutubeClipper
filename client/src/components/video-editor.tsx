import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ZoomIn, ZoomOut, Sun, Contrast, Palette, Video, Monitor } from "lucide-react";
import { WatermarkManager } from "./watermark-manager";

interface VideoEditorProps {
  onApplyEdits: (edits: VideoEdits) => void;
  initialEdits?: VideoEdits;
}

export interface VideoEdits {
  zoomLevel: number;
  cropX: number;
  cropY: number;
  brightness: number;
  contrast: number;
  saturation: number;
  hasRandomFootage: boolean;
  addWatermark: boolean;
  watermarkPath?: string;
  aspectRatio: string;
}

export default function VideoEditor({ onApplyEdits, initialEdits }: VideoEditorProps) {
  const [edits, setEdits] = useState<VideoEdits>(initialEdits || {
    zoomLevel: 1.0,
    cropX: 0,
    cropY: 0,
    brightness: 0,
    contrast: 1.0,
    saturation: 1.0,
    hasRandomFootage: false,
    addWatermark: false,
    aspectRatio: "16:9",
  });

  const handleEditChange = (field: keyof VideoEdits, value: number | boolean | string) => {
    if (field === 'aspectRatio') {
      console.log('Aspect ratio changed to:', value);
    }
    const updatedEdits = { ...edits, [field]: value };
    setEdits(updatedEdits);
    onApplyEdits(updatedEdits);
  };

  const handleWatermarkChange = (addWatermark: boolean, watermarkPath?: string) => {
    const updatedEdits = { ...edits, addWatermark, watermarkPath };
    setEdits(updatedEdits);
    onApplyEdits(updatedEdits);
  };

  const resetEdits = () => {
    const defaultEdits: VideoEdits = {
      zoomLevel: 1.0,
      cropX: 0,
      cropY: 0,
      brightness: 0,
      contrast: 1.0,
      saturation: 1.0,
      hasRandomFootage: false,
      addWatermark: false,
      aspectRatio: "16:9",
    };
    setEdits(defaultEdits);
    onApplyEdits(defaultEdits);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Video Editor - Copyright Protection
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Apply video effects and modifications to help avoid copyright issues
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="zoom" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="zoom">Zoom & Crop</TabsTrigger>
            <TabsTrigger value="effects">Color Effects</TabsTrigger>
            <TabsTrigger value="footage">Random Footage</TabsTrigger>
            <TabsTrigger value="watermark">Watermark</TabsTrigger>
            <TabsTrigger value="aspect-ratio">Aspect Ratio</TabsTrigger>
          </TabsList>

          <TabsContent value="zoom" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <ZoomIn className="h-4 w-4" />
                  Zoom Level: {edits.zoomLevel.toFixed(1)}x
                </Label>
                <Slider
                  value={[edits.zoomLevel]}
                  onValueChange={([value]) => handleEditChange('zoomLevel', value)}
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Zoom in to focus on specific areas and crop out watermarks
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Horizontal Crop: {edits.cropX}px</Label>
                  <Slider
                    value={[edits.cropX]}
                    onValueChange={([value]) => handleEditChange('cropX', value)}
                    min={-100}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vertical Crop: {edits.cropY}px</Label>
                  <Slider
                    value={[edits.cropY]}
                    onValueChange={([value]) => handleEditChange('cropY', value)}
                    min={-100}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="effects" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Brightness: {edits.brightness > 0 ? '+' : ''}{edits.brightness.toFixed(1)}
                </Label>
                <Slider
                  value={[edits.brightness]}
                  onValueChange={([value]) => handleEditChange('brightness', value)}
                  min={-0.5}
                  max={0.5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Contrast className="h-4 w-4" />
                  Contrast: {edits.contrast.toFixed(1)}x
                </Label>
                <Slider
                  value={[edits.contrast]}
                  onValueChange={([value]) => handleEditChange('contrast', value)}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Saturation: {edits.saturation.toFixed(1)}x
                </Label>
                <Slider
                  value={[edits.saturation]}
                  onValueChange={([value]) => handleEditChange('saturation', value)}
                  min={0.0}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="footage" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="random-footage"
                  checked={edits.hasRandomFootage}
                  onCheckedChange={(checked) => handleEditChange('hasRandomFootage', checked)}
                />
                <Label htmlFor="random-footage" className="font-medium">
                  Add Random Footage Below
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, adds random copyright-free footage at the bottom of your clip. 
                This helps disguise the original content and can reduce copyright detection.
              </p>
              
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Random footage feature is currently being improved for better compatibility. 
                  The main clip generation will still work perfectly without this feature.
                </p>
              </div>
              
              {edits.hasRandomFootage && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Random Footage Options:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Nature scenes (trees, water, sky)</li>
                    <li>• Abstract patterns and textures</li>
                    <li>• Stock footage clips</li>
                    <li>• Geometric animations</li>
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="watermark" className="space-y-6">
            <WatermarkManager
              onWatermarkChange={handleWatermarkChange}
              addWatermark={edits.addWatermark}
              watermarkPath={edits.watermarkPath}
            />
          </TabsContent>

          <TabsContent value="aspect-ratio" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Aspect Ratio: {edits.aspectRatio}
                </Label>
                <Select
                  value={edits.aspectRatio}
                  onValueChange={(value) => handleEditChange('aspectRatio', value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 - YouTube (Landscape)</SelectItem>
                    <SelectItem value="9:16">9:16 - TikTok/Facebook Shorts (Vertical)</SelectItem>
                    <SelectItem value="1:1">1:1 - Instagram Square</SelectItem>
                    <SelectItem value="4:3">4:3 - Classic TV Format</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose the aspect ratio that best fits your target platform
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="flex justify-between">
          <Button variant="outline" onClick={resetEdits}>
            Reset All
          </Button>
          <Button 
            onClick={() => {
              onApplyEdits(edits);
              // Show confirmation
              const effectsCount = Object.values(edits).filter((v, i) => 
                i === 6 ? v : (i === 0 ? v !== 1.0 : (i === 1 || i === 2 ? v !== 0 : v !== 1.0))
              ).length;
              
              if (effectsCount > 0) {
                alert(`✓ ${effectsCount} video effects applied successfully!\n\nEffects will be visible in the downloaded clip.`);
              }
            }} 
            className="bg-red-600 hover:bg-red-700"
          >
            Apply Edits
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}