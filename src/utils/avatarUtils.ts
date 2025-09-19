/**
 * Utility functions for handling avatar URLs and fallbacks
 */

export const DEFAULT_AVATAR_PATH = "/icons/author-avatar.png";

/**
 * Get the avatar URL with fallback to default avatar
 * @param avatarUrl - The user's avatar URL (can be null/undefined)
 * @returns The avatar URL or default avatar path
 */
export function getAvatarUrl(avatarUrl?: string | null): string {
  return avatarUrl || DEFAULT_AVATAR_PATH;
}

/**
 * Handle avatar image error by setting fallback
 * @param event - The error event from the image element
 */
export function handleAvatarError(event: React.SyntheticEvent<HTMLImageElement, Event>): void {
  const target = event.target as HTMLImageElement;

  // Prevent infinite loops by checking if we're already trying to load the fallback
  if (target.src.includes("author-avatar.svg") || target.src.includes("author-avatar.png")) {
    // If we're already on the fallback and it failed, show a placeholder
    target.style.display = "none";
    return;
  }

  // Set to fallback avatar (try PNG first, then SVG)
  target.src = "/icons/author-avatar.png";
}

/**
 * Universal icon error handler to prevent infinite loops
 * @param event - The error event from the image element
 * @param fallbackSrc - Optional fallback source
 */
export function handleIconError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string,
): void {
  const target = event.target as HTMLImageElement;

  // Prevent infinite loops by checking if we're already trying to load the fallback
  if (target.src.includes(fallbackSrc || "") || target.dataset.retryCount === "1") {
    // If we're already on the fallback and it failed, show a placeholder
    target.style.display = "none";
    return;
  }

  // Mark that we've tried a fallback
  target.dataset.retryCount = "1";

  // Set to fallback if provided
  if (fallbackSrc) {
    target.src = fallbackSrc;
  } else {
    // Hide the element if no fallback is provided
    target.style.display = "none";
  }
}

/**
 * Check if an avatar URL is valid (not null, undefined, or empty)
 * @param avatarUrl - The avatar URL to check
 * @returns True if the avatar URL is valid
 */
export function isValidAvatarUrl(avatarUrl?: string | null): boolean {
  return Boolean(avatarUrl && avatarUrl.trim() !== "");
}
