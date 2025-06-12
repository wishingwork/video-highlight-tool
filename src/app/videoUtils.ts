import { GoogleGenerativeAI } from '@google/generative-ai';

export type TranscriptItem = {
  timestamp: string;
  seconds: number;
  text: string;
};

export const transcribeVideo = async (url: string): Promise<{ transcription: TranscriptItem[]; raw: string }> => {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  // Download video file for processing
  const videoResponse = await fetch(url);
  const videoBuffer = await videoResponse.arrayBuffer();
  // Convert to base64 for Gemini
  const videoBase64 = Buffer.from(videoBuffer).toString('base64');

  const prompt = `
  Please transcribe this video and provide timestamps for each segment.
  Format the response as a JSON array with objects containing:
  - timestamp: in "mm:ss" format
  - seconds: timestamp in seconds (number)
  - text: the transcribed text
  
  Example format:
  [
      {"timestamp": "00:15", "seconds": 15, "text": "Welcome to our presentation"},           
      {"timestamp": "01:23", "seconds": 83, "text": "Let me show you the features"}
  ]
  `;

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: 'video/mp4',
        data: videoBase64
      }
    },
    prompt
  ]);
  const response = await result.response;
  const transcriptionText = response.text(); 
  let transcription;
  try {
    // Extract JSON array from highlightsText (which may contain extra text and code block markers)
    const jsonMatch = transcriptionText.match(/```json\s*([\s\S]*?)\s*```/i) || transcriptionText.match(/\[\s*{[\s\S]*}\s*\]/);
    if (jsonMatch) {
      const jsonString = jsonMatch[1] ? jsonMatch[1] : jsonMatch[0];
      transcription = JSON.parse(jsonString);
    } else {
      // If JSON parsing fails, create a simple transcription
      transcription = [{
        timestamp: "00:00",
        seconds: 0,
        text: transcriptionText
      }];
    }
    if (!Array.isArray(transcription)) {
      throw new Error('Response is not an array');
    }    
  } catch (parseError) {
    console.error('Failed to parse highlights:', parseError);
    // Fallback: create highlights from transcription
  }
  return { 
    transcription: transcription,
    raw: transcriptionText 
  };
};
