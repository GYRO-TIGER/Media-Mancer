import sys
import yt_dlp
import json
import os
import time

BASE_DOWNLOAD_PATH = os.path.join(os.getcwd(), "downloads")
os.makedirs(BASE_DOWNLOAD_PATH, exist_ok=True)  

def progress_hook(d):
    if d['status'] == 'downloading':
        progress = {
            'progress': d.get('_percent_str', '').strip(),
            'speed': d.get('_speed_str', '').strip(),
            'eta': d.get('_eta_str', '').strip()
        }
        print(json.dumps(progress), flush=True)

def set_modified_time(filepath):
    current_time = time.time()
    os.utime(filepath, (current_time, current_time))

def download_video(link, quality):
    with yt_dlp.YoutubeDL({}) as ydl:
        info = ydl.extract_info(link, download=False)
        title = info.get('title', 'video')
        ext = 'mp4'

    filename = f"{title}.{ext}"
    filepath = os.path.join(BASE_DOWNLOAD_PATH, filename)

    ydl_opts = {
        'format': quality,
        'outtmpl': filepath,
        'merge_output_format': 'mp4',
        'progress_hooks': [progress_hook]
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([link])

    set_modified_time(filepath)

def download_audio(link):
    with yt_dlp.YoutubeDL({}) as ydl:
        info = ydl.extract_info(link, download=False)
        title = info.get('title', 'audio')
        ext = 'mp3'

    filename = f"{title}.{ext}"
    filepath = os.path.join(BASE_DOWNLOAD_PATH, filename)

    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': filepath,
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192'
        }],
        'progress_hooks': [progress_hook]
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([link])

    set_modified_time(filepath)

if __name__ == "__main__":
    link = sys.argv[1]
    mode = sys.argv[2]
    quality = sys.argv[3] if len(sys.argv) > 3 else "bestvideo+bestaudio"

    if mode == "video":
        download_video(link, quality)
    elif mode == "audio":
        download_audio(link)
