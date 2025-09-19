// utils/adScriptManager.ts

interface ScriptInfo {
  id: string;
  placement: string;
  type: 'adsense' | 'custom';
  element: HTMLScriptElement;
}

class AdScriptManager {
  private scripts: Map<string, ScriptInfo> = new Map();

  /**
   * Execute a script with proper isolation and conflict prevention
   */
  executeScript(
    scriptContent: string,
    adId: string,
    placement: string,
    isAdSense: boolean = false
  ): void {
    const scriptId = `${adId}-${placement}-${Date.now()}`;
    
    // Remove any existing scripts for this ad/placement combination
    this.cleanupScripts(adId, placement);

    const newScript = document.createElement("script");
    const scriptType = isAdSense ? 'adsense' : 'custom';

    if (isAdSense) {
      // For AdSense, execute directly but with error handling
      newScript.textContent = `
        try {
          ${scriptContent}
        } catch (error) {
          console.warn('AdSense script error for ad ${adId}:', error);
        }
      `;
    } else {
      // For other scripts, wrap in IIFE to avoid variable conflicts
      newScript.textContent = `
        (function() {
          try {
            ${scriptContent}
          } catch (error) {
            console.warn('Ad script error for ad ${adId}:', error);
          }
        })();
      `;
    }

    // Add unique attributes
    newScript.setAttribute("data-ad-script-id", scriptId);
    newScript.setAttribute("data-ad-id", adId);
    newScript.setAttribute("data-ad-placement", placement);
    newScript.setAttribute("data-ad-type", scriptType);

    // Store script info
    this.scripts.set(scriptId, {
      id: scriptId,
      placement,
      type: scriptType,
      element: newScript
    });

    // Append to head
    document.head.appendChild(newScript);

    // For AdSense, trigger the push
    if (isAdSense && window.adsbygoogle) {
      setTimeout(() => {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (error) {
          console.error("AdSense push error:", error);
        }
      }, 100);
    }
  }

  /**
   * Clean up scripts for a specific ad/placement
   */
  cleanupScripts(adId?: string, placement?: string): void {
    const scriptsToRemove: string[] = [];

    this.scripts.forEach((scriptInfo, scriptId) => {
      const shouldRemove = 
        (!adId || scriptInfo.id.includes(adId)) &&
        (!placement || scriptInfo.placement === placement);

      if (shouldRemove) {
        scriptInfo.element.remove();
        scriptsToRemove.push(scriptId);
      }
    });

    scriptsToRemove.forEach(scriptId => {
      this.scripts.delete(scriptId);
    });
  }

  /**
   * Clean up all scripts
   */
  cleanupAll(): void {
    this.scripts.forEach((scriptInfo) => {
      scriptInfo.element.remove();
    });
    this.scripts.clear();
  }

  /**
   * Get script count for debugging
   */
  getScriptCount(): number {
    return this.scripts.size;
  }
}

// Export singleton instance
export const adScriptManager = new AdScriptManager();

// Clean up on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    adScriptManager.cleanupAll();
  });
}

