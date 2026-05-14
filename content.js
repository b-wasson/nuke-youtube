if (window.location.href.includes('youtube.com')) {
    window.location.replace(chrome.runtime.getURL('main.html'));
}