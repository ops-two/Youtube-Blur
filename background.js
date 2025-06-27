// Background script for YouTube Blur & Shorts Block

// Function to create icon with specific color
function createIcon(isEnabled) {
    const canvas = new OffscreenCanvas(128, 128);
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, 128, 128);
    
    // Draw circle background
    ctx.beginPath();
    ctx.arc(64, 64, 50, 0, 2 * Math.PI);
    ctx.fillStyle = isEnabled ? '#4CAF50' : '#757575';
    ctx.fill();
    
    // Draw eye icon (simplified)
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.lineWidth = 4;
    
    // Eye outline
    ctx.beginPath();
    ctx.ellipse(64, 64, 30, 20, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Eye pupil
    ctx.beginPath();
    ctx.arc(64, 64, 10, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw slash if disabled
    if (!isEnabled) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(40, 88);
        ctx.lineTo(88, 40);
        ctx.stroke();
    }
    
    return ctx.getImageData(0, 0, 128, 128);
}

// Update icon based on state
async function updateIcon(isEnabled) {
    const imageData = createIcon(isEnabled);
    
    await chrome.action.setIcon({
        imageData: imageData
    });
    
    await chrome.action.setTitle({ 
        title: isEnabled ? 'YouTube Blur: ON (Click to disable)' : 'YouTube Blur: OFF (Click to enable)'
    });
}

chrome.action.onClicked.addListener(async (tab) => {
    // Check if we're on a YouTube page
    if (!tab.url.includes('youtube.com') && !tab.url.includes('youtu.be')) {
        return;
    }

    try {
        // Get current enabled state
        const result = await chrome.storage.local.get(['enabled']);
        const currentState = result.enabled !== undefined ? result.enabled : true;
        const newState = !currentState;
        
        // Save new state
        await chrome.storage.local.set({ enabled: newState });
        
        // Update icon
        await updateIcon(newState);
        
        // Refresh the YouTube tab to apply/remove extension
        await chrome.tabs.reload(tab.id);
        
    } catch (error) {
        console.error('Error toggling extension:', error);
    }
});

// Set initial icon state when extension loads
chrome.runtime.onStartup.addListener(async () => {
    const result = await chrome.storage.local.get(['enabled']);
    const isEnabled = result.enabled !== undefined ? result.enabled : true;
    await updateIcon(isEnabled);
});

chrome.runtime.onInstalled.addListener(async () => {
    const result = await chrome.storage.local.get(['enabled']);
    const isEnabled = result.enabled !== undefined ? result.enabled : true;
    await updateIcon(isEnabled);
});
