function redirectToBlock(tabId) {
    chrome.storage.local.get(['visitCount'], (result) => {
        chrome.storage.local.set({ visitCount: (result.visitCount || 0) + 1 });
    });
    chrome.tabs.update(tabId, { url: chrome.runtime.getURL('main.html') });
}

function handleNavigation(details) {
    if (details.frameId !== 0) return;
    chrome.storage.local.get(['allowedVideoId'], (result) => {
        if (!result.allowedVideoId || !details.url.includes(`v=${result.allowedVideoId}`)) {
            redirectToBlock(details.tabId);
        }
    });
}

function reblockIfNoYoutubeTabs() {
    chrome.tabs.query({ url: ['https://www.youtube.com/*', 'https://youtube.com/*', 'https://*.youtube.com/*'] }, (tabs) => {
        if (tabs.length === 0) {
            chrome.storage.local.get(['startTime', 'totalTime'], (result) => {
                const updates = { allowedVideoId: null, startTime: null };
                if (result.startTime) {
                    updates.totalTime = (result.totalTime || 0) + (Date.now() - result.startTime);
                }
                chrome.storage.local.set(updates);
            });
        }
    });
}

chrome.webNavigation.onCommitted.addListener(
    handleNavigation,
    { url: [{ hostContains: 'youtube.com' }] }
);

chrome.webNavigation.onHistoryStateUpdated.addListener(
    handleNavigation,
    { url: [{ hostContains: 'youtube.com' }] }
);

chrome.tabs.onRemoved.addListener(reblockIfNoYoutubeTabs);

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.url) reblockIfNoYoutubeTabs();
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'watchVideo') {
        chrome.storage.local.set({ allowedVideoId: message.videoId, startTime: Date.now() }, () => {
            chrome.tabs.create({ url: message.url });
        });
    }

    if (message.action === 'addTime') {
        chrome.storage.local.get(['totalTime'], (result) => {
            chrome.storage.local.set({ totalTime: (result.totalTime || 0) + message.elapsed });
        });
    }
});
