# 1. Start with the official Ubuntu 22.04 or 24.04 image
FROM ubuntu:24.04

# 2. Avoid prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# 3. Install basics, Node.js, and Python 3.12
RUN apt-get update && apt-get install -y \
    curl \
    software-properties-common \
    ffmpeg\
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt-get update \
    && apt-get install -y \
    nodejs \
    npm \
    python3.12 \
    python3.12-venv \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# 4. Set Python 3.12 as the default 'python3' alias
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12 1

# 5. Set working directory
WORKDIR /app

# 6. Install Node dependencies
COPY package*.json ./
RUN npm install

# 7. Install Python dependencies
COPY requirements.txt ./
# Note: Using --break-system-packages is often required in newer Ubuntu/Python 
# environments when not using a virtual environment inside the container
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# 8. Copy your files (server.js, mediaDownloaderMain.py, public folder)
COPY . .

# 9. Expose your Node port
EXPOSE 5500

# Create the downloads directory
RUN mkdir -p /app/downloads && chmod 777 /app/downloads

# 10. Start the server
CMD ["node", "server.js"]