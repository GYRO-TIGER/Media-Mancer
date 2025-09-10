const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const PORT = 5500;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/download', (req, res) => {
    console.log("Recieved a download request");
    const { url, download_type, quality } = req.body;

    let args = ['mediaDownloaderMain.py', url, download_type, quality];

    const python = spawn('python', args);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    python.stdout.on('data', (data) => {
        res.write(`data: ${data.toString()}\n\n`);
    });

    python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    python.on('close', (code) => {
        res.write('data: {"done": true}\n\n');
        res.end();
    });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://127.0.0.1:${PORT}`);
});
