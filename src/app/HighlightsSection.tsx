import React from 'react';
import { SkipForward, Zap } from 'lucide-react';

type Highlight = {
  timestamp: string;
  seconds: number;
  title: string;
  description: string;
};

type HighlightsSectionProps = {
  selectedHighlights: Highlight[];
  seekTo: (seconds: number) => void;
};

const HighlightsSection: React.FC<HighlightsSectionProps> = ({ selectedHighlights, seekTo }) => (
  selectedHighlights.length > 0 ? (
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
  ) : null
);

export default HighlightsSection;
