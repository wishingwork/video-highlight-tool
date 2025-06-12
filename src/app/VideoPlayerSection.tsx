import React from 'react';
import { Play, Pause } from 'lucide-react';
import { TranscriptItem } from './TranscriptSection';
import VideoProgressBar from './VideoProgressBar';
import HighlightsSection from './HighlightsSection';

type Highlight = {
  timestamp: string;
  seconds: number;
  title: string;
  description: string;
};

type VideoPlayerSectionProps = {
  videoUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  isUploading: boolean;
  isProcessing: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTranscript?: TranscriptItem;
  selectedTranscripts: TranscriptItem[];
  selectedHighlights: Highlight[];
  transcription: TranscriptItem[];
  seekTo: (seconds: number, index?: number) => void;
  togglePlayPause: () => void;
  getProgressPercentage: () => number;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  handleTimeUpdate: () => void;
};

const VideoPlayerSection: React.FC<VideoPlayerSectionProps> = ({
  videoUrl,
  videoRef,
  isUploading,
  isProcessing,
  isPlaying,
  currentTime,
  duration,
  currentTranscript,
  selectedTranscripts,
  selectedHighlights,
  transcription,
  seekTo,
  togglePlayPause,
  getProgressPercentage,
  setDuration,
  setIsPlaying,
  handleTimeUpdate,
}) => (
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
      {isPlaying && currentTranscript && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white px-4 py-2 rounded text-center max-w-xl text-lg shadow-lg pointer-events-none">
          {currentTranscript.text}
        </div>
      )}
    </div>
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
      <VideoProgressBar
        duration={duration}
        currentTime={currentTime}
        getProgressPercentage={getProgressPercentage}
        selectedTranscripts={selectedTranscripts}
        transcription={transcription}
        seekTo={seekTo}
      />
      {/* Highlights Section */}
      <HighlightsSection
        selectedHighlights={selectedHighlights}
        seekTo={seekTo}
      />
    </div>
  </div>
);

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default VideoPlayerSection;
