// utils/inlineAdInjector.ts

import { useTenantAds } from "@/src/hooks/public/useTenantAds";
import { useCurrentTenant } from "@/src/hooks/public/useCurrentTenant";
import { TenantAdPlacement } from "@/src/types/tenantAds";

/**
 * Utility function to inject inline ads into blog content
 * Based on the positionOffset field, ads are injected after a certain number of words
 */
export function injectInlineAdsIntoContent(
  content: string,
  inlineAds: Array<{
    id: string;
    codeSnippet: string;
    positionOffset: number;
    appearance: string;
  }>,
): string {
  if (!inlineAds || inlineAds.length === 0) {
    return content;
  }

  // Sort by requested offsets
  const sortedAds = inlineAds
    .filter((ad) => ad.positionOffset > 0)
    .sort((a, b) => a.positionOffset - b.positionOffset);

  // Measure content length in words (approximate)
  const baseTokens = content.split(/(\s+)/);
  const totalWordCount = baseTokens.reduce((acc, t) => (t.trim() ? acc + 1 : acc), 0);

  // Smart detection: prevent ads from clustering together
  const MIN_GAP_WORDS = Math.max(80, Math.floor(totalWordCount * 0.15)); // 15% of content or 80 words minimum
  const maxAdsAllowed = Math.max(1, Math.floor(totalWordCount / (MIN_GAP_WORDS + 40)));

  const adsToPlace = sortedAds.slice(0, maxAdsAllowed);

  // Dynamic gap calculation based on content length and number of ads
  const idealGap =
    adsToPlace.length > 1
      ? Math.floor(totalWordCount / (adsToPlace.length + 1))
      : Math.floor(totalWordCount * 0.3); // Single ad goes at 30% of content

  let modifiedContent = content;

  adsToPlace.forEach((ad, index) => {
    // Smart distribution: prevent clustering by ensuring minimum spacing
    let distributedTarget;

    if (adsToPlace.length === 1) {
      // Single ad: place at 30% of content
      distributedTarget = Math.floor(totalWordCount * 0.3);
    } else {
      // Multiple ads: distribute evenly with smart spacing
      const basePosition = (index + 1) * idealGap;
      const requestedPosition = ad.positionOffset;

      // Use the requested position if it's reasonable, otherwise use distributed position
      const isRequestedPositionValid =
        requestedPosition >= index * MIN_GAP_WORDS &&
        requestedPosition <= totalWordCount - (adsToPlace.length - index - 1) * MIN_GAP_WORDS;

      distributedTarget = isRequestedPositionValid ? requestedPosition : basePosition;
    }

    const words = modifiedContent.split(/(\s+)/);
    let currentWordCount = 0;
    let bestInsertionIndex = 0;

    for (let i = 0; i < words.length; i++) {
      if (words[i].trim()) currentWordCount++;
      if (currentWordCount >= distributedTarget) {
        // Snap to nearby boundary so we don't split HTML
        let found = false;
        for (let j = i; j < Math.min(i + 12, words.length); j++) {
          const token = words[j];
          if (
            token.includes(".") ||
            token.includes("!") ||
            token.includes("?") ||
            token.includes("</p>") ||
            token.includes("</div>") ||
            token.includes("<br")
          ) {
            bestInsertionIndex = j + 1;
            found = true;
            break;
          }
        }
        if (!found) bestInsertionIndex = i + 1;
        break;
      }
    }

    if (bestInsertionIndex === 0) {
      // Middle fallback if the content is very short
      bestInsertionIndex = Math.floor(words.length / 2);
    }

    const adHtml = `
      <div class="inline-ad-container" data-ad-id="${ad.id}" data-ad-placement="INLINE" data-ad-index="${index}" style="margin: 20px 0; text-align: center;">
        ${ad.codeSnippet}
      </div>
    `;

    words.splice(bestInsertionIndex, 0, adHtml);
    modifiedContent = words.join("");
  });

  return modifiedContent;
}

/**
 * Hook to get inline ads for a specific blog
 */
export function useInlineAds(blogId?: string) {
  const currentTenant = useCurrentTenant();

  const { data: adsByPlacement } = useTenantAds(
    "blog",
    [TenantAdPlacement.INLINE],
    currentTenant,
    blogId,
  );

  const inlineAds = adsByPlacement?.[TenantAdPlacement.INLINE] || [];

  // Filter and prepare inline ads with positionOffset
  const preparedAds = inlineAds
    .filter((ad) => ad.isEnabled && ad.codeSnippet && ad.positionOffset)
    .map((ad) => ({
      id: ad.id,
      codeSnippet: ad.codeSnippet,
      positionOffset: ad.positionOffset || 0,
      appearance: ad.appearance,
    }));

  return preparedAds;
}
