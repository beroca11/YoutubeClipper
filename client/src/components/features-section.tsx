import { Bot, Zap, Video } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Analysis",
      description: "Our AI automatically identifies the best moments in your videos for clipping",
      color: "text-youtube-blue bg-blue-100"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process and download your clips in seconds, not minutes",
      color: "text-youtube-red bg-red-100"
    },
    {
      icon: Video,
      title: "High Quality Output",
      description: "Maintain original video quality in multiple formats and resolutions",
      color: "text-green-600 bg-green-100"
    }
  ];

  return (
    <section className="mb-12">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold youtube-dark mb-4">Why Choose AI Video Clipper?</h2>
        <p className="youtube-gray max-w-2xl mx-auto">
          Transform your YouTube videos into perfect clips with the power of artificial intelligence
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-6">
            <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <feature.icon className={`${feature.color.split(' ')[0]} text-2xl h-8 w-8`} />
            </div>
            <h3 className="font-semibold text-lg youtube-dark mb-3">{feature.title}</h3>
            <p className="youtube-gray">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
