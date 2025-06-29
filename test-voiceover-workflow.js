import axios from 'axios';

async function testCompleteVoiceoverWorkflow() {
  try {
    console.log('🧪 Testing Complete Voiceover Workflow...\n');
    
    // Step 1: Create a video entry first
    console.log('1️⃣ Creating video entry...');
    const videoResponse = await axios.post('http://localhost:5000/api/videos', {
      youtubeId: 'test123',
      title: 'Test Video for Voiceover',
      duration: 120,
      description: 'A test video for voiceover functionality'
    });
    console.log('✅ Video created:', videoResponse.data.id);
    
    // Step 2: Create a clip with voiceover enabled
    console.log('\n2️⃣ Creating clip with voiceover...');
    const clipResponse = await axios.post('http://localhost:5000/api/clips', {
      videoId: videoResponse.data.id,
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
    
    console.log('✅ Clip created:', clipResponse.data.id);
    const clipId = clipResponse.data.id;
    
    // Step 3: Wait for clip processing
    console.log('\n3️⃣ Waiting for clip processing...');
    let clipStatus = 'pending';
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max wait
    
    while (clipStatus !== 'completed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const statusResponse = await axios.get(`http://localhost:5000/api/clips/${clipId}`);
      clipStatus = statusResponse.data.processingStatus;
      console.log(`   Status: ${clipStatus} (attempt ${attempts + 1}/${maxAttempts})`);
      attempts++;
    }
    
    if (clipStatus !== 'completed') {
      throw new Error('Clip processing timed out');
    }
    
    console.log('✅ Clip processing completed');
    
    // Step 4: Check if voiceover was automatically generated
    console.log('\n4️⃣ Checking voiceover status...');
    const finalClipResponse = await axios.get(`http://localhost:5000/api/clips/${clipId}`);
    const finalClip = finalClipResponse.data;
    
    console.log('📊 Final clip data:', {
      voiceoverAdded: finalClip.voiceoverAdded,
      voiceoverProcessing: finalClip.voiceoverProcessing,
      aiVoiceOver: finalClip.aiVoiceOver,
      hasNarrationScript: !!finalClip.narrationScript
    });
    
    if (finalClip.voiceoverAdded) {
      console.log('✅ Voiceover was successfully generated!');
      
      // Step 5: Test downloading the voiceover version
      console.log('\n5️⃣ Testing voiceover download...');
      try {
        const downloadResponse = await axios.get(`http://localhost:5000/api/clips/${clipId}/download?voiceover=1`, {
          responseType: 'stream'
        });
        console.log('✅ Voiceover download successful:', downloadResponse.status);
      } catch (downloadError) {
        console.log('⚠️ Voiceover download failed (this might be expected if file doesn\'t exist):', downloadError.response?.status);
      }
    } else {
      console.log('❌ Voiceover was not generated automatically');
      
      // Step 6: Manually trigger voiceover generation
      console.log('\n6️⃣ Manually triggering voiceover generation...');
      try {
        const voiceoverResponse = await axios.post('http://localhost:5000/api/clips/voiceover', {
          clipId: clipId
        });
        console.log('✅ Manual voiceover generation successful:', voiceoverResponse.data.success);
      } catch (voiceoverError) {
        console.log('❌ Manual voiceover generation failed:', voiceoverError.response?.data?.message);
      }
    }
    
    console.log('\n🎉 Voiceover workflow test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testCompleteVoiceoverWorkflow(); 