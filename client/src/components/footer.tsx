import { Youtube } from "lucide-react";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-youtube-light border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Youtube className="text-youtube-red text-xl h-6 w-6" />
              <span className="font-semibold youtube-dark">AI Video Clipper</span>
            </div>
            <p className="youtube-gray text-sm">
              The easiest way to create perfect video clips from YouTube content using AI technology.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold youtube-dark mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="youtube-gray hover:youtube-dark">Features</a></li>
              <li><a href="#" className="youtube-gray hover:youtube-dark">Pricing</a></li>
              <li><a href="#" className="youtube-gray hover:youtube-dark">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold youtube-dark mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="youtube-gray hover:youtube-dark">Help Center</a></li>
              <li><a href="#" className="youtube-gray hover:youtube-dark">Contact Us</a></li>
              <li><a href="#" className="youtube-gray hover:youtube-dark">Status</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold youtube-dark mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="youtube-gray hover:youtube-dark">Privacy Policy</a></li>
              <li><a href="#" className="youtube-gray hover:youtube-dark">Terms of Service</a></li>
              <li><a href="#" className="youtube-gray hover:youtube-dark">DMCA</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="youtube-gray text-sm">© 2024 AI Video Clipper. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="youtube-gray hover:youtube-dark">
              <FaTwitter />
            </a>
            <a href="#" className="youtube-gray hover:youtube-dark">
              <FaFacebook />
            </a>
            <a href="#" className="youtube-gray hover:youtube-dark">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
