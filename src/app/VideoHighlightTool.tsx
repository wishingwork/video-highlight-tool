"use client"
import React, { useState, useRef } from 'react';
import { Play, Pause, SkipForward, Clock, Zap, FileVideo } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const VideoHighlightTool = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptItem[]>([]);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTranscript, setActiveTranscript] = useState(0);
//   const [transcriptionText, setTranscriptionText] = useState('');

//   const videoRef = useRef(null);
//   const fileInputRef = useRef(null);

  type TranscriptItem = {
    timestamp: string;
    seconds: number;
    text: string;
  };
  
  type HighlightItem = {
    timestamp: string;
    seconds: number;
    title: string;
    description: string;
  };
//   const mockTranscription: TranscriptItem[] = [
//     { timestamp: "00:15", seconds: 15, text: "Welcome to our comprehensive product demonstration" },
//     { timestamp: "00:32", seconds: 32, text: "Let me show you the key features that make this special" },
//     { timestamp: "01:05", seconds: 65, text: "First, we have the intuitive user interface" },
//     { timestamp: "01:23", seconds: 83, text: "The dashboard provides real-time analytics and insights" },
//     { timestamp: "01:45", seconds: 105, text: "Next, let's explore the advanced customization options" },
//     { timestamp: "02:10", seconds: 130, text: "Users can personalize their experience completely" },
//     { timestamp: "02:35", seconds: 155, text: "The integration capabilities are truly impressive" },
//     { timestamp: "03:00", seconds: 180, text: "Connect with over 100 popular business tools" },
//     { timestamp: "03:25", seconds: 205, text: "Finally, our world-class customer support" },
//     { timestamp: "03:50", seconds: 230, text: "Available 24/7 to help you succeed" }
//   ];

//   const mockHighlights: HighlightItem[] = [
//     { timestamp: "00:32", seconds: 32, title: "Feature Overview", description: "Introduction to key product features" },
//     { timestamp: "01:23", seconds: 83, title: "Dashboard Demo", description: "Real-time analytics demonstration" },
//     { timestamp: "01:45", seconds: 105, title: "Customization", description: "Advanced personalization options" },
//     { timestamp: "02:35", seconds: 155, title: "Integrations", description: "Third-party tool connections" },
//     { timestamp: "03:25", seconds: 205, title: "Support", description: "Customer service overview" }
//   ];
const transcriptObj: TranscriptItem[] = [
  {
      "timestamp": "00:08",
      "seconds": 8,
      "text": "Anti-war demonstrators protest U.S. involvement in the Vietnam War in mass marches, rallies and demonstrations."
  },
  {
      "timestamp": "00:15",
      "seconds": 15,
      "text": "Central Park is the starting point for the parade to the UN building."
  },
  {
      "timestamp": "00:18",
      "seconds": 18,
      "text": "The estimated 125,000 Manhattan marchers include students, housewives, beatnik poets, doctors, businessmen, teachers, priests and nuns."
  },
  {
      "timestamp": "00:28",
      "seconds": 28,
      "text": "Makeup and costumes were bizarre."
  },
  {
      "timestamp": "00:35",
      "seconds": 35,
      "text": "Before the parade, mass draft card burning was urged."
  },
  {
      "timestamp": "00:38",
      "seconds": 38,
      "text": "Demonstrators claimed 200 cards were burned, but no accurate count could be determined."
  },
  {
      "timestamp": "00:43",
      "seconds": 43,
      "text": "Reporters and onlookers were jostled away on purpose."
  },
  {
      "timestamp": "00:48",
      "seconds": 48,
      "text": "Although mostly peaceful, shouted confrontations were frequent and fiery during the course of the march."
  },
  {
      "timestamp": "00:56",
      "seconds": 56,
      "text": "The anti-war marchers were picketed by anti anti-war marchers who were hawkish toward the parading doves."
  },
  {
      "timestamp": "01:06",
      "seconds": 106,
      "text": "Civil rights leader Martin Luther King leads the procession to the United Nations where he urges UN pressure to force the U.S. to stop bombing North Vietnam."
  },
  {
      "timestamp": "01:19",
      "seconds": 119,
      "text": "Police arrested five persons as disorderly."
  },
  {
      "timestamp": "01:22",
      "seconds": 122,
      "text": "Three were grabbed when they rushed the parade float."
  },
  {
      "timestamp": "01:24",
      "seconds": 124,
      "text": "No serious injuries, however, in New York’s biggest anti-war march."
  },
  {
      "timestamp": "01:31",
      "seconds": 131,
      "text": "A companion peace demonstration brings out 50,000 marchers in downtown San Francisco."
  },
  {
      "timestamp": "01:36",
      "seconds": 136,
      "text": "They parade two miles along Market Street, pacifists and hippies together."
  },
  {
      "timestamp": "01:43",
      "seconds": 143,
      "text": "Gigantic Kezar Stadium holds the mass rally where anti-war songs and speeches trigger a short scuffle between pro and con factions."
  },
  {
      "timestamp": "01:50",
      "seconds": 150,
      "text": "No one was injured."
  },
  {
      "timestamp": "01:53",
      "seconds": 153,
      "text": "Both demonstrations were sponsored by a loose coalition of left-wing pacifist and moderate anti-war groups."
  },
  {
      "timestamp": "01:59",
      "seconds": 159,
      "text": "President Johnson, meanwhile, let it be known that the FBI is closely watching all anti-war activities."
  },
  {
      "timestamp": "02:08",
      "seconds": 208,
      "text": "In Rome, a peace demonstration ironically erupts into violence near the U.S. embassy along the glamorous Via Veneto."
  },
  {
      "timestamp": "02:15",
      "seconds": 215,
      "text": "Police alerted to possible trouble, stopped the marchers just short of their goal, and then the march turned into a riot."
  },
  {
      "timestamp": "02:22",
      "seconds": 222,
      "text": "Peace placards, cafe chairs and fists flew in all directions."
  },
  {
      "timestamp": "02:26",
      "seconds": 226,
      "text": "The next phase, a sit-down protest, but Rome police and firemen, too, had a solution."
  },
  {
      "timestamp": "02:32",
      "seconds": 232,
      "text": "A solution H2O applied freely and under high pressure by the Rome fire brigade."
  },
  {
      "timestamp": "02:37",
      "seconds": 237,
      "text": "The strong water jets bowled over demonstrators one after another."
  },
  {
      "timestamp": "02:41",
      "seconds": 241,
      "text": "They dried out in the pokey."
  },
  {
      "timestamp": "02:43",
      "seconds": 243,
      "text": "It took police one hour to break up the mob."
  },
  {
      "timestamp": "02:46",
      "seconds": 246,
      "text": "33 rioters were arrested."
  },
  {
      "timestamp": "02:48",
      "seconds": 248,
      "text": "Internal drama in the eternal city."
  }
];
const highlightsObj: HighlightItem[] = [
  {
      "timestamp": "00:08",
      "seconds": 8,
      "title": "Protest March",
      "description": "Anti-war demonstrators protest US involvement in Vietnam War"
  },
  {
      "timestamp": "00:35",
      "seconds": 35,
      "title": "Draft Card Burning",
      "description": "Mass draft card burning urged; 200 claimed burned, count uncertain"
  },
  {
      "timestamp": "01:07",
      "seconds": 67,
      "title": "MLK Leads March",
      "description": "Civil rights leader Martin Luther King leads protest to the United Nations"
  },
  {
      "timestamp": "01:29",
      "seconds": 89,
      "title": "San Francisco March",
      "description": "50,000 marchers in downtown San Francisco; a two-mile parade on Market Street"
  },
  {
      "timestamp": "02:08",
      "seconds": 128,
      "title": "Rome Riot",
      "description": "Peace march in Rome turns into a riot; police use water hoses to disperse crowds"
  }
];

//   const mockTranscriptionText = "swallowing. Anti-war demonstrators protest U.S. involvement in the Vietnam War in mass marches, rallies, and demonstrations. Central Park is the starting point for the parade to the U.N. building. The estimated 125,000 Manhattan marchers include students, housewives, beatnik poets, doctors, businessmen, teachers, priests, and nuns. Makeup and costumes were bizarre. Before the parade, mass draft card burning was urged. Demonstrators claimed 200 cards were burned, but no accurate count could be determined. Reporters and onlookers were jostled away on purpose. Although mostly peaceful, shouted confrontations were frequent and fiery during the course of the march. The anti-war marchers were picketed by anti-anti-war marchers, who were hawkish toward the parading doves. Civil rights leader Martin Luther King leads the procession to the United Nations, where he urges U.N. pressure to force the U.S. to stop bombing North Vietnam. Police arrested five persons as disorderly. Three were grabbed when they rushed the parade float. No serious injuries, however, in New York's biggest anti-war march. A companion peace demonstration brings out 50,000 marchers in downtown San Francisco. They parade two miles along Market Street, pacifists and hippies together. Gigantic Kezar Stadium holds the mass rally, where anti-war songs and speeches figure a short scuffle between pro and con factions. No one was injured. Both demonstrations were sponsored by a loose coalition of left-wing pacifist and moderate anti-war groups. President Johnson, meanwhile, let it be known that the FBI is closely watching all anti-war activity. In Rome, a peace demonstration ironically erupts into violence near the U.S. Embassy along the glamorous Via Veneto. Police, alerted to possible trouble, stop the marchers just short of their goal and then the march turned into a riot. Peace placards, cafe chairs, and fists flew in all directions. The next phase, a sit-down protest, but Rome police and firemen too had a solution. The solution, H20, applied freely and under high pressure by the Rome Fire Brigade. The strong water jets bowled over demonstrators one after another. They dried out in the pokey. It took police one hour to break up the mob. Thirty-three rioters were arrested. Internal drama in the Eternal City.";
//   const mockHighlightsText = 'Sure, here is a JSON array of the 5 key highlight moments of the video:\n\n```json\n[\n  {\n    "timestamp": "00:06",\n    "seconds": 6,\n    "title": "NYC March",\n    "description": "Anti-war protesters march against the Vietnam War."\n  },\n  {\n    "timestamp": "00:35",\n    "seconds": 35,\n    "title": "Draft Card Burning",\n    "description": "Protesters burn draft cards in demonstration."\n  },\n  {\n    "timestamp": "01:06",\n    "seconds": 66,\n    "title": "MLK Protest",\n    "description": "Martin Luther King leads a protest to the UN."\n  },\n  {\n    "timestamp": "01:28",\n    "seconds": 88,\n    "title": "San Francisco March",\n    "description": "Companion demonstration brings out 50,000."\n  },\n  {\n    "timestamp": "02:08",\n    "seconds": 128,\n    "title": "Rome Riot",\n    "description": "Peace demonstration turns violent in Rome."\n  }\n]\n```\n\nI hope this is what you were looking for! Let me know if you need further assistance.';
  
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file && file.type.includes('video')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      // Simulate upload process
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        processVideo(file, url);
      }, 2000);
    }
  };

//   const transcribe = async (file: File) => {

//         try {
//             const formData = new FormData();
//             formData.append("file", file);
//             formData.append("model", "whisper-1");

//             const openaiRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
//             },
//             body: formData,
//             });

//             const response = await openaiRes.json();
//             console.log(74, response.text);        
//             // setTranscriptionText(response.text);
//             return response.text;           

//         } catch (error) {
//         console.error("Transcription failed:", error);
//         }  
//   };

  const transcribeVideo = async (url: string) => {
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
            
            // Ensure we have exactly 5 highlights
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
    }  

  const analyzeHighlights = async (url: string) => {
        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');


        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        // Download video file for processing
        const videoResponse = await fetch(url);
        const videoBuffer = await videoResponse.arrayBuffer();
        
        // Convert to base64 for Gemini
        const videoBase64 = Buffer.from(videoBuffer).toString('base64');

        const transcriptionText = transcriptObj.map(item => 
        `${item.timestamp}: ${item.text}`
        ).join('\n');

        const prompt = `
        Analyze this video transcription and identify exactly 5 key highlight moments.
        Consider moments that are:
        - Most informative or educational
        - Action items or important decisions
        - Demonstrations or examples
        - Key conclusions or summaries
        - Exciting or engaging content
        
        Transcription:
        ${transcriptionText}
        
        Return a JSON array only with exactly 5 objects and without any other words so I can use Json.parse to parse the JSON array, each containing:
        - timestamp: in "mm:ss" format (must match existing timestamps)
        - seconds: timestamp in seconds (number)
        - title: brief title for the highlight (max 20 characters)
        - description: short description (max 60 characters)
        
        Example format:
        [
            {
            "timestamp": "01:23",
            "seconds": 83,
            "title": "Key Demo",
            "description": "Main feature demonstration"
            }
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
        const highlightsText = response.text();        
        let highlights;
        try {
            // Extract JSON array from highlightsText (which may contain extra text and code block markers)
            const jsonMatch = highlightsText.match(/```json\s*([\s\S]*?)\s*```/i) || highlightsText.match(/\[\s*{[\s\S]*}\s*\]/);
            if (jsonMatch) {
                const jsonString = jsonMatch[1] ? jsonMatch[1] : jsonMatch[0];
                highlights = JSON.parse(jsonString);
            } else {
                throw new Error('Could not extract JSON from highlightsText');
            }
            
            // Ensure we have exactly 5 highlights
            if (!Array.isArray(highlights)) {
                throw new Error('Response is not an array');
            }
            
            highlights = highlights.slice(0, 5); // Take only first 5
            
            // Validate highlight format
            highlights = highlights.map(highlight => ({
                timestamp: highlight.timestamp || '00:00',
                seconds: highlight.seconds || 0,
                title: highlight.title || 'Highlight',
                description: highlight.description || 'Key moment'
            }));
        
        } catch (parseError) {
            console.error('Failed to parse highlights:', parseError);
            // Fallback: create highlights from transcription
            highlights = transcriptObj.slice(0, 5).map((item, index) => ({
                timestamp: item.timestamp,
                seconds: item.seconds,
                title: `Highlight ${index + 1}`,
                description: item.text.substring(0, 60) + '...'
            }));
        }

        return { 
        highlights: highlights,
        raw: highlightsText 
        };
    }

  const processVideo = async (file: File, url: string) => {
    if (!file) return;

    setIsProcessing(true);
    // Simulate AI processing

    try {
        // Step 1: Upload video to Firebase Storage
        // console.log('Uploading video to Firebase...');
        // const videoUrl = await uploadVideoToFirebase(videoFile);
        // console.log('Video uploaded:', videoUrl);
        
        // Step 2: Call transcription API
        console.log('Starting transcription...');
        // const transcriptionResult = transcriptObj;
        const transcriptionResult = await transcribeVideo(url);
        console.log('Transcription completed:', transcriptionResult);
        
        // Step 3: Process highlights from transcription
        console.log('Analyzing highlights...');
        // const highlightsResult = await analyzeHighlights(transcriptionResult.transcription);
        // const highlightsResult = highlightsObj;
        const highlightsResult = await analyzeHighlights(url);
        console.log('Highlights analyzed:', highlightsResult);
        
        // Step 4: Update state with results
        // setTranscription(transcriptionResult.transcription);
        // setHighlights(highlightsResult.highlights);
        setTranscription(transcriptObj);
        setHighlights(highlightsObj);            
    } catch (error) {
        console.error('Processing failed:', error);
        // alert('Failed to process video: ' + error.message);
    } finally {
        setIsProcessing(false);
    }

  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Find active transcript
      const active = transcription.findIndex((item, index) => {
        const nextItem = transcription[index + 1];
        return time >= item.seconds && (!nextItem || time < nextItem.seconds);
      });
      
      if (active !== -1) {
        setActiveTranscript(active);
      }
    }
  };

  const seekTo = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AI Video Highlight Tool
          </h1>
          <p className="text-slate-300 text-lg">Upload videos and get AI-powered transcriptions with key moment highlights</p>
        </div>

        {!videoFile ? (
          <div className="max-w-2xl mx-auto">
            <div 
              className="border-2 border-dashed border-slate-600 rounded-xl p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileVideo className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-xl font-semibold mb-2">Upload Your Video</h3>
              <p className="text-slate-400 mb-4">Click to select or drag and drop your video file</p>
              <div className="text-sm text-slate-500">
                Supported formats: MP4, MOV, AVI • Max size: 100MB
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player Section */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-xl p-6 shadow-2xl">
                <div className="relative mb-4">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full rounded-lg shadow-lg"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  {(isUploading || isProcessing) && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-lg font-semibold">
                          {isUploading ? 'Uploading video...' : 'Processing with AI...'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Controls */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={togglePlayPause}
                      className="bg-blue-600 hover:bg-blue-700 rounded-full p-3 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <span className="text-sm text-slate-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Progress Bar with Highlights */}
                  <div className="relative">
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-150"
                        style={{ width: `${getProgressPercentage()}%` }}
                      ></div>
                    </div>
                    {/* Highlight Markers */}
                    {highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="absolute top-0 w-3 h-3 bg-yellow-500 rounded-full transform -translate-y-0.5 cursor-pointer hover:scale-125 transition-transform"
                        style={{ left: `${(highlight.seconds / duration) * 100}%` }}
                        onClick={() => seekTo(highlight.seconds)}
                        title={highlight.title}
                      ></div>
                    ))}
                  </div>

                  {/* Highlights */}
                  {highlights.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                        Key Highlights
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {highlights.map((highlight, index) => (
                          <div
                            key={index}
                            className="bg-slate-700 rounded-lg p-3 cursor-pointer hover:bg-slate-600 transition-colors"
                            onClick={() => seekTo(highlight.seconds)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-yellow-500 font-semibold">{highlight.timestamp}</span>
                              <SkipForward className="w-4 h-4 text-slate-400" />
                            </div>
                            <h4 className="font-medium mb-1">{highlight.title}</h4>
                            <p className="text-sm text-slate-300">{highlight.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transcript Section */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl p-6 shadow-2xl h-full">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-500" />
                  Transcript
                </h3>
                {transcription.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {transcription.map((item, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          activeTranscript === index 
                            ? 'bg-blue-600 bg-opacity-30 border border-blue-500' 
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                        onClick={() => seekTo(item.seconds)}
                      >
                        <div className="text-sm text-blue-400 font-medium mb-1">
                          {item.timestamp}
                        </div>
                        <div className="text-sm leading-relaxed">
                          {item.text}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Transcript will appear here after processing</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoHighlightTool;