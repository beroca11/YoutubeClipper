# 🚀 YouTube Clipper AI Setup Guide

## OpenAI API Configuration

### Step 1: Get Your OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in your dashboard
4. Click "Create new secret key"
5. Copy your API key (it starts with `sk-`)

### Step 2: Create Environment File
1. Copy the sample environment file:
   ```bash
   copy env.sample .env
   ```

2. Open the `.env` file and replace `your_openai_api_key_here` with your actual API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### Step 3: Verify Configuration
- Make sure the `.env` file is in the root directory of the project
- Never commit the `.env` file to version control (it's already in `.gitignore`)
- The API key should start with `sk-`

## 🎯 AI Agent Features

### Viral Analysis
- **Virality Score**: AI calculates how likely your video is to go viral (0-100%)
- **Viral Factors**: Identifies key elements that make content shareable
- **Target Audience**: Determines the best demographic for your content
- **Best Posting Time**: Recommends optimal posting schedules
- **Hashtags**: Suggests trending and relevant hashtags
- **AI-Generated Titles**: Creates catchy, clickable titles
- **Engagement Prediction**: Estimates expected engagement rates

### Content Explanation
- **Summary**: Concise overview of video content
- **Key Points**: Main takeaways and insights
- **Emotional Tone**: Analysis of content mood and sentiment
- **Trending Topics**: Identifies current trends in the content
- **Call to Action**: Suggests effective engagement prompts

### Social Media Optimization
- **Platform-Specific**: Optimized for TikTok, Instagram, YouTube Shorts, Twitter
- **Optimal Length**: Recommended video duration for each platform
- **Hooks**: Attention-grabbing opening lines
- **Descriptions**: Platform-specific descriptions
- **Posting Times**: Best times to post for maximum engagement

## 📱 Vertical Video Format

The AI agent automatically optimizes for:
- **Resolution**: 1080 x 1920 pixels
- **Aspect Ratio**: 9:16 (vertical)
- **Orientation**: Portrait (not landscape)
- **Platform**: Optimized for mobile-first social media

## 🔧 Usage Instructions

1. **Start the Application**:
   ```bash
   npm run dev
   ```

2. **Enter YouTube URL**: Paste any YouTube video URL

3. **Analyze Video**: Click "Analyze" to get video metadata

4. **Use AI Features**:
   - Click "Analyze Virality" for viral potential analysis
   - Click "Generate Explanation" for content breakdown
   - Click platform buttons for social media optimization

5. **Create Vertical Clips**: 
   - Set start/end times
   - Apply video effects
   - Generate vertical (9:16) format clips

## 💡 Tips for Best Results

### For Viral Analysis:
- Use videos with clear, engaging content
- Include trending topics when possible
- Focus on emotional appeal and shareability

### For Content Explanation:
- Videos with educational or informative content work best
- Clear audio and visuals improve analysis accuracy
- Longer videos provide more content for analysis

### For Social Media Optimization:
- Different platforms have different optimal lengths
- Use platform-specific hashtags and trends
- Consider posting times for your target audience

## 🛠️ Troubleshooting

### API Key Issues:
- Ensure your API key is valid and has sufficient credits
- Check that the `.env` file is in the correct location
- Verify the API key format (starts with `sk-`)

### Analysis Failures:
- Check your internet connection
- Ensure the YouTube video is publicly accessible
- Try with shorter video clips for faster processing

### Video Processing:
- Ensure FFmpeg is installed on your system
- Check available disk space for video processing
- Longer videos take more time to process

## 🔒 Security Notes

- **Never share your API key** publicly
- **Don't commit** the `.env` file to version control
- **Monitor your API usage** to avoid unexpected charges
- **Use environment variables** for production deployments

## 📊 Cost Considerations

- OpenAI API charges per token used
- Video analysis typically costs $0.01-$0.05 per analysis
- Monitor usage in your OpenAI dashboard
- Consider setting usage limits for production use

---

**Ready to create viral content? Start analyzing your videos with AI! 🎬✨** 