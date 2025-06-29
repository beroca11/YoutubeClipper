import { Badge } from "@/components/ui/badge";
import { VideoEdits } from "./video-editor";

interface EffectsPreviewProps {
  edits: VideoEdits;
}

export default function EffectsPreview({ edits }: EffectsPreviewProps) {
  const activeEffects = [];

  if (edits.aspectRatio !== "16:9") {
    activeEffects.push(`Aspect Ratio: ${edits.aspectRatio}`);
  }

  if (edits.zoomLevel !== 1.0) {
    activeEffects.push(`Zoom: ${edits.zoomLevel.toFixed(1)}x`);
  }
  
  if (edits.cropX !== 0) {
    activeEffects.push(`Crop X: ${edits.cropX}px`);
  }
  
  if (edits.cropY !== 0) {
    activeEffects.push(`Crop Y: ${edits.cropY}px`);
  }
  
  if (edits.brightness !== 0) {
    activeEffects.push(`Brightness: ${edits.brightness > 0 ? '+' : ''}${edits.brightness.toFixed(1)}`);
  }
  
  if (edits.contrast !== 1.0) {
    activeEffects.push(`Contrast: ${edits.contrast.toFixed(1)}x`);
  }
  
  if (edits.saturation !== 1.0) {
    activeEffects.push(`Saturation: ${edits.saturation.toFixed(1)}x`);
  }
  
  if (edits.hasRandomFootage) {
    activeEffects.push('Random Footage');
  }

  if (activeEffects.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No effects applied
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Active Effects:</div>
      <div className="flex flex-wrap gap-1">
        {activeEffects.map((effect, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {effect}
          </Badge>
        ))}
      </div>
    </div>
  );
}