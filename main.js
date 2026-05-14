document.getElementById('allow-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'allow' });
});