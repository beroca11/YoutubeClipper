# Watermark System Setup Guide

## Overview
The YouTube Clipper now includes a watermark system that allows you to add custom watermarks to your video clips. This helps with copyright protection and brand recognition.

## Features
- **Custom Watermarks**: Add your own logo, text, or image watermarks
- **Automatic Placement**: Watermarks are positioned in the bottom-right corner
- **Multiple Formats**: Supports PNG, JPEG, GIF, WebP, and BMP
- **Random Selection**: Automatically selects a random watermark from your collection
- **Easy Management**: Upload and manage watermarks through the web interface

## Quick Setup

### 1. Create Watermark Directory
Run the setup script to create the watermark directory and a sample watermark:

```bash
# Windows
setup-watermarks.bat

# Or manually create the directory
mkdir watermarks
```

### 2. Add Your Watermarks
Place your watermark images in the `watermarks` folder. Supported formats:
- PNG (recommended for transparency)
- JPEG/JPG
- GIF
- WebP
- BMP

### 3. Recommended Watermark Specifications
- **Size**: 120x120 pixels (will be automatically scaled)
- **Format**: PNG with transparency for best results
- **Content**: Your logo, brand name, or copyright text
- **File Size**: Keep under 5MB for optimal performance

## Using Watermarks in the App

### 1. Enable Watermark Feature
1. Go to the Video Editor section
2. Click on the "Watermark" tab
3. Toggle "Add watermark to clips" to ON

### 2. Select a Watermark
- Choose from your uploaded watermarks in the dropdown
- Preview the selected watermark
- The watermark will be automatically placed in the bottom-right corner

### 3. Upload New Watermarks
- Click "Choose File" to upload a new watermark
- Supported formats: PNG, JPEG, GIF, WebP (max 5MB)
- The watermark will be available immediately after upload

### 4. Create Sample Watermark
- Click "Create Sample" to generate a basic "AI CLIPPER" watermark
- Useful for testing or as a starting point

## API Endpoints

### List Watermarks
```http
GET /api/watermarks
```

### Create Sample Watermark
```http
POST /api/watermarks/sample
```

### Upload Watermark
```http
POST /api/watermarks/upload
Content-Type: multipart/form-data
```

### Get Watermark Image
```http
GET /api/watermarks/{filename}
```

## Technical Details

### Watermark Processing
- Watermarks are scaled to 120x120 pixels
- Positioned at bottom-right with 20px padding
- Applied after all other video effects
- Uses FFmpeg overlay filter for high quality

### File Structure
```
YoutubeClipper/
├── watermarks/           # Watermark images directory
│   ├── logo.png
│   ├── brand.jpg
│   └── sample_watermark.png
├── server/
│   ├── watermark.ts      # Watermark processing logic
│   └── routes.ts         # API endpoints
└── client/src/components/
    └── watermark-manager.tsx  # Frontend component
```

### Error Handling
- If watermark processing fails, the clip is created without watermark
- Invalid watermark files are skipped
- Missing watermark directory is automatically created
- Graceful fallback to original clip if watermark system is unavailable

## Troubleshooting

### Common Issues

1. **Watermark not appearing**
   - Check that the watermark file exists in the `watermarks` folder
   - Verify the file format is supported
   - Ensure the watermark toggle is enabled

2. **Upload fails**
   - Check file size (max 5MB)
   - Verify file format is supported
   - Ensure you have write permissions to the watermarks folder

3. **Watermark looks blurry**
   - Use higher resolution source images
   - PNG format with transparency works best
   - Avoid very small source images

4. **FFmpeg errors**
   - Ensure FFmpeg is installed and in PATH
   - Check that the watermark file is not corrupted
   - Verify file permissions

### Performance Tips
- Use PNG format for best quality
- Keep watermark files under 1MB
- Use simple designs that scale well
- Test with different video resolutions

## Security Considerations
- Only image files are accepted
- File size limits prevent abuse
- Watermarks are served with proper MIME types
- No executable files are allowed

## Future Enhancements
- Custom watermark positioning
- Transparency/opacity controls
- Multiple watermark support
- Animated watermarks
- Watermark templates
- Batch watermark processing

## Support
If you encounter issues with the watermark system:
1. Check the server logs for error messages
2. Verify FFmpeg installation
3. Test with the sample watermark first
4. Ensure proper file permissions 