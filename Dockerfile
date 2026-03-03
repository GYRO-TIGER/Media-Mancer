FROM ubuntu:24.04
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl software-properties-common ffmpeg \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt-get update && apt-get install -y \
    nodejs npm python3.12 python3.12-venv python3-pip \
    && rm -rf /var/lib/apt/lists/*

RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12 1

# Consistently use /app
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

# Copy all files into /app
COPY . .

# Ensure the download folder exists with permissions
RUN mkdir -p /app/downloads && chmod 777 /app/downloads

EXPOSE 5500
CMD ["node", "server.js"]