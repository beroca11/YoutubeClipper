import OpenAI from 'openai';
import type { Video } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI client with better error handling
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } else {
    console.warn('OpenAI API key not found. AI features will use fallback responses.');
  }
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
  console.warn('AI features will use fallback responses.');
}

export interface ViralAnalysis {
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

export interface ContentExplanation {
  summary: string;
  keyPoints: string[];
  emotionalTone: string;
  trendingTopics: string[];
  callToAction: string;
}

export interface SocialMediaOptimization {
  platform: string;
  optimalLength: number;
  hook: string;
  description: string;
  hashtags: string[];
  postingTime: string;
}

export interface VideoAnalysis {
  sceneDescription: string;
  visualElements: string[];
  audioElements: string[];
  actionSequence: string[];
  emotionalTone: string;
  keyMoments: string[];
  characters: string[];
  setting: string;
  mood: string;
  pacing: string;
}

export class AIAgent {
  private static instance: AIAgent;
  
  private constructor() {}
  
  static getInstance(): AIAgent {
    if (!AIAgent.instance) {
      AIAgent.instance = new AIAgent();
    }
    return AIAgent.instance;
  }

  async analyzeVideoForVirality(videoData: Video): Promise<ViralAnalysis> {
    try {
      // Check if OpenAI is available
      if (!openai) {
        console.log('OpenAI not available, using fallback viral analysis');
        return this.getDefaultViralAnalysis(videoData);
      }

      const prompt = `
        You are an expert social media analyst specializing in viral content creation. Analyze this YouTube video for maximum social media virality potential.

        VIDEO DETAILS:
        - Title: ${videoData.title}
        - Description: ${videoData.description || 'No description available'}
        - Duration: ${videoData.duration} seconds
        - Channel: ${videoData.channelName || 'Unknown'}
        - Views: ${videoData.viewCount || 'Unknown'}

        Provide a concise, highly readable, and well-structured viral analysis of about 500 words with the following format:

        1. Start with a brief summary in 2–3 paragraphs, using clear section headings for each part of the analysis (e.g., Virality Score, Viral Factors, Target Audience, etc.).
        2. After the summary, include a section titled 'Key Highlights' with 5–8 bulleted points (use dashes or hyphens for bullets, not asterisks or symbols).
        3. Each bullet should be a single, impactful insight or actionable recommendation.
        4. Do NOT use asterisks, hashtags, or markdown. Use only clean, professional formatting.
        5. Write in a friendly, expert, and encouraging tone.

        IMPORTANT: The output should be about 500 words, easy to read, and visually scannable. Section headings should be clear and the 'Key Highlights' section should be easy to find and read.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a world-class social media expert with deep knowledge of viral content creation, platform algorithms, and user psychology. You understand what makes content go viral across TikTok, Instagram Reels, YouTube Shorts, and other social platforms. Provide detailed, actionable insights that creators can immediately implement. Never use asterisks, hashtags, or markdown. Use professional, clean formatting. Write in paragraphs, not lists. Use clear section headings and a 'Key Highlights' section as instructed."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1200
      });

      const response = completion.choices[0]?.message?.content || '';
      // Clean the response by removing asterisks and hashtags
      const cleanResponse = response.replace(/[*#]/g, '').replace(/\s+/g, ' ').trim();
      // Return the full clean response as the description
      return {
        viralityScore: Math.random() * 0.4 + 0.6,
        viralFactors: [
          'Emotional appeal',
          'Trending topic',
          'Shareable content',
          'Visual impact'
        ],
        targetAudience: ['Gen Z', 'Millennials'],
        bestPostingTime: '6-9 PM EST',
        hashtags: ['viral', 'trending', 'fyp', 'shorts'],
        description: cleanResponse,
        title: `${videoData.title} - Must Watch`,
        thumbnailSuggestion: 'High contrast, bold text, emotional expression',
        engagementPrediction: Math.random() * 40 + 60
      };
      
    } catch (error) {
      console.error('Error analyzing video for virality:', error);
      return this.getDefaultViralAnalysis(videoData);
    }
  }

  async generateContentExplanation(videoData: Video): Promise<ContentExplanation> {
    try {
      // Check if OpenAI is available
      if (!openai) {
        console.log('OpenAI not available, using fallback content explanation');
        return this.getDefaultContentExplanation(videoData);
      }

      const prompt = `
        You are an expert content analyst and social media strategist. Create a comprehensive content explanation for this video that will help creators understand and optimize their content for maximum engagement.

        VIDEO DETAILS:
        - Title: ${videoData.title}
        - Description: ${videoData.description || 'No description available'}
        - Duration: ${videoData.duration} seconds

        Provide a detailed content breakdown including:

        1. CONTENT SUMMARY (3-4 sentences):
           - Main topic and purpose
           - Key message or takeaway
           - Target audience appeal
           - Unique value proposition

        2. KEY POINTS (5-7 bullet points):
           - Main insights or lessons
           - Important facts or statistics
           - Actionable takeaways
           - Memorable moments or quotes
           - Controversial or debate-worthy points

        3. EMOTIONAL ANALYSIS:
           - Primary emotional tone (excitement, humor, inspiration, etc.)
           - Emotional journey throughout the video
           - Emotional triggers and responses
           - Mood and atmosphere

        4. TRENDING TOPICS & CONTEXT:
           - Current trends mentioned or related
           - Cultural references
           - Industry-specific topics
           - Seasonal or timely content
           - Controversial subjects

        5. AUDIENCE ENGAGEMENT STRATEGY:
           - Hook elements that grab attention
           - Retention factors that keep viewers watching
           - Shareable moments or quotes
           - Call-to-action opportunities
           - Community building potential

        6. CONTENT OPTIMIZATION SUGGESTIONS:
           - How to make it more engaging
           - Ways to increase shareability
           - Platform-specific adaptations
           - Follow-up content ideas
           - Collaboration opportunities

        IMPORTANT:
        - Do not use asterisks (*) or hashtags (#) in any generated content
        - Use professional, clean formatting
        - Make this analysis engaging, actionable, and optimized for social media creators who want to maximize their content's impact
        - Provide specific, actionable recommendations
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a content strategy expert who excels at breaking down complex topics into engaging, shareable insights. You understand how to make content more viral, relatable, and impactful across all social media platforms. Never use asterisks or hashtags in your responses. Use professional, clean formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content || '';
      
      return this.parseContentExplanation(response);
      
    } catch (error) {
      console.error('Error generating content explanation:', error);
      return this.getDefaultContentExplanation(videoData);
    }
  }

  async optimizeForSocialMedia(videoData: Video, platform: string): Promise<SocialMediaOptimization> {
    try {
      // Check if OpenAI is available
      if (!openai) {
        console.log('OpenAI not available, using fallback social media optimization');
        return this.getDefaultSocialMediaOptimization(platform);
      }

      const prompt = `
        You are a ${platform} expert and social media strategist. Create a comprehensive optimization strategy for this video content specifically for ${platform}.

        VIDEO DETAILS:
        - Title: ${videoData.title}
        - Description: ${videoData.description || 'No description available'}
        - Duration: ${videoData.duration} seconds

        Provide detailed ${platform} optimization including:

        1. PLATFORM-SPECIFIC OPTIMIZATION:
           - Optimal video length for ${platform} algorithm
           - Aspect ratio and format requirements
           - Audio and visual specifications
           - Caption and subtitle recommendations
           - Thumbnail optimization

        2. CONTENT STRATEGY:
           - Hook variations for first 3 seconds
           - Retention strategies for middle section
           - Call-to-action placement and wording
           - Ending optimization for algorithm
           - Cross-promotion opportunities

        3. KEYWORD STRATEGY:
           - Trending keywords on ${platform}
           - Niche-specific keywords
           - Branded keyword suggestions
           - Keyword combinations for maximum reach
           - Keyword placement optimization

        4. POSTING STRATEGY:
           - Best posting times for ${platform}
           - Day of week optimization
           - Frequency recommendations
           - Content calendar suggestions
           - A/B testing opportunities

        5. ENGAGEMENT OPTIMIZATION:
           - Comment response strategies
           - User interaction tactics
           - Community building techniques
           - Influencer collaboration ideas
           - User-generated content opportunities

        6. ALGORITHM OPTIMIZATION:
           - ${platform} algorithm preferences
           - Watch time optimization
           - Engagement rate improvement
           - Follower growth strategies
           - Viral potential maximization

        7. CREATIVE ELEMENTS:
           - Visual effects recommendations
           - Music and sound effects
           - Text overlay suggestions
           - Transition effects
           - Color scheme optimization

        IMPORTANT:
        - Do not use asterisks (*) or hashtags (#) in any generated content
        - Use professional, clean formatting
        - Focus on creating content that's perfectly optimized for ${platform}'s unique algorithm, user behavior, and content format requirements
        - Provide specific, actionable recommendations that creators can implement immediately
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a ${platform} expert with deep knowledge of the platform's algorithm, user behavior, and content optimization strategies. You understand what makes content perform well on ${platform} and how to maximize engagement and reach. Never use asterisks or hashtags in your responses. Use professional, clean formatting.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1800
      });

      const response = completion.choices[0]?.message?.content || '';
      
      return this.parseSocialMediaOptimization(response, platform);
      
    } catch (error) {
      console.error(`Error optimizing for ${platform}:`, error);
      return this.getDefaultSocialMediaOptimization(platform);
    }
  }

  async analyzeVideoContent(clip: any, video: any): Promise<VideoAnalysis> {
    try {
      if (!openai) {
        console.log('OpenAI not available, using fallback video analysis');
        return this.getDefaultVideoAnalysis(clip, video);
      }

      // Get the clip file path
      const clipFilePath = path.join(process.cwd(), 'uploads', 'clips', clip.fileName);
      
      // Check if the clip file exists
      if (!fs.existsSync(clipFilePath)) {
        console.log('Clip file not found, using fallback analysis');
        return this.getDefaultVideoAnalysis(clip, video);
      }

      // Extract key frames for analysis
      const frameAnalysis = await this.extractAndAnalyzeFrames(clipFilePath, clip);

      const prompt = `
        You are an expert video content analyst specializing in real-time scene analysis. Analyze this video clip segment and provide detailed insights about what's happening visually and audibly.

        VIDEO CONTEXT:
        - Title: ${video.title}
        - Description: ${video.description || 'No description available'}
        - Clip Start: ${clip.startTime}s
        - Clip End: ${clip.endTime}s
        - Clip Duration: ${clip.endTime - clip.startTime}s
        - Clip File: ${clip.fileName}

        ${frameAnalysis ? `FRAME ANALYSIS: ${frameAnalysis}` : ''}

        Based on the video title, description, timing, and frame analysis, provide a detailed scene-specific analysis. Consider:

        1. SCENE DESCRIPTION: What is the main action or event happening in this clip?
        2. VISUAL ELEMENTS: What visual elements, effects, or cinematography techniques are present?
        3. AUDIO ELEMENTS: What sounds, music, or audio effects might be present?
        4. ACTION SEQUENCE: What specific actions or movements occur in this segment?
        5. EMOTIONAL TONE: What is the emotional atmosphere and mood?
        6. KEY MOMENTS: What are the most important or memorable moments in this clip?
        7. CHARACTERS: Who are the main characters or subjects in this scene?
        8. SETTING: What is the location or environment?
        9. MOOD: What is the overall feeling or atmosphere?
        10. PACING: How fast or slow is the action moving?

        Provide a detailed, scene-specific analysis that captures the essence of what happens in this exact time segment. Be specific about the visual and audio elements that would make this clip engaging and memorable.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert video content analyst with deep knowledge of cinematography, visual storytelling, and audio-visual media. You can analyze video content and provide detailed insights about scenes, actions, emotions, and technical elements. Be specific and descriptive in your analysis."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      const response = completion.choices[0]?.message?.content || '';
      return this.parseVideoAnalysis(response, clip, video);
      
    } catch (error) {
      console.error('Error analyzing video content:', error);
      return this.getDefaultVideoAnalysis(clip, video);
    }
  }

  private async extractAndAnalyzeFrames(videoPath: string, clip: any): Promise<string | null> {
    try {
      // This is a placeholder for frame extraction and analysis
      // In a full implementation, you would:
      // 1. Use FFmpeg to extract key frames from the video
      // 2. Use computer vision APIs (like Google Vision, Azure Computer Vision, or OpenAI's Vision) to analyze the frames
      // 3. Return structured analysis of what's visible in the frames
      
      const clipDuration = clip.endTime - clip.startTime;
      const frameCount = Math.min(3, Math.floor(clipDuration / 10)); // Extract up to 3 frames, one every 10 seconds
      
      if (frameCount === 0) {
        return null;
      }

      // For now, return a contextual analysis based on the video title and timing
      return `Based on the video content analysis, this clip appears to contain dynamic action sequences with professional cinematography. The scene likely features engaging visual elements and compelling action.`;
      
    } catch (error) {
      console.error('Error extracting and analyzing frames:', error);
      return null;
    }
  }

  async generateNarrationForClip(clip: any, video: any): Promise<string> {
    try {
      if (!openai) {
        console.log('OpenAI not available, using fallback narration');
        return this.generateFallbackNarration(video.title, clip);
      }

      // Check if this is a demo video (no actual video content available)
      const isDemoVideo = !video.actualContent || video.isDemo;
      
      if (isDemoVideo) {
        // Generate narration based on video title and metadata
        return await this.generateTitleBasedNarration(video, clip);
      }

      // For actual videos, try to analyze content
      try {
        const videoAnalysis = await this.analyzeVideoContent(clip, video);
        return await this.generateContentBasedNarration(videoAnalysis, video, clip);
      } catch (analysisError) {
        console.log('Video analysis failed, falling back to title-based narration');
        return await this.generateTitleBasedNarration(video, clip);
      }
      
    } catch (error) {
      console.error('Error generating narration for clip:', error);
      return this.generateFallbackNarration(video.title, clip);
    }
  }

  private async generateTitleBasedNarration(video: any, clip: any): Promise<string> {
    try {
      if (!openai) {
        return this.generateFallbackNarration(video.title, clip);
      }

      // Generate video summary for better context
      const videoSummary = await this.generateVideoSummary(video);

      const prompt = `
        You are a professional video narrator and content creator. Create a compelling, engaging narration script for a video clip based on the video's title, metadata, and summary.

        VIDEO INFORMATION:
        - Title: "${video.title}"
        - Description: "${video.description || 'No description available'}"
        - Channel: "${video.channelName || 'Unknown'}"
        - Duration: ${video.duration || 'Unknown'} seconds
        - Clip Duration: ${clip.endTime - clip.startTime} seconds
        - Clip Start: ${clip.startTime}s
        - Clip End: ${clip.endTime}s

        VIDEO SUMMARY:
        ${videoSummary}

        TASK: Create a narration script that:
        1. Summarizes the key content and insights from this video
        2. Explains what viewers can expect to learn or see
        3. Highlights the most important points or takeaways
        4. Uses engaging, conversational language
        5. Maintains viewer interest throughout the clip
        6. Provides context for the video's value and purpose
        7. Feels like a professional documentary or educational narrator

        REQUIREMENTS:
        - Write approximately ${Math.max(30, Math.floor((clip.endTime - clip.startTime) * 2))} words
        - Focus on the educational or entertainment value
        - Use vivid, descriptive language
        - Make it feel natural and conversational
        - Include specific insights about the topic
        - End with a compelling takeaway or call to action
        - Reference the video summary for accurate content description

        NARRATION SCRIPT:
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are a professional video narrator and content creator. Write engaging, educational narration that summarizes video content and provides valuable insights. Use vivid, descriptive language that captures the viewer's attention and explains complex topics in an accessible way." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 400
      });
      
      const narration = completion.choices[0]?.message?.content?.trim() || '';
      return narration || this.generateFallbackNarration(video.title, clip);
      
    } catch (error) {
      console.error('Error generating title-based narration:', error);
      return this.generateFallbackNarration(video.title, clip);
    }
  }

  private async generateContentBasedNarration(videoAnalysis: VideoAnalysis, video: any, clip: any): Promise<string> {
    try {
      if (!openai) {
        return this.generateFallbackNarration(video.title, clip);
      }

      const prompt = `
        You are a professional video narrator and storyteller. Create a compelling, real-time narration script for this specific video clip segment that describes what's happening as it unfolds.

        VIDEO ANALYSIS:
        - Scene: ${videoAnalysis.sceneDescription}
        - Visual Elements: ${videoAnalysis.visualElements.join(', ')}
        - Action Sequence: ${videoAnalysis.actionSequence.join(', ')}
        - Emotional Tone: ${videoAnalysis.emotionalTone}
        - Key Moments: ${videoAnalysis.keyMoments.join(', ')}
        - Characters: ${videoAnalysis.characters.join(', ')}
        - Setting: ${videoAnalysis.setting}
        - Mood: ${videoAnalysis.mood}
        - Pacing: ${videoAnalysis.pacing}

        CLIP DETAILS:
        - Title: ${video.title}
        - Duration: ${clip.endTime - clip.startTime}s
        - Start Time: ${clip.startTime}s
        - End Time: ${clip.endTime}s

        Create a narration script that:
        1. Describes the action as it happens in real-time
        2. Captures the emotional intensity and atmosphere
        3. Highlights key visual and audio elements
        4. Maintains engaging pacing that matches the scene
        5. Uses vivid, descriptive language
        6. Feels natural and conversational, not robotic
        7. Builds tension and excitement where appropriate
        8. Provides context for what the viewer is seeing

        The narration should be approximately ${Math.max(30, Math.floor((clip.endTime - clip.startTime) * 2))} words to match the clip duration. Make it feel like a professional sports commentator or documentary narrator describing the action as it unfolds.

        NARRATION SCRIPT:
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are a professional video narrator and storyteller. Write engaging, real-time narration that describes action as it happens. Use vivid, descriptive language that captures the energy and emotion of the scene. Write in a natural, conversational tone that feels like a professional commentator or documentary narrator." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      });
      
      const narration = completion.choices[0]?.message?.content?.trim() || '';
      return narration || this.generateFallbackNarration(video.title, clip);
      
    } catch (error) {
      console.error('Error generating content-based narration:', error);
      return this.generateFallbackNarration(video.title, clip);
    }
  }

  private generateFallbackNarration(videoTitle: string, clip: any): string {
    const duration = clip.endTime - clip.startTime;
    
    // Generate context-aware fallback narration based on video title
    const titleLower = videoTitle.toLowerCase();
    
    if (titleLower.includes('tutorial') || titleLower.includes('how to') || titleLower.includes('guide')) {
      return `In this tutorial segment, we explore the key techniques and methods that make this process so effective. Watch closely as the expert demonstrates step-by-step instructions, providing valuable insights that you can apply to your own projects. This ${duration}-second clip captures the most important moments of the learning process.`;
    }
    
    if (titleLower.includes('review') || titleLower.includes('analysis')) {
      return `This review segment provides an in-depth analysis of the key features and performance aspects. The reviewer offers detailed insights and expert opinions, helping you understand what makes this product or service stand out. This ${duration}-second clip contains the most critical evaluation points.`;
    }
    
    if (titleLower.includes('interview') || titleLower.includes('conversation')) {
      return `In this interview segment, we hear from the expert as they share valuable insights and personal experiences. The conversation reveals important perspectives and behind-the-scenes information that adds depth to the topic. This ${duration}-second clip captures the most compelling moments of the discussion.`;
    }
    
    if (titleLower.includes('demo') || titleLower.includes('demonstration')) {
      return `This demonstration showcases the practical application of key concepts and techniques. Watch as the presenter walks through the process, highlighting important details and providing real-world examples. This ${duration}-second clip shows the most effective demonstration methods.`;
    }
    
    if (titleLower.includes('news') || titleLower.includes('update')) {
      return `This news segment covers the latest developments and important updates on this topic. The information presented here provides current context and helps you stay informed about recent changes. This ${duration}-second clip contains the most relevant news and updates.`;
    }
    
    // Default fallback for any other type of video
    return `This ${duration}-second clip from "${videoTitle}" contains valuable content and insights that are worth your attention. The segment provides important information and demonstrates key concepts that viewers will find useful and engaging.`;
  }

  private parseViralAnalysis(response: string, videoData: Video): ViralAnalysis {
    // Clean the response by removing asterisks and hashtags
    const cleanResponse = response.replace(/[*#]/g, '').replace(/\s+/g, ' ').trim();
    
    const viralityScore = Math.random() * 0.4 + 0.6; // 0.6-1.0 range
    const viralFactors = [
      'Emotional appeal',
      'Trending topic',
      'Shareable content',
      'Visual impact'
    ];
    
    return {
      viralityScore,
      viralFactors,
      targetAudience: ['Gen Z', 'Millennials'],
      bestPostingTime: '6-9 PM EST',
      hashtags: ['viral', 'trending', 'fyp', 'shorts'],
      description: cleanResponse.substring(0, 200) + '...',
      title: `${videoData.title} - Must Watch`,
      thumbnailSuggestion: 'High contrast, bold text, emotional expression',
      engagementPrediction: viralityScore * 100
    };
  }

  private parseContentExplanation(response: string): ContentExplanation {
    // Clean the response by removing asterisks and hashtags
    const cleanResponse = response.replace(/[*#]/g, '').replace(/\s+/g, ' ').trim();
    
    return {
      summary: cleanResponse.substring(0, 150) + '...',
      keyPoints: [
        'Key insight 1',
        'Key insight 2', 
        'Key insight 3'
      ],
      emotionalTone: 'Exciting and engaging',
      trendingTopics: ['Technology', 'Innovation'],
      callToAction: 'Share this with friends'
    };
  }

  private parseSocialMediaOptimization(response: string, platform: string): SocialMediaOptimization {
    // Clean the response by removing asterisks and hashtags
    const cleanResponse = response.replace(/[*#]/g, '').replace(/\s+/g, ' ').trim();
    
    return {
      platform,
      optimalLength: platform === 'TikTok' ? 60 : 90,
      hook: 'You won\'t believe what happens next',
      description: cleanResponse.substring(0, 200) + '...',
      hashtags: [platform.toLowerCase(), 'viral', 'trending'],
      postingTime: '6-9 PM EST'
    };
  }

  private getDefaultViralAnalysis(videoData: Video): ViralAnalysis {
    return {
      viralityScore: 0.7,
      viralFactors: ['Engaging content', 'Visual appeal'],
      targetAudience: ['General audience'],
      bestPostingTime: '6-9 PM EST',
      hashtags: ['viral', 'trending'],
      description: `Check out this amazing video: ${videoData.title}`,
      title: videoData.title,
      thumbnailSuggestion: 'Use bright colors and bold text',
      engagementPrediction: 70
    };
  }

  private getDefaultContentExplanation(videoData: Video): ContentExplanation {
    return {
      summary: `This video covers ${videoData.title} in an engaging way.`,
      keyPoints: ['Point 1', 'Point 2', 'Point 3'],
      emotionalTone: 'Neutral',
      trendingTopics: ['General'],
      callToAction: 'Watch and share'
    };
  }

  private getDefaultSocialMediaOptimization(platform: string): SocialMediaOptimization {
    return {
      platform,
      optimalLength: 60,
      hook: 'Amazing content ahead',
      description: 'Check out this incredible video',
      hashtags: ['viral', 'trending'],
      postingTime: '6-9 PM EST'
    };
  }

  private parseVideoAnalysis(response: string, clip: any, video: any): VideoAnalysis {
    try {
      // Clean the response by removing asterisks and hashtags
      const cleanResponse = response.replace(/[*#]/g, '').replace(/\s+/g, ' ').trim();
      
      // Extract key information from the response using regex patterns
      const sceneMatch = cleanResponse.match(/scene[:\s]+([^.]+)/i);
      const visualMatch = cleanResponse.match(/visual[:\s]+([^.]+)/i);
      const audioMatch = cleanResponse.match(/audio[:\s]+([^.]+)/i);
      const actionMatch = cleanResponse.match(/action[:\s]+([^.]+)/i);
      const emotionMatch = cleanResponse.match(/emotional[:\s]+([^.]+)/i);
      const moodMatch = cleanResponse.match(/mood[:\s]+([^.]+)/i);
      const settingMatch = cleanResponse.match(/setting[:\s]+([^.]+)/i);
      const pacingMatch = cleanResponse.match(/pacing[:\s]+([^.]+)/i);
      
      // Extract characters and key moments from the response
      const characters = this.extractListFromText(cleanResponse, ['character', 'actor', 'person', 'hero', 'subject']);
      const keyMoments = this.extractListFromText(cleanResponse, ['moment', 'highlight', 'peak', 'climax', 'turning point']);
      const visualElements = this.extractListFromText(cleanResponse, ['visual', 'effect', 'camera', 'shot', 'lighting', 'color']);
      const audioElements = this.extractListFromText(cleanResponse, ['sound', 'music', 'audio', 'noise', 'voice']);
      const actionSequence = this.extractListFromText(cleanResponse, ['action', 'movement', 'fight', 'battle', 'sequence']);
      
      return {
        sceneDescription: sceneMatch ? sceneMatch[1].trim() : cleanResponse.substring(0, 200) + '...',
        visualElements: visualElements.length > 0 ? visualElements : (visualMatch ? [visualMatch[1].trim()] : []),
        audioElements: audioElements.length > 0 ? audioElements : (audioMatch ? [audioMatch[1].trim()] : []),
        actionSequence: actionSequence.length > 0 ? actionSequence : (actionMatch ? [actionMatch[1].trim()] : []),
        emotionalTone: emotionMatch ? emotionMatch[1].trim() : 'Intense',
        keyMoments: keyMoments.length > 0 ? keyMoments : ['Key action moment'],
        characters: characters.length > 0 ? characters : ['Main character'],
        setting: settingMatch ? settingMatch[1].trim() : 'Dynamic scene',
        mood: moodMatch ? moodMatch[1].trim() : 'Exciting',
        pacing: pacingMatch ? pacingMatch[1].trim() : 'Fast-paced'
      };
    } catch (error) {
      console.error('Error parsing video analysis:', error);
      return this.getDefaultVideoAnalysis(clip, video);
    }
  }

  private extractListFromText(text: string, keywords: string[]): string[] {
    const items: string[] = [];
    
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[s]?[:\s]+([^.]+)`, 'gi');
      const matches = text.match(regex);
      
      if (matches) {
        matches.forEach(match => {
          const item = match.replace(new RegExp(`${keyword}[s]?[:\s]+`, 'gi'), '').trim();
          if (item && !items.includes(item)) {
            items.push(item);
          }
        });
      }
    }
    
    return items.slice(0, 5); // Limit to 5 items per category
  }

  private getDefaultVideoAnalysis(clip: any, video: any): VideoAnalysis {
    return {
      sceneDescription: `A dynamic scene from ${video.title} featuring exciting action and engaging content.`,
      visualElements: ['Dynamic camera work', 'High-quality visuals', 'Professional cinematography'],
      audioElements: ['Background music', 'Sound effects', 'Clear audio'],
      actionSequence: ['Engaging action', 'Dynamic movement', 'Exciting sequences'],
      emotionalTone: 'Exciting and engaging',
      keyMoments: ['Peak action moment', 'Emotional highlight', 'Memorable scene'],
      characters: ['Main characters', 'Dynamic performers'],
      setting: 'Dynamic environment',
      mood: 'Exciting and intense',
      pacing: 'Fast-paced and engaging'
    };
  }

  async generateVideoSummary(video: any): Promise<string> {
    try {
      if (!openai) {
        console.log('OpenAI not available, using fallback video summary');
        return `This video covers ${video.title} and provides valuable insights on the topic.`;
      }

      const prompt = `
        You are an expert content analyst and video summarizer. Create a comprehensive summary of this YouTube video based on its title and metadata.

        VIDEO INFORMATION:
        - Title: "${video.title}"
        - Description: "${video.description || 'No description available'}"
        - Channel: "${video.channelName || 'Unknown'}"
        - Duration: ${video.duration || 'Unknown'} seconds

        TASK: Create a detailed video summary that includes:

        1. MAIN TOPIC & PURPOSE (2-3 sentences):
           - What is the video about?
           - What is the main goal or message?
           - Who is the target audience?

        2. KEY CONTENT POINTS (5-7 bullet points):
           - Main topics covered
           - Important insights or lessons
           - Key takeaways for viewers
           - Notable moments or highlights
           - Expert tips or advice shared

        3. VALUE PROPOSITION (2-3 sentences):
           - What value does this video provide?
           - Why should someone watch it?
           - What will viewers learn or gain?

        4. CONTENT QUALITY ASSESSMENT (2-3 sentences):
           - How well is the content presented?
           - What makes this video engaging?
           - Any unique aspects or approaches?

        Write in a clear, professional tone that would be suitable for:
        - Video descriptions
        - Content recommendations
        - Educational summaries
        - Social media sharing

        VIDEO SUMMARY:
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are an expert content analyst and video summarizer. Write comprehensive, engaging summaries that capture the essence and value of video content. Use clear, professional language that helps viewers understand what they'll gain from watching." 
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        temperature: 0.7,
        max_tokens: 600
      });
      
      const summary = completion.choices[0]?.message?.content?.trim() || '';
      return summary || this.generateFallbackVideoSummary(video);
      
    } catch (error) {
      console.error('Error generating video summary:', error);
      return this.generateFallbackVideoSummary(video);
    }
  }

  private generateFallbackVideoSummary(video: any): string {
    const titleLower = video.title.toLowerCase();
    
    if (titleLower.includes('tutorial') || titleLower.includes('how to') || titleLower.includes('guide')) {
      return `This tutorial video provides step-by-step guidance on ${video.title}. The content is designed to help viewers learn practical skills and techniques through clear demonstrations and expert explanations. Key topics covered include essential methods, best practices, and actionable tips that viewers can apply to their own projects. This video offers valuable educational content for anyone looking to improve their skills in this area.`;
    }
    
    if (titleLower.includes('review') || titleLower.includes('analysis')) {
      return `This review video offers an in-depth analysis of ${video.title}. The content provides detailed insights into features, performance, and overall value, helping viewers make informed decisions. The review covers key aspects including pros and cons, real-world testing, and expert recommendations. This comprehensive analysis serves as a valuable resource for anyone considering this product or service.`;
    }
    
    if (titleLower.includes('interview') || titleLower.includes('conversation')) {
      return `This interview video features an engaging conversation about ${video.title}. The discussion provides unique insights and personal perspectives from industry experts, offering viewers behind-the-scenes information and valuable context. The interview covers important topics, shares expert opinions, and reveals insights that add depth to understanding the subject matter.`;
    }
    
    if (titleLower.includes('demo') || titleLower.includes('demonstration')) {
      return `This demonstration video showcases the practical application of ${video.title}. The content provides hands-on examples and real-world scenarios that help viewers understand how concepts work in practice. The demo covers key features, demonstrates effective techniques, and shows practical implementation methods that viewers can learn from and apply.`;
    }
    
    if (titleLower.includes('news') || titleLower.includes('update')) {
      return `This news video covers the latest developments and updates regarding ${video.title}. The content provides current information and context about recent changes, helping viewers stay informed about important developments. The news segment offers timely insights and analysis that are relevant to anyone following this topic.`;
    }
    
    // Default fallback for any other type of video
    return `This video covers ${video.title} and provides valuable insights on the topic. The content offers educational value and practical information that viewers will find useful and engaging. The video presents important concepts and ideas in an accessible way, making it a valuable resource for learning and understanding this subject.`;
  }
} 