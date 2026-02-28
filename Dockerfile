FROM python:3.12.8-slim

# Install Node 18
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Working directory
WORKDIR /files

# Copy node.js dependencies
COPY package*.json ./
COPY requirements.txt ./

# Install node.js dependencies
RUN npm install --production
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Port exposure
EXPOSE 5500

# Start the application
CMD ["node", "server.js"]