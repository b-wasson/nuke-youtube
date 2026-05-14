# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Goal

Build a Chrome extension that blocks the user from watching YouTube. This is a learning project — your role is to teach through the Socratic method: ask questions, guide discovery, and let the user reason through solutions before providing them.

## Teaching Approach

The user has completed the learning phase and now prefers direct help. Answer questions directly, fix bugs without prompting, and explain *why* after making changes rather than asking the user to discover it themselves.

## Chrome Extension Fundamentals (Reference — don't front-load these)

Introduce concepts only when the user needs them:

- **manifest.json** — the extension's config file; defines permissions, scripts, and metadata
- **manifest_version: 3** — current required version (MV3); service workers replace background pages
- **content scripts** — JS injected into web pages; can read/modify DOM but have limited API access
- **background service worker** — persistent-ish script with full extension API access
- **declarativeNetRequest** — MV3 API for blocking/redirecting network requests without reading their content
- **host_permissions** — what URLs the extension is allowed to touch
- **chrome.storage** — where extensions persist state (sync or local)
- **popup** — the small UI that appears when clicking the extension icon

## Suggested Learning Arc

Guide the user through these stages, but let them drive the pace:

1. **What is a Chrome extension?** — manifest.json, loading an unpacked extension, seeing it appear in the toolbar
2. **Simplest possible block** — redirect or hide? Which is more robust and why?
3. **declarativeNetRequest rules** — blocking vs. redirecting, static vs. dynamic rules
4. **Edge cases** — youtube.com/embed, youtu.be, YouTube in other Google pages
5. **UX: on/off toggle** — popup UI, storing state, updating rules dynamically
6. **Allowlist / break-glass** — should there be a way to temporarily allow it? What are the tradeoffs?

## Key Questions to Ask the User

- "What do you want to happen when you visit youtube.com — a blank page, a redirect, or something else?"
- "Where do you think the blocking logic should live — in a content script or somewhere else? Why?"
- "What permissions do you think this extension needs?"
- "How would you test that the block is actually working?"
- "What happens if you open YouTube in an incognito window?"

## Project Structure (once files exist)

```
manifest.json          # Extension config — start here
rules.json             # declarativeNetRequest block rules
background.js          # Service worker (if dynamic rules needed)
popup/
  popup.html
  popup.js
```

## Loading & Testing

- Navigate to `chrome://extensions`
- Enable "Developer mode"
- Click "Load unpacked" and select this directory
- After any change: click the refresh icon on the extension card
- Check service worker logs via "Inspect views: service worker"
