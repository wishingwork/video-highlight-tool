"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, SkipForward, Clock, Zap, FileVideo } from 'lucide-react';

const VideoHighlightTool = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTranscript, setActiveTranscript] = useState(0);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Mock data for demonstration
  const mockTranscription = [
    { timestamp: "00:15", seconds: 15, text: "Welcome to our comprehensive product demonstration" },
    { timestamp: "00:32", seconds: 32, text: "Let me show you the key features that make this special" },
    { timestamp: "01:05", seconds: 65, text: "First, we have the intuitive user interface" },
    { timestamp: "01:23", seconds: 83, text: "The dashboard provides real-time analytics and insights" },
    { timestamp: "01:45", seconds: 105, text: "Next, let's explore the advanced customization options" },
    { timestamp: "02:10", seconds: 130, text: "Users can personalize their experience completely" },
    { timestamp: "02:35", seconds: 155, text: "The integration capabilities are truly impressive" },
    { timestamp: "03:00", seconds: 180, text: "Connect with over 100 popular business tools" },
    { timestamp: "03:25", seconds: 205, text: "Finally, our world-class customer support" },
    { timestamp: "03:50", seconds: 230, text: "Available 24/7 to help you succeed" }
  ];

  const mockHighlights = [
    { timestamp: "00:32", seconds: 32, title: "Feature Overview", description: "Introduction to key product features" },
    { timestamp: "01:23", seconds: 83, title: "Dashboard Demo", description: "Real-time analytics demonstration" },
    { timestamp: "01:45", seconds: 105, title: "Customization", description: "Advanced personalization options" },
    { timestamp: "02:35", seconds: 155, title: "Integrations", description: "Third-party tool connections" },
    { timestamp: "03:25", seconds: 205, title: "Support", description: "Customer service overview" }
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.includes('video')) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      
      // Simulate upload process
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        processVideo();
      }, 2000);
    }
  };

  const processVideo = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setTranscription(mockTranscription);
      setHighlights(mockHighlights);
      setIsProcessing(false);
    }, 3000);
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

  const seekTo = (seconds) => {
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

  const formatTime = (seconds) => {
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