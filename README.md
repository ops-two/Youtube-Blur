# YouTube Thumbnail Blur & Shorts Block

Clean up your YouTube feed. Instantly blur video thumbnails and completely block YouTube Shorts for better focus.

## Features

- **Thumbnail Blurring**: Applies 150px blur to all YouTube thumbnails across the platform
- **YouTube Shorts Blocking**: 
  - Automatically redirects Shorts URLs to normal video player
  - Removes Shorts from feeds and recommendations
  - Hides Shorts navigation tabs
  - Provides manual convert button on Shorts pages
- **One-Click Toggle**: Simple extension icon click to enable/disable all features
- **Visual Feedback**: Extension icon changes color to show state:
  - Green icon with eye = Enabled (blur active)
  - Gray icon with crossed eye = Disabled (blur inactive)
- **Clean Refresh**: Page refreshes when toggled to ensure clean state

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your Chrome toolbar

## Usage

- **Enable Extension**: Click the extension icon → icon turns green
- **Disable Extension**: Click the extension icon → icon turns gray with slash
- When toggled, YouTube page automatically refreshes to apply changes
- Extension only runs when enabled, no background processing when disabled
- Hover over icon for status tooltip

## How It Works

- **Icon Toggle**: Background script handles extension icon clicks and dynamically updates icon
- **State Management**: Enabled/disabled state stored locally and persists across browser sessions
- **Dynamic Icons**: Canvas-generated icons show current state (green = on, gray = off)
- **Content Injection**: Scripts and styles only load when extension is enabled
- **Shorts Blocking**: Multiple strategies ensure comprehensive Shorts removal
- **Page Refresh**: Clean toggle experience with automatic page refresh

## Privacy

This extension:
- Only operates on YouTube domains
- Stores settings locally on your device
- Makes no external network requests
- Collects no user data

## Technical Details

- **Manifest V3** compatible
- **Permissions**: `activeTab`, `storage`, `tabs`
- **Domains**: `*.youtube.com`, `*.youtu.be`, `*.ytimg.com`
- **Scripts**: Background service worker + content scripts
- **Inline Styles**: CSS injected via JavaScript for clean toggle behavior
- **Icon System**: Dynamically generated canvas icons showing eye symbol

## Files

- `manifest.json` - Extension configuration
- `background.js` - Handles icon clicks and dynamic icon generation
- `content.js` - Main logic for blurring and shorts blocking
- `README.md` - This documentation
