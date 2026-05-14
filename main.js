function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}

function isValidYouTubeVideo(url) {
    return /youtube\.com\/watch\?.*v=|youtu\.be\//.test(url);
}

chrome.storage.local.get(['totalTime'], (result) => {
    const el = document.getElementById('total-time');
    el.textContent = result.totalTime
        ? `Total time on YouTube: ${formatTime(result.totalTime)}`
        : 'No YouTube time tracked yet.';
});

document.getElementById('allow-btn').addEventListener('click', () => {
    document.getElementById('url-form').classList.toggle('visible');
    document.getElementById('url-input').focus();
});

document.getElementById('watch-btn').addEventListener('click', () => {
    const url = document.getElementById('url-input').value.trim();
    const errorMsg = document.getElementById('error-msg');

    if (!isValidYouTubeVideo(url)) {
        errorMsg.style.display = 'block';
        return;
    }

    errorMsg.style.display = 'none';
    chrome.runtime.sendMessage({ action: 'allow', url });
});
