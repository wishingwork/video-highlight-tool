"use client"
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { FileVideo } from 'lucide-react';
import TranscriptSection from './TranscriptSection';
import VideoPlayerSection from './VideoPlayerSection';
import { transcribeVideo, TranscriptItem } from './videoUtils';

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

  // Memoized derived state
  const selectedTranscripts = useMemo(() =>
    selectedTranscriptIndices
      .sort((a, b) => a - b)
      .map(idx => transcription[idx])
      .filter(Boolean),
    [selectedTranscriptIndices, transcription]
  );

  const selectedHighlights = useMemo(() =>
    selectedTranscripts.map(item => ({
      timestamp: item.timestamp,
      seconds: item.seconds,
      title: item.text.substring(0, 20) + (item.text.length > 20 ? "..." : ""),
      description: item.text.substring(0, 60) + (item.text.length > 60 ? "..." : "")
    })),
    [selectedTranscripts]
  );

  const getCurrentTranscriptIndex = useCallback(() => {
    return transcription.findIndex((item, index) => {
      const nextItem = transcription[index + 1];
      return currentTime >= item.seconds && (!nextItem || currentTime < nextItem.seconds);
    });
  }, [transcription, currentTime]);

  const currentTranscript = useMemo(() => transcription[getCurrentTranscriptIndex()], [transcription, getCurrentTranscriptIndex]);

  // Toggle transcript block selection
  const toggleTranscriptSelection = useCallback((index: number) => {
    setSelectedTranscriptIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }, []);

  // Restrict playback to selected transcript blocks (custom hook style)
  const restrictPlaybackToSelectedBlocks = useCallback(() => {
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

  useEffect(() => {
    restrictPlaybackToSelectedBlocks();
  }, [restrictPlaybackToSelectedBlocks]);

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
              <TranscriptSection
                transcription={transcription}
                activeTranscript={activeTranscript}
                selectedTranscriptIndices={selectedTranscriptIndices}
                toggleTranscriptSelection={toggleTranscriptSelection}
              />
            </div>
            {/* Video Player Section */}
            <div className="lg:col-span-2">
              <VideoPlayerSection
                videoUrl={videoUrl}
                videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                isUploading={isUploading}
                isProcessing={isProcessing}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                currentTranscript={currentTranscript}
                selectedTranscripts={selectedTranscripts}
                selectedHighlights={selectedHighlights}
                transcription={transcription}
                seekTo={seekTo}
                togglePlayPause={togglePlayPause}
                getProgressPercentage={getProgressPercentage}
                setDuration={setDuration}
                setIsPlaying={setIsPlaying}
                handleTimeUpdate={handleTimeUpdate}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoHighlightTool;