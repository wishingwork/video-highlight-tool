"use client"
import React, { useState, useRef, useEffect } from 'react';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTranscript, setActiveTranscript] = useState(0);
  const [selectedTranscriptIndices, setSelectedTranscriptIndices] = useState<number[]>([]);

  type TranscriptItem = {
    timestamp: string;
    seconds: number;
    text: string;
  };
  
// const transcriptObj: TranscriptItem[] = [
//   {
//       "timestamp": "00:08",
//       "seconds": 8,
//       "text": "Anti-war demonstrators protest U.S. involvement in the Vietnam War in mass marches, rallies and demonstrations."
//   },
//   {
//       "timestamp": "00:15",
//       "seconds": 15,
//       "text": "Central Park is the starting point for the parade to the UN building."
//   },
//   {
//       "timestamp": "00:18",
//       "seconds": 18,
//       "text": "The estimated 125,000 Manhattan marchers include students, housewives, beatnik poets, doctors, businessmen, teachers, priests and nuns."
//   },
//   {
//       "timestamp": "00:28",
//       "seconds": 28,
//       "text": "Makeup and costumes were bizarre."
//   },
//   {
//       "timestamp": "00:35",
//       "seconds": 35,
//       "text": "Before the parade, mass draft card burning was urged."
//   },
//   {
//       "timestamp": "00:38",
//       "seconds": 38,
//       "text": "Demonstrators claimed 200 cards were burned, but no accurate count could be determined."
//   },
//   {
//       "timestamp": "00:43",
//       "seconds": 43,
//       "text": "Reporters and onlookers were jostled away on purpose."
//   },
//   {
//       "timestamp": "00:48",
//       "seconds": 48,
//       "text": "Although mostly peaceful, shouted confrontations were frequent and fiery during the course of the march."
//   },
//   {
//       "timestamp": "00:56",
//       "seconds": 56,
//       "text": "The anti-war marchers were picketed by anti anti-war marchers who were hawkish toward the parading doves."
//   },
//   {
//       "timestamp": "01:06",
//       "seconds": 106,
//       "text": "Civil rights leader Martin Luther King leads the procession to the United Nations where he urges UN pressure to force the U.S. to stop bombing North Vietnam."
//   },
//   {
//       "timestamp": "01:19",
//       "seconds": 119,
//       "text": "Police arrested five persons as disorderly."
//   },
//   {
//       "timestamp": "01:22",
//       "seconds": 122,
//       "text": "Three were grabbed when they rushed the parade float."
//   },
//   {
//       "timestamp": "01:24",
//       "seconds": 124,
//       "text": "No serious injuries, however, in New York’s biggest anti-war march."
//   },
//   {
//       "timestamp": "01:31",
//       "seconds": 131,
//       "text": "A companion peace demonstration brings out 50,000 marchers in downtown San Francisco."
//   },
//   {
//       "timestamp": "01:36",
//       "seconds": 136,
//       "text": "They parade two miles along Market Street, pacifists and hippies together."
//   },
//   {
//       "timestamp": "01:43",
//       "seconds": 143,
//       "text": "Gigantic Kezar Stadium holds the mass rally where anti-war songs and speeches trigger a short scuffle between pro and con factions."
//   },
//   {
//       "timestamp": "01:50",
//       "seconds": 150,
//       "text": "No one was injured."
//   },
//   {
//       "timestamp": "01:53",
//       "seconds": 153,
//       "text": "Both demonstrations were sponsored by a loose coalition of left-wing pacifist and moderate anti-war groups."
//   },
//   {
//       "timestamp": "01:59",
//       "seconds": 159,
//       "text": "President Johnson, meanwhile, let it be known that the FBI is closely watching all anti-war activities."
//   },
//   {
//       "timestamp": "02:08",
//       "seconds": 208,
//       "text": "In Rome, a peace demonstration ironically erupts into violence near the U.S. embassy along the glamorous Via Veneto."
//   },
//   {
//       "timestamp": "02:15",
//       "seconds": 215,
//       "text": "Police alerted to possible trouble, stopped the marchers just short of their goal, and then the march turned into a riot."
//   },
//   {
//       "timestamp": "02:22",
//       "seconds": 222,
//       "text": "Peace placards, cafe chairs and fists flew in all directions."
//   },
//   {
//       "timestamp": "02:26",
//       "seconds": 226,
//       "text": "The next phase, a sit-down protest, but Rome police and firemen, too, had a solution."
//   },
//   {
//       "timestamp": "02:32",
//       "seconds": 232,
//       "text": "A solution H2O applied freely and under high pressure by the Rome fire brigade."
//   },
//   {
//       "timestamp": "02:37",
//       "seconds": 237,
//       "text": "The strong water jets bowled over demonstrators one after another."
//   },
//   {
//       "timestamp": "02:41",
//       "seconds": 241,
//       "text": "They dried out in the pokey."
//   },
//   {
//       "timestamp": "02:43",
//       "seconds": 243,
//       "text": "It took police one hour to break up the mob."
//   },
//   {
//       "timestamp": "02:46",
//       "seconds": 246,
//       "text": "33 rioters were arrested."
//   },
//   {
//       "timestamp": "02:48",
//       "seconds": 248,
//       "text": "Internal drama in the eternal city."
//   }
// ];

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

  const processVideo = async (file: File, url: string) => {
    if (!file) return;

    setIsProcessing(true);
    // Simulate AI processing

    try {

        
        // Call transcription API
        console.log('Starting transcription...');
        // const transcriptionResult = transcriptObj;
        const transcriptionResult = await transcribeVideo(url);
        console.log('Transcription completed:', transcriptionResult);
        
        // Step 2: Update state with results
        setTranscription(transcriptionResult.transcription);
        // setTranscription(transcriptObj);
          
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

  // Helper: Get selected transcript blocks
  const selectedTranscripts = selectedTranscriptIndices
    .sort((a, b) => a - b)
    .map(idx => transcription[idx])
    .filter(Boolean);

  // Helper: Get highlight objects from selected transcript blocks
  const selectedHighlights = selectedTranscripts.map(item => ({
    timestamp: item.timestamp,
    seconds: item.seconds,
    title: item.text.substring(0, 20) + (item.text.length > 20 ? "..." : ""),
    description: item.text.substring(0, 60) + (item.text.length > 60 ? "..." : "")
  }));

  // Helper: Find current transcript index
  const getCurrentTranscriptIndex = () => {
    return transcription.findIndex((item, index) => {
      const nextItem = transcription[index + 1];
      return currentTime >= item.seconds && (!nextItem || currentTime < nextItem.seconds);
    });
  };

  // Helper: Get current transcript text
  const currentTranscript = transcription[getCurrentTranscriptIndex()];

  // Toggle transcript block selection
  const toggleTranscriptSelection = (index: number) => {
    setSelectedTranscriptIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  // Restrict playback to selected transcript blocks
  useEffect(() => {
    if (!videoRef.current || selectedTranscriptIndices.length === 0) return;
    const sortedIndices = [...selectedTranscriptIndices].sort((a, b) => a - b);
    const blocks = sortedIndices.map(idx => transcription[idx]).filter(Boolean);
    if (blocks.length === 0) return;

    // Find the current block (if any) that contains currentTime
    const currentBlock = blocks.find((block, i) => {
      const nextBlock = blocks[i + 1];
      return currentTime >= block.seconds && (!nextBlock || currentTime < nextBlock.seconds);
    });

    // If not in any selected block, pause and seek to the start of the first selected block
    if (
      !currentBlock &&
      isPlaying &&
      currentTime > 0 &&
      (currentTime < blocks[0].seconds || currentTime > blocks[blocks.length - 1].seconds)
    ) {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = blocks[0].seconds;
      setCurrentTime(blocks[0].seconds);
    }

    // If playing and passed the end of the current block, pause or jump to next block
    if (isPlaying && currentBlock) {
      const idx = transcription.findIndex(t => t.seconds === currentBlock.seconds);
      const nextIdx = transcription.findIndex((t, i) => 
        i > idx && selectedTranscriptIndices.includes(i)
      );
      const nextBlock = transcription[nextIdx];
      const nextBlockStart = nextBlock ? nextBlock.seconds : null;
      const nextBlockEnd = transcription[idx + 1]?.seconds ?? duration;

      if (currentTime >= nextBlockEnd) {
        if (nextBlockStart != null) {
          videoRef.current.currentTime = nextBlockStart;
          setCurrentTime(nextBlockStart);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    }
  }, [currentTime, isPlaying, selectedTranscriptIndices, transcription, duration]);

  // Seek to transcript block (and play if already playing)
  const seekTo = (seconds: number, index?: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      if (typeof index === "number") {
        setActiveTranscript(index);
      }
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
                        className={`p-3 rounded-lg cursor-pointer transition-all border ${
                          activeTranscript === index 
                            ? 'bg-blue-600 bg-opacity-30 border-blue-500' 
                            : selectedTranscriptIndices.includes(index)
                              ? 'bg-yellow-500 bg-opacity-20 border-yellow-400'
                              : 'bg-slate-700 hover:bg-slate-600 border-transparent'
                        }`}
                        onClick={() => toggleTranscriptSelection(index)}
                        title={selectedTranscriptIndices.includes(index) ? "Remove from highlights" : "Add to highlights"}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-400 font-medium mb-1">
                            {item.timestamp}
                          </span>
                          <button
                            className={`ml-2 px-2 py-0.5 text-xs rounded ${
                              selectedTranscriptIndices.includes(index)
                                ? 'bg-yellow-400 text-yellow-900'
                                : 'bg-slate-600 text-slate-200'
                            }`}
                          >
                            {selectedTranscriptIndices.includes(index) ? "Highlighted" : "Highlight"}
                          </button>
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
                  {/* Transcript overlay when playing */}
                  {isPlaying && currentTranscript && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-4 py-2 rounded text-center max-w-xl text-lg shadow-lg pointer-events-none">
                      {currentTranscript.text}
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
                    {/* Highlight Markers for selected transcript blocks */}
                    {selectedTranscripts.map((highlight, index) => (
                      <div
                        key={index}
                        className="absolute top-0 w-3 h-3 bg-yellow-500 rounded-full transform -translate-y-0.5 cursor-pointer hover:scale-125 transition-transform"
                        style={{ left: `${(highlight.seconds / duration) * 100}%` }}
                        onClick={() => seekTo(highlight.seconds)}
                        title={highlight.text.substring(0, 30)}
                      ></div>
                    ))}
                  </div>

                  {/* Highlights */}
                  {selectedHighlights.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                        Key Highlights
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedHighlights.map((highlight, index) => (
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


          </div>
        )}
      </div>
    </div>
  );
};

export default VideoHighlightTool;