const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const PORT = 5500;

app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

app.post('/download', (req, res) => {
    console.log("Recieved a download request");
    const { url, download_type, quality } = req.body;

    let args = [path.join(__dirname, 'mediaDownloaderMain.py'), url, download_type, quality];

    const python = spawn('python3', args, { cwd: __dirname });

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

app.listen(PORT,'0.0.0.0', () => {
    console.log(`✅ Server running at port:${PORT}`);
});
