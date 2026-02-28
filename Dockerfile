FROM node:18-bullseye

# Install python
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
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