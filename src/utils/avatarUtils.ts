/**
 * Utility functions for handling avatar URLs and fallbacks
 */

export const DEFAULT_AVATAR_PATH = "/icons/author-avatar.svg";

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
  target.src = DEFAULT_AVATAR_PATH;
}

/**
 * Check if an avatar URL is valid (not null, undefined, or empty)
 * @param avatarUrl - The avatar URL to check
 * @returns True if the avatar URL is valid
 */
export function isValidAvatarUrl(avatarUrl?: string | null): boolean {
  return Boolean(avatarUrl && avatarUrl.trim() !== "");
}
