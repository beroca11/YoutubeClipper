import { useEffect, useState } from "react";
import { Cog, Check, Loader2, Circle, Mic } from "lucide-react";

interface ProcessingStatusProps {
  progress: number;
  step: 'processing' | 'voiceover';
  voiceoverRequested: boolean;
}

export default function ProcessingStatus({ progress, step, voiceoverRequested }: ProcessingStatusProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const getSteps = () => {
    if (step === 'processing') {
      return [
        { label: "Video analysis complete", completed: progress > 20 },
        { label: "Cutting video segment...", completed: progress > 60, inProgress: progress > 20 && progress <= 80 },
        { label: "Optimizing output", completed: progress > 80, inProgress: progress > 60 && progress <= 100 },
      ];
    } else {
      // Voiceover step
      return [
        { label: "Video processing complete", completed: true },
        { label: "Generating AI narration...", completed: progress > 85, inProgress: progress > 80 && progress <= 95 },
        { label: "Merging audio with video", completed: progress > 95, inProgress: progress > 85 && progress <= 100 },
        { label: "Finalizing with voiceover", completed: progress === 100, inProgress: progress > 95 && progress < 100 },
      ];
    }
  };

  const steps = getSteps();

  return (
    <section className="mb-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-4">
            {step === 'voiceover' ? (
              <Mic className="text-youtube-red text-3xl h-12 w-12 animate-pulse" />
            ) : (
              <Cog className="text-youtube-red text-3xl h-12 w-12 animate-spin" />
            )}
          </div>
          <h3 className="text-xl font-semibold youtube-dark mb-2">
            {step === 'voiceover' ? 'Adding AI Voice Over' : 'Processing Your Clip'}
          </h3>
          <p className="youtube-gray">
            {step === 'voiceover' 
              ? 'AI is generating narration and merging it with your video...'
              : 'AI is analyzing and cutting your video clip...'
            }
          </p>
        </div>
        
        <div className="max-w-md mx-auto mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(animatedProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-youtube-red h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center justify-center space-x-2">
              {step.completed ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : step.inProgress ? (
                <Loader2 className="h-4 w-4 text-youtube-blue animate-spin" />
              ) : (
                <Circle className="h-4 w-4 text-gray-300" />
              )}
              <span className={step.completed ? "text-green-600" : step.inProgress ? "text-youtube-blue" : "opacity-50"}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
