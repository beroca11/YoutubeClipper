@echo off
echo Setting up watermark system...

REM Create watermark directory
if not exist "watermarks" (
    mkdir watermarks
    echo Created watermarks directory
) else (
    echo Watermarks directory already exists
)

REM Create a simple sample watermark using FFmpeg
echo Creating sample watermark...
ffmpeg -f lavfi -i "color=c=white:s=120x120:d=1" -vf "drawtext=text='AI CLIPPER':fontcolor=black:fontsize=20:x=(w-text_w)/2:y=(h-text_h)/2" -frames:v 1 -pix_fmt yuv420p watermarks/sample_watermark.png -y

if exist "watermarks/sample_watermark.png" (
    echo Sample watermark created successfully!
    echo You can now add your own watermark images to the watermarks folder.
    echo Supported formats: PNG, JPEG, GIF, WebP
) else (
    echo Failed to create sample watermark. Make sure FFmpeg is installed.
)

echo.
echo Watermark setup complete!
echo Place your watermark images in the watermarks folder.
pause 