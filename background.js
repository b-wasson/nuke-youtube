function redirectToBlock(tabId) {
    chrome.tabs.update(tabId, { url: chrome.runtime.getURL('main.html') });
}

function handleNavigation(details) {
    if (details.frameId !== 0) return;
    chrome.storage.local.get(['allowed'], (result) => {
        if (!result.allowed) redirectToBlock(details.tabId);
    });
}

function reblockIfNoYoutubeTabs() {
    chrome.tabs.query({ url: ['https://www.youtube.com/*', 'https://youtube.com/*', 'https://*.youtube.com/*'] }, (tabs) => {
        if (tabs.length === 0) {
            chrome.storage.local.get(['startTime', 'totalTime'], (result) => {
                const updates = { allowed: false, startTime: null };
                if (result.startTime) {
                    const elapsed = Date.now() - result.startTime;
                    updates.totalTime = (result.totalTime || 0) + elapsed;
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
    if (message.action === 'allow') {
        chrome.storage.local.set({ allowed: true, startTime: Date.now() }, () => {
            chrome.tabs.create({ url: message.url });
        });
    }
});
