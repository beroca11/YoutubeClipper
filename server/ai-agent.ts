import OpenAI from 'openai';
import type { Video } from '@shared/schema';

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

  async generateNarrationForClip(clip: any, video: any): Promise<string> {
    try {
      if (!openai) {
        console.log('OpenAI not available, using fallback narration');
        return `This is a highlight from the video: ${video.title}.`;
      }
      const prompt = `You are a professional video storyteller. Write a concise, engaging, and natural-sounding narration script (in first person, if appropriate) for a video clip based on the following details. The narration should tell the story of what happens in the clip, highlight key moments, and be suitable for voice over. Avoid a robotic tone.\n\nVIDEO TITLE: ${video.title}\nVIDEO DESCRIPTION: ${video.description || 'No description available'}\nCLIP START: ${clip.startTime}s\nCLIP END: ${clip.endTime}s\nCLIP DURATION: ${clip.endTime - clip.startTime}s\nIf you have any context about what happens in this segment, use it. Otherwise, summarize what the viewer might see or learn in this part of the video.\n\nNARRATION:`;
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a professional video narrator and scriptwriter. Write in a natural, engaging, and story-driven style." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 400
      });
      const narration = completion.choices[0]?.message?.content?.trim() || '';
      return narration;
    } catch (error) {
      console.error('Error generating narration for clip:', error);
      return `This is a highlight from the video: ${video.title}.`;
    }
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
} 