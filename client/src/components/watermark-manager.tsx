import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useToast } from '../hooks/use-toast';
import { Upload, Image, Plus, Trash2 } from 'lucide-react';

interface Watermark {
  name: string;
  filename: string;
}

interface WatermarkManagerProps {
  onWatermarkChange: (addWatermark: boolean, watermarkPath?: string) => void;
  addWatermark?: boolean;
  watermarkPath?: string;
}

export function WatermarkManager({ onWatermarkChange, addWatermark = false, watermarkPath }: WatermarkManagerProps) {
  const [watermarks, setWatermarks] = useState<Watermark[]>([]);
  const [selectedWatermark, setSelectedWatermark] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWatermarks();
  }, []);

  useEffect(() => {
    if (addWatermark && selectedWatermark) {
      onWatermarkChange(true, selectedWatermark);
    } else if (!addWatermark) {
      onWatermarkChange(false);
    }
  }, [addWatermark, selectedWatermark, onWatermarkChange]);

  const loadWatermarks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/watermarks');
      const data = await response.json();
      
      if (response.ok) {
        const watermarkList = data.watermarks.map((filename: string) => ({
          name: filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
          filename
        }));
        setWatermarks(watermarkList);
        
        // Set selected watermark if one is already chosen
        if (watermarkPath && watermarkList.some(w => w.filename === watermarkPath)) {
          setSelectedWatermark(watermarkPath);
        } else if (watermarkList.length > 0) {
          setSelectedWatermark(watermarkList[0].filename);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load watermarks",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading watermarks:', error);
      toast({
        title: "Error",
        description: "Failed to load watermarks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createSampleWatermark = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/watermarks/sample', {
        method: 'POST',
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Sample watermark created successfully",
        });
        await loadWatermarks();
      } else {
        toast({
          title: "Error",
          description: "Failed to create sample watermark",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating sample watermark:', error);
      toast({
        title: "Error",
        description: "Failed to create sample watermark",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PNG, JPEG, GIF, or WebP image",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('watermark', file);

      const response = await fetch('/api/watermarks/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Watermark uploaded successfully",
        });
        await loadWatermarks();
      } else {
        toast({
          title: "Error",
          description: "Failed to upload watermark",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error uploading watermark:', error);
      toast({
        title: "Error",
        description: "Failed to upload watermark",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Watermark Settings
        </CardTitle>
        <CardDescription>
          Add a watermark to your clips for copyright protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="add-watermark"
            checked={addWatermark}
            onCheckedChange={(checked) => {
              onWatermarkChange(checked, checked ? selectedWatermark : undefined);
            }}
          />
          <Label htmlFor="add-watermark">Add watermark to clips</Label>
        </div>

        {addWatermark && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="watermark-select">Select Watermark</Label>
              <select
                id="watermark-select"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                value={selectedWatermark}
                onChange={(e) => {
                  setSelectedWatermark(e.target.value);
                  onWatermarkChange(true, e.target.value);
                }}
                disabled={isLoading}
              >
                {watermarks.length === 0 ? (
                  <option value="">No watermarks available</option>
                ) : (
                  watermarks.map((watermark) => (
                    <option key={watermark.filename} value={watermark.filename}>
                      {watermark.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {selectedWatermark && (
              <div className="flex items-center space-x-4">
                <img
                  src={`/api/watermarks/${selectedWatermark}`}
                  alt="Selected watermark"
                  className="w-16 h-16 object-contain border border-gray-300 rounded"
                />
                <div className="text-sm text-gray-600">
                  <p>Preview of selected watermark</p>
                  <p>Will be placed in bottom-right corner</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Upload New Watermark</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={createSampleWatermark}
                  disabled={isLoading}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Sample
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Supported formats: PNG, JPEG, GIF, WebP (max 5MB)
              </p>
            </div>

            {watermarks.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No watermarks available</p>
                <p className="text-sm">Upload an image or create a sample watermark</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 