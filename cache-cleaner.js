/**
 * Cache Cleaner with Version Control
 * 
 * This script cleans all browser caches (localStorage, sessionStorage, 
 * cookies, application cache, service workers, and browser cache)
 * when the version_check value is not found.
 * 
 * @version 1.0.0
 */

(function() {
  'use strict';

  // Configuration
  const VERSION = 'V2.1'; // Change this value to trigger cleaning on next visit
  const VERSION_KEY = 'version_check';
  const DEBUG = false; // Set to true for console logging

  /**
   * Main CacheCleaner class
   */
  class CacheCleaner {
    constructor(version, versionKey) {
      this.version = version;
      this.versionKey = versionKey;
      this.cleaningCompleted = false;
    }

    /**
     * Check if cache cleaning is needed
     * @returns {boolean} True if cleaning is needed
     */
    needsCleaning() {
      const storedVersion = localStorage.getItem(this.versionKey);
      return !storedVersion || storedVersion !== this.version;
    }

    /**
     * Log messages if debug mode is enabled
     * @param {string} message - Message to log
     */
    log(message) {
      if (DEBUG) {
        console.log(`CacheCleaner: ${message}`);
      }
    }

    /**
     * Clean all caches without any UI feedback
     * @returns {Promise} Promise that resolves when all cleaning is done
     */
    async cleanSilently() {
      if (!this.needsCleaning()) {
        this.log('Cleaning not needed - version is current');
        return Promise.resolve(false);
      }

      try {
        await this.performFullCacheCleaning();
        localStorage.setItem(this.versionKey, this.version);
        this.cleaningCompleted = true;
        this.log('Silent cleaning completed successfully');
        return Promise.resolve(true);
      } catch (error) {
        this.log(`Error during silent cleaning: ${error.message}`);
        return Promise.reject(error);
      }
    }

    /**
     * Clean caches with UI feedback in the specified DOM element
     * @param {string} elementId - ID of the DOM element to show messages
     * @returns {Promise} Promise that resolves when cleaning is done
     */
    async cleanWithUI(elementId) {
      const targetElement = document.getElementById(elementId);
      
      if (!targetElement) {
        this.log(`Target element with ID "${elementId}" not found`);
        return Promise.reject(new Error(`Element with ID "${elementId}" not found`));
      }

      if (!this.needsCleaning()) {
        this.log('Cleaning not needed - version is current');
        return Promise.resolve(false);
      }

      try {
        // Create and append UI elements
        this.createUIElements(targetElement);
        
        // Wait a moment to ensure loader is visible
        await this.delay(100);
        
        // Perform actual cache cleaning
        await this.performFullCacheCleaning();
        
        // Update UI to show completion
        this.updateUIForCompletion(targetElement);
        
        // Update stored version
        localStorage.setItem(this.versionKey, this.version);
        this.cleaningCompleted = true;
        
        this.log('UI cleaning completed successfully');
        return Promise.resolve(true);
      } catch (error) {
        if (targetElement) {
          targetElement.innerHTML = `<div class="cache-cleaner-error">Önbellek temizleme sırasında bir hata oluştu.</div>`;
        }
        this.log(`Error during UI cleaning: ${error.message}`);
        return Promise.reject(error);
      }
    }

    /**
     * Create UI elements for the cleaning process
     * @param {HTMLElement} targetElement - DOM element to append UI to
     */
    createUIElements(targetElement) {
      // Add styles
      if (!document.getElementById('cache-cleaner-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'cache-cleaner-styles';
        styleElement.textContent = `
          .cache-cleaner-container {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            margin: 0 auto;
          }
          .cache-cleaner-spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #3498db;
            width: 40px;
            height: 40px;
            margin: 0 auto 20px;
            animation: cache-cleaner-spin 1s linear infinite;
          }
          @keyframes cache-cleaner-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .cache-cleaner-message {
            font-size: 18px;
            color: #333;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
          }
          .cache-cleaner-message.active {
            opacity: 1;
            transform: translateY(0);
          }
          .cache-cleaner-error {
            color: #e74c3c;
            font-weight: bold;
          }
          .cache-cleaner-version {
            font-weight: bold;
            color: #2980b9;
          }
        `;
        document.head.appendChild(styleElement);
      }

      // Create container
      const container = document.createElement('div');
      container.className = 'cache-cleaner-container';
      
      // Create spinner
      const spinner = document.createElement('div');
      spinner.className = 'cache-cleaner-spinner';
      
      // Create message element
      const message = document.createElement('div');
      message.className = 'cache-cleaner-message';
      message.innerHTML = 'Önbellek temizleniyor, lütfen bekleyin...';
      
      // Append elements
      container.appendChild(spinner);
      container.appendChild(message);
      targetElement.innerHTML = '';
      targetElement.appendChild(container);
      
      // Activate message with animation
      setTimeout(() => {
        message.classList.add('active');
      }, 100);
    }

    /**
     * Update UI elements to show completion
     * @param {HTMLElement} targetElement - DOM element containing UI
     */
    updateUIForCompletion(targetElement) {
      const container = targetElement.querySelector('.cache-cleaner-container');
      if (!container) return;
      
      const spinner = container.querySelector('.cache-cleaner-spinner');
      const message = container.querySelector('.cache-cleaner-message');
      
      if (spinner) {
        // Change spinner to checkmark or remove it
        spinner.style.animation = 'none';
        spinner.style.border = 'none';
        spinner.innerHTML = '✓';
        spinner.style.fontSize = '30px';
        spinner.style.color = '#2ecc71';
        spinner.style.width = 'auto';
        spinner.style.height = 'auto';
      }
      
      if (message) {
        message.classList.remove('active');
        setTimeout(() => {
          message.innerHTML = `<span class="cache-cleaner-version">${this.version}</span> versiyonuna geçiş için tüm önbellekler temizlendi`;
          message.classList.add('active');
        }, 300);
      }
    }

    /**
     * Perform the actual cache cleaning operations
     * @returns {Promise} Promise that resolves when all cleaning is done
     */
    async performFullCacheCleaning() {
      this.log('Starting full cache cleaning process');
      
      try {
        // Clear localStorage (except our version key temporarily)
        this.clearLocalStorage();
        
        // Clear sessionStorage
        this.clearSessionStorage();
        
        // Clear cookies
        this.clearCookies();
        
        // Clear Application Cache (if available)
        await this.clearApplicationCache();
        
        // Clear Service Workers
        await this.clearServiceWorkers();
        
        // Clear Browser Cache using various techniques
        await this.clearBrowserCache();
        
        this.log('All cache cleaning operations completed');
        return Promise.resolve();
      } catch (error) {
        this.log(`Error during cache cleaning: ${error.message}`);
        return Promise.reject(error);
      }
    }

    /**
     * Clear localStorage (preserving version key until the end)
     */
    clearLocalStorage() {
      // Save our version key temporarily
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key !== this.versionKey) {
          localStorage.removeItem(key);
        }
      }
      this.log('LocalStorage cleared');
    }

    /**
     * Clear sessionStorage completely
     */
    clearSessionStorage() {
      sessionStorage.clear();
      this.log('SessionStorage cleared');
    }

    /**
     * Clear all browser cookies
     */
    clearCookies() {
      const cookies = document.cookie.split(';');
      
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
      
      // Additional attempt to clear cookies for all paths and domains
      const domain = window.location.hostname;
      const domainParts = domain.split('.');
      
      // Try clearing cookies at all domain levels
      while (domainParts.length > 1) {
        const currentDomain = domainParts.join('.');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${currentDomain}`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${currentDomain}`;
        }
        domainParts.shift();
      }
      
      this.log('Cookies cleared');
    }

    /**
     * Clear application cache if available
     * @returns {Promise} Promise that resolves when completed
     */
    async clearApplicationCache() {
      return new Promise(resolve => {
        if (window.applicationCache) {
          try {
            window.applicationCache.addEventListener('obsolete', () => {
              this.log('Application Cache cleared');
              resolve();
            });
            
            window.applicationCache.update();
          } catch (e) {
            this.log('Application Cache clearing failed or not supported');
            resolve();
          }
        } else {
          this.log('Application Cache not available');
          resolve();
        }
      });
    }

    /**
     * Clear all registered service workers
     * @returns {Promise} Promise that resolves when completed
     */
    async clearServiceWorkers() {
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          const unregisterPromises = registrations.map(registration => registration.unregister());
          await Promise.all(unregisterPromises);
          this.log(`${registrations.length} Service Workers unregistered`);
        } catch (error) {
          this.log(`Error clearing Service Workers: ${error.message}`);
        }
      } else {
        this.log('Service Workers not supported');
      }
      return Promise.resolve();
    }

    /**
     * Clear browser cache using various techniques
     * @returns {Promise} Promise that resolves when completed
     */
    async clearBrowserCache() {
      // Attempt to clear cache via Cache API
      if ('caches' in window) {
        try {
          const cacheNames = await window.caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => window.caches.delete(cacheName))
          );
          this.log(`${cacheNames.length} browser caches cleared via Cache API`);
        } catch (error) {
          this.log(`Error clearing Cache API: ${error.message}`);
        }
      }
      
      // Attempt to reload with cache busting for current page
      // Add a temporary iframe with cache-busting parameters
      // This forces the browser to refetch assets
      const frame = document.createElement('iframe');
      const cacheBuster = `?cache=${Date.now()}`;
      
      // Set a non-visible iframe
      frame.style.display = 'none';
      frame.src = `about:blank${cacheBuster}`;
      
      // Create a promise that resolves when iframe loads
      return new Promise(resolve => {
        frame.onload = () => {
          // Once loaded, try to force reload important assets with cache busting
          this.forceCacheBusting();
          
          // Remove the iframe after a delay
          setTimeout(() => {
            if (frame.parentNode) {
              frame.parentNode.removeChild(frame);
            }
            this.log('Browser cache clearing techniques applied');
            resolve();
          }, 500);
        };
        
        document.body.appendChild(frame);
      });
    }

    /**
     * Force cache busting by reloading important assets
     */
    forceCacheBusting() {
      // Find all CSS links and reload with cache busting
      const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
      cssLinks.forEach(link => {
        const url = new URL(link.href, window.location.href);
        url.searchParams.set('_cache', Date.now());
        
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = url.toString();
        newLink.onload = () => {
          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
        };
        document.head.appendChild(newLink);
      });
      
      // Find and reload important scripts
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        if (!script.src || script.src.includes('cache-cleaner') || script.hasAttribute('data-no-cache-bust')) {
          return; // Skip our own script or scripts marked to not cache bust
        }
        
        const url = new URL(script.src, window.location.href);
        url.searchParams.set('_cache', Date.now());
        
        const newScript = document.createElement('script');
        newScript.src = url.toString();
        document.head.appendChild(newScript);
        // We don't remove the original script as that could break functionality
      });
      
      // Reload images with cache busting (only those visible in viewport for performance)
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (this.isInViewport(img) && img.src && !img.src.startsWith('data:')) {
          const originalSrc = img.src;
          const url = new URL(originalSrc, window.location.href);
          url.searchParams.set('_cache', Date.now());
          img.src = url.toString();
        }
      });
    }

    /**
     * Check if an element is in the viewport
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if element is in viewport
     */
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    /**
     * Helper method for creating delays
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise} Promise that resolves after the delay
     */
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  // Create and expose the cleaner instance
  const cacheCleaner = new CacheCleaner(VERSION, VERSION_KEY);

  // Add to window object for external access
  window.cacheCleaner = {
    /**
     * Clean all caches silently without UI
     * @returns {Promise<boolean>} Promise resolving to true if cleaning occurred
     */
    cleanSilently: function() {
      return cacheCleaner.cleanSilently();
    },
    
    /**
     * Clean caches with UI feedback in specified element
     * @param {string} elementId - ID of DOM element to show cleaning UI
     * @returns {Promise<boolean>} Promise resolving to true if cleaning occurred
     */
    cleanWithUI: function(elementId) {
      return cacheCleaner.cleanWithUI(elementId);
    },
    
    /**
     * Check if cleaning was completed in this session
     * @returns {boolean} True if cleaning was completed
     */
    wasCleaningPerformed: function() {
      return cacheCleaner.cleaningCompleted;
    },
    
    /**
     * Change version to trigger cleaning on next visit
     * @param {string} newVersion - New version string
     */
    updateVersion: function(newVersion) {
      cacheCleaner.version = newVersion;
      localStorage.setItem(VERSION_KEY, newVersion);
    }
  };

  // Auto-run silent cleaning when script loads
  cacheCleaner.cleanSilently().catch(error => {
    if (DEBUG) {
      console.error('CacheCleaner auto-run error:', error);
    }
  });
})();
