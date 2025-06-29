import axios from 'axios';

async function testVoiceover() {
  try {
    console.log('Testing voiceover functionality...');
    
    // Test 1: Create a clip with voiceover
    console.log('\n1. Creating clip with voiceover...');
    const clipResponse = await axios.post('http://localhost:5000/api/clips', {
      videoId: 1,
      title: 'Test Voiceover Clip',
      startTime: 0,
      endTime: 10,
      duration: 10,
      quality: '720p',
      format: 'mp4',
      aiVoiceOver: true,
      narrationScript: 'This is a test narration for the voiceover feature.',
      isAiGenerated: false
    });
    
    console.log('Clip created:', clipResponse.data);
    const clipId = clipResponse.data.id;
    
    // Test 2: Wait a bit for processing
    console.log('\n2. Waiting for clip processing...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test 3: Check clip status
    console.log('\n3. Checking clip status...');
    const statusResponse = await axios.get(`http://localhost:5000/api/clips/${clipId}`);
    console.log('Clip status:', statusResponse.data);
    
    // Test 4: If clip is completed, try voiceover generation
    if (statusResponse.data.processingStatus === 'completed') {
      console.log('\n4. Testing voiceover generation...');
      const voiceoverResponse = await axios.post('http://localhost:5000/api/clips/voiceover', {
        clipId: clipId
      });
      console.log('Voiceover response:', voiceoverResponse.data);
    } else {
      console.log('\n4. Clip not ready yet, skipping voiceover test');
    }
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testVoiceover(); 