import { Youtube, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Youtube className="text-youtube-red text-2xl h-8 w-8" />
          <h1 className="text-xl font-semibold youtube-dark">AI Video Clipper</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="youtube-gray hover:youtube-dark transition-colors">How it works</a>
          <a href="#" className="youtube-gray hover:youtube-dark transition-colors">Pricing</a>
          <Button className="bg-youtube-red text-white hover:bg-red-600 rounded-full">
            Sign In
          </Button>
        </nav>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="youtube-gray" />
        </Button>
      </div>
    </header>
  );
}
