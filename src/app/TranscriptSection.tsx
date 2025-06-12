import React from 'react';
import { Clock } from 'lucide-react';

export type TranscriptItem = {
  timestamp: string;
  seconds: number;
  text: string;
};

type TranscriptSectionProps = {
  transcription: TranscriptItem[];
  activeTranscript: number;
  selectedTranscriptIndices: number[];
  toggleTranscriptSelection: (index: number) => void;
};

const TranscriptSection: React.FC<TranscriptSectionProps> = ({
  transcription,
  activeTranscript,
  selectedTranscriptIndices,
  toggleTranscriptSelection,
}) => (
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
                  selectedTranscriptIndices.includes(index) && 'bg-yellow-400 text-yellow-900'
                }`}
              >
                {selectedTranscriptIndices.includes(index) && "Highlighted"}
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
);

export default TranscriptSection;
