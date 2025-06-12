import React from 'react';
import { TranscriptItem } from './TranscriptSection';

type VideoProgressBarProps = {
  duration: number;
  currentTime: number;
  getProgressPercentage: () => number;
  selectedTranscripts: TranscriptItem[];
  transcription: TranscriptItem[];
  seekTo: (seconds: number) => void;
};

const VideoProgressBar: React.FC<VideoProgressBarProps> = ({
  duration,
  currentTime,
  getProgressPercentage,
  selectedTranscripts,
  transcription,
  seekTo,
}) => (
  <div className="relative">
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-150"
        style={{ width: `${getProgressPercentage()}%` }}
      ></div>
    </div>
    {selectedTranscripts.map((highlight, index) => {
      const idx = transcription.findIndex(t => t.seconds === highlight.seconds);
      const endSeconds = transcription[idx + 1]?.seconds ?? duration;
      const left = (highlight.seconds / duration) * 100;
      const width = ((endSeconds - highlight.seconds) / duration) * 100;
      return (
        <div
          key={index}
          className="absolute top-0 h-3 bg-yellow-500 bg-opacity-70 rounded-full cursor-pointer hover:scale-y-110 transition-transform"
          style={{
            left: `${left}%`,
            width: `${width}%`
          }}
          onClick={() => seekTo(highlight.seconds)}
          title={highlight.text?.substring(0, 30)}
        ></div>
      );
    })}
    <div
      className="absolute top-[-4px] w-1 h-4 bg-white rounded-full shadow transition-all duration-75"
      style={{
        left: `calc(${getProgressPercentage()}% - 2px)`,
        zIndex: 10,
      }}
    ></div>
  </div>
);

export default VideoProgressBar;
