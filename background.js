function redirectToBlock(tabId) {
    chrome.tabs.update(tabId, { url: chrome.runtime.getURL('main.html') });
}

chrome.webNavigation.onCommitted.addListener(
    (details) => { if (details.frameId === 0) redirectToBlock(details.tabId); },
    { url: [{ hostContains: 'youtube.com' }] }
);
