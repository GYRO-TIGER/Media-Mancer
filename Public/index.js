function showStatus(message, success = true) {
    let status = document.getElementById("status");
    status.innerText = message;
    status.style.color = success ? "#1dd1a1" : "#ff6b6b";
}

function showModal() {
    document.getElementById('downloadModal').style.display = 'flex';
}

function hideModal() {
    document.getElementById('downloadModal').style.display = 'none';
}

function startDownload(type) {
    let link = document.getElementById("videoLink").value;
    let quality = document.getElementById("quality").value;
    let progressText = document.getElementById("progress-text");
    let modalProgressText = document.getElementById("modal-progress-text");

    if (!link) {
        showStatus("Please enter a valid YouTube URL.", false);
        return;
    }

    showModal(); 

    fetch("http://127.0.0.1:5500/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link, download_type: type, quality: quality })
    }).then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        function readStream() {
            reader.read().then(({ done, value }) => {
                let text = decoder.decode(value);

                try {
                    let data = JSON.parse(text.replace("data: ", ""));
                    if (data.progress) {
                        modalProgressText.innerText = `Progress: ${data.progress} | Speed: ${data.speed} | ETA: ${data.eta}`;
                    }
                } catch (e) {
                    console.error("Error parsing stream data", e);
                }

                if (done) {
                    modalProgressText.innerText = "Download complete! ✅";
                    setTimeout(() => {
                        hideModal();
                        showStatus("Download complete! ✅", true);
                    }, 1500);
                    return;
                }
                readStream();
            });
        }
        readStream();
    }).catch(() => {
        hideModal();
        showStatus("Error starting download", false);
    });
}
