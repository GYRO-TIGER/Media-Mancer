# 🎥 Media Mancer

Media Mancer is a web-based YouTube downloader built using Python (`yt-dlp`) and Node.js for the backend. It supports both video (with selectable quality) and audio downloads with real-time progress updates.

## How to Run

1. **Install Requirements**
   ```bash
   pip install yt-dlp
   npm install
   ```

2. **Start the Server**
   ```bash
   node server.js
   ```

3. **Open in Browser**
   Navigate to `http://127.0.0.1:3000`

## Project Structure

- `mediaDownloaderMain.py` – Python downloader logic
- `server.js` – Express server acting as backend
- `public/` – Contains frontend files (HTML, JS, CSS)

