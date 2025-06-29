import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test the download endpoint
async function testDownload() {
  try {
    // First, let's check what clips exist in the uploads/clips directory
    const clipsDir = path.join(process.cwd(), 'uploads', 'clips');
    console.log('Checking clips directory:', clipsDir);
    
    if (fs.existsSync(clipsDir)) {
      const files = fs.readdirSync(clipsDir);
      console.log('Files in clips directory:', files);
      
      if (files.length > 0) {
        // Take the first MP4 file
        const mp4File = files.find(file => file.endsWith('.mp4') && !file.includes('voiceover'));
        if (mp4File) {
          console.log('Testing with file:', mp4File);
          
          // Test the download endpoint
          const response = await fetch(`http://localhost:5000/api/clips/1/download`);
          console.log('Download response status:', response.status);
          console.log('Download response headers:', Object.fromEntries(response.headers.entries()));
          
          if (response.ok) {
            console.log('✅ Download endpoint is working!');
          } else {
            const errorText = await response.text();
            console.log('❌ Download failed:', errorText);
          }
        } else {
          console.log('No MP4 files found for testing');
        }
      } else {
        console.log('No files found in clips directory');
      }
    } else {
      console.log('Clips directory does not exist');
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testDownload(); 