/**
 * Clipboard utility with safe error handling
 */

interface ClipboardResult {
  success: boolean;
  error?: string;
}

/**
 * Safely copy text to clipboard with fallbacks
 */
export async function copyToClipboard(text: string): Promise<ClipboardResult> {
  try {
    // Modern clipboard API (preferred)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    }

    // Fallback for older browsers or non-secure contexts
    return copyToClipboardFallback(text);
  } catch (error) {
    console.warn('Clipboard API failed, trying fallback:', error);
    return copyToClipboardFallback(text);
  }
}

/**
 * Fallback method using document.execCommand (deprecated but widely supported)
 */
function copyToClipboardFallback(text: string): ClipboardResult {
  try {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = text;
    
    // Styling to make it invisible
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    
    document.body.appendChild(textarea);
    
    // Focus and select the text
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    
    // Execute copy command
    const successful = document.execCommand('copy');
    
    // Clean up
    document.body.removeChild(textarea);
    
    if (successful) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: 'Failed to copy using fallback method' 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: `Fallback copy failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Read text from clipboard safely
 */
export async function readFromClipboard(): Promise<{ success: boolean; text?: string; error?: string }> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      const text = await navigator.clipboard.readText();
      return { success: true, text };
    }
    
    return { 
      success: false, 
      error: 'Clipboard read not supported in this environment' 
    };
  } catch (error) {
    return { 
      success: false, 
      error: `Failed to read from clipboard: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Check if clipboard operations are supported
 */
export function isClipboardSupported(): boolean {
  try {
    return (
      (navigator.clipboard && window.isSecureContext) ||
      document.queryCommandSupported?.('copy') === true
    );
  } catch {
    return false;
  }
}

/**
 * Show user feedback for clipboard operations
 */
export function showClipboardFeedback(result: ClipboardResult, options?: {
  successMessage?: string;
  errorMessage?: string;
  duration?: number;
}) {
  const {
    successMessage = 'Copied to clipboard!',
    errorMessage = 'Failed to copy to clipboard',
    duration = 3000
  } = options || {};

  if (result.success) {
    console.log(successMessage);
    // You can integrate with a toast library here
    showToast(successMessage, 'success');
  } else {
    console.error(errorMessage, result.error);
    showToast(`${errorMessage}: ${result.error}`, 'error');
  }
}

/**
 * Simple toast notification (you can replace this with your preferred toast library)
 */
function showToast(message: string, type: 'success' | 'error', duration = 3000) {
  // Create toast element
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    font-family: system-ui, -apple-system, sans-serif;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  // Remove after duration
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
} 