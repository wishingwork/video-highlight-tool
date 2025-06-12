# AI Video Highlight Tool

## Description

AI Video Highlight Tool is a web application that allows users to upload video files, automatically transcribe their content using AI, and interactively highlight and navigate key moments in the video via the transcript. Users can select transcript blocks to restrict playback to only those highlights, making it easy to review or share important segments.

---

## Structure / System Diagram

```
video-highlight-tool/
├── src/
│   └── app/
│       ├── videoHighLightTool.tsx      # Main React component
│       ├── TranscriptSection.tsx       # Transcript UI and selection logic
│       ├── VideoPlayerSection.tsx      # Video player and controls
│       ├── videoUtils.ts               # Video transcription utilities
│       └── ...                         # Other supporting files
├── public/                             # Static assets
├── package.json
└── README.md
```

**System Flow:**
1. User uploads a video file.
2. The app processes and transcribes the video using AI.
3. The transcript is displayed alongside the video.
4. User can select transcript blocks to highlight.
5. Video playback can be restricted to selected highlights.

---

## How to Install

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd video-highlight-tool
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

---

## How to Test

- **Run the development server:**
  ```bash
  npm run dev
  # or
  yarn dev
  ```
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Upload a video file (MP4, MOV, AVI, max 100MB) and interact with the transcript and highlights.

---

## How to Use (User Manual)

1. **Upload Video:**
   - Click the upload area or drag and drop a video file.
   - Wait for the upload and AI transcription to complete.

2. **View Transcript:**
   - The transcript appears on the left. Each block corresponds to a segment of the video.

3. **Highlight Key Moments:**
   - Click transcript blocks to select/deselect them as highlights.
   - Selected highlights are visually indicated.

4. **Playback Controls:**
   - Use the video player to play, pause, or seek.
   - If highlights are selected, playback can be restricted to those segments.

5. **Review Highlights:**
   - Use the highlights list to quickly jump to important moments.

---

## Notes

- Supported video formats: MP4, MOV, AVI.
- Maximum file size: 100MB.
- All processing is done client-side; no video is uploaded to a server.

---
