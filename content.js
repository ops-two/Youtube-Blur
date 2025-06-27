// YouTube Thumbnail Blur & Shorts Block Extension
// Simplified version with icon toggle only

(function() {
    'use strict';
    
    // Check if extension is enabled
    chrome.storage.local.get(['enabled'], (result) => {
        const isEnabled = result.enabled !== undefined ? result.enabled : true;
        
        if (!isEnabled) {
            return; // Exit if extension is disabled
        }
        
        // Initialize the extension
        init();
    });
    
    function init() {
        // Apply styles immediately
        injectStyles();
        
        // Start thumbnail blurring
        blurThumbnails();
        
        // Start shorts blocking
        setupShortsBlocking();
        
        // Setup observers
        setupObservers();
    }
    
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Thumbnail blur styles */
            #contents ytd-rich-item-renderer img,
            #contents ytd-video-renderer img,
            #contents ytd-compact-video-renderer img,
            #contents ytd-grid-video-renderer img,
            .ytd-thumbnail img,
            .ytp-videowall-still-image,
            .ytp-ce-covering-overlay img,
            .ytp-ce-video-title-bg img,
            #secondary ytd-compact-video-renderer img,
            #secondary ytd-video-renderer img,
            #related #contents img,
            .ytd-watch-next-secondary-results-renderer img,
            ytd-reel-item-renderer img,
            ytd-rich-shelf-renderer img,
            #shorts-container img,
            .compact-media-item img,
            .media-item img,
            .video-thumb img,
            img[src*="ytimg.com"],
            img[src*="youtube.com/vi/"],
            img[src*="youtu.be"] {
                filter: blur(25px) !important;
                transition: filter 0.3s ease !important;
            }
            
            /* Hide Shorts elements */
            a[href*="/shorts/"]:not(.shorts-convert-button),
            ytd-reel-shelf-renderer,
            ytm-reel-shelf-renderer,
            ytd-guide-entry-renderer a[href="/shorts"],
            ytm-pivot-bar-item-renderer a[href="/shorts"],
            tp-yt-app-drawer a[href="/shorts"],
            [tab-identifier="FEshorts"],
            ytd-mini-guide-entry-renderer a[href="/shorts"] {
                display: none !important;
            }
            
            /* Convert button styling */
            .shorts-convert-button {
                position: fixed !important;
                top: 20px !important;
                right: 20px !important;
                z-index: 9999 !important;
                background: rgba(0, 0, 0, 0.8) !important;
                color: white !important;
                padding: 12px 16px !important;
                border-radius: 8px !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                font-size: 14px !important;
                font-weight: 500 !important;
                backdrop-filter: blur(10px) !important;
                border: 1px solid rgba(255, 255, 255, 0.2) !important;
                transition: all 0.2s ease !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            }
            
            .shorts-convert-button:hover {
                background: rgba(255, 255, 255, 0.1) !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4) !important;
            }
        `;
        
        // Insert styles into head
        if (document.head) {
            document.head.appendChild(style);
        } else {
            // If head doesn't exist yet, wait and try again
            setTimeout(() => {
                if (document.head) {
                    document.head.appendChild(style);
                }
            }, 100);
        }
    }
    
    function blurThumbnails() {
        const selectors = [
            '#contents ytd-rich-item-renderer img',
            '#contents ytd-video-renderer img',
            '#contents ytd-compact-video-renderer img',
            '#contents ytd-grid-video-renderer img',
            '.ytd-thumbnail img',
            '#secondary ytd-compact-video-renderer img',
            '#secondary ytd-video-renderer img',
            '#related #contents img',
            '.ytd-watch-next-secondary-results-renderer img',
            '#contents ytd-video-renderer img',
            '#contents ytd-channel-renderer img',
            'ytd-reel-item-renderer img',
            'ytd-rich-shelf-renderer img',
            '#shorts-container img',
            '.compact-media-item img',
            '.media-item img',
            '.video-thumb img',
            'img[src*="ytimg.com"]',
            'img[src*="youtube.com/vi/"]',
            'img[src*="youtu.be"]'
        ];
        
        selectors.forEach(selector => {
            const images = document.querySelectorAll(selector);
            images.forEach(img => {
                if (!img.classList.contains('blur-applied')) {
                    img.style.filter = 'blur(25px)';
                    img.style.transition = 'filter 0.3s ease';
                    img.classList.add('blur-applied');
                }
            });
        });
    }
    
    function setupShortsBlocking() {
        // URL redirection
        if (window.location.href.includes('/shorts/')) {
            const videoId = window.location.pathname.split('/shorts/')[1]?.split('?')[0];
            if (videoId) {
                window.location.replace(`https://www.youtube.com/watch?v=${videoId}`);
                return;
            }
        }
        
        // Remove shorts elements
        removeShortsElements();
        
        // Add convert button if on shorts page
        if (window.location.href.includes('/shorts/')) {
            addConvertButton();
        }
    }
    
    function removeShortsElements() {
        const shortsSelectors = [
            'ytd-reel-shelf-renderer',
            'ytm-reel-shelf-renderer',
            'a[href*="/shorts/"]:not(.shorts-convert-button)',
            'ytd-rich-shelf-renderer[is-shorts]',
            '[href="/shorts"]'
        ];
        
        shortsSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
    }
    
    function addConvertButton() {
        if (document.querySelector('.shorts-convert-button')) return;
        
        const videoId = window.location.pathname.split('/shorts/')[1]?.split('?')[0];
        if (!videoId) return;
        
        const button = document.createElement('div');
        button.className = 'shorts-convert-button';
        button.innerHTML = '📺 Watch in Normal Player';
        button.onclick = () => {
            window.location.href = `https://www.youtube.com/watch?v=${videoId}`;
        };
        
        document.body.appendChild(button);
    }
    
    function setupObservers() {
        // Main observer for dynamic content
        const mainObserver = new MutationObserver((mutations) => {
            let shouldProcess = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'IMG' || node.querySelector('img') || 
                                node.querySelector('a[href*="/shorts/"]') ||
                                node.querySelector('ytd-reel-shelf-renderer, ytm-reel-shelf-renderer')) {
                                shouldProcess = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldProcess) {
                setTimeout(() => {
                    blurThumbnails();
                    removeShortsElements();
                }, 100);
            }
        });
        
        // Start observer when body is available
        function startMainObserver() {
            if (document.body) {
                mainObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            } else {
                setTimeout(startMainObserver, 100);
            }
        }
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startMainObserver);
        } else {
            startMainObserver();
        }
        
        // Periodic checks
        setInterval(() => {
            blurThumbnails();
            removeShortsElements();
        }, 2000);
    }
})();
