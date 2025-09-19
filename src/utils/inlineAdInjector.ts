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

  // Sort ads by positionOffset to inject them in the correct order
  const sortedAds = inlineAds
    .filter((ad) => ad.positionOffset > 0)
    .sort((a, b) => a.positionOffset - b.positionOffset);

  let modifiedContent = content;
  let offsetAdjustment = 0; // Track how much the content has grown due to previous injections

  sortedAds.forEach((ad, index) => {
    // Calculate word position, accounting for previous ad injections
    const targetPosition = ad.positionOffset + offsetAdjustment;

    // Split content into words
    const words = modifiedContent.split(/(\s+)/);
    let currentWordCount = 0;
    let insertionIndex = 0;

    // Find the insertion point - look for sentence boundaries to avoid cutting words
    let bestInsertionIndex = 0;
    let foundGoodPosition = false;

    for (let i = 0; i < words.length; i++) {
      if (words[i].trim()) {
        currentWordCount++;
      }
      if (currentWordCount >= targetPosition) {
        // Look for a good insertion point (after sentence endings)
        for (let j = i; j < Math.min(i + 10, words.length); j++) {
          if (
            words[j].includes(".") ||
            words[j].includes("!") ||
            words[j].includes("?") ||
            words[j].includes("</p>") ||
            words[j].includes("</div>") ||
            words[j].includes("<br")
          ) {
            bestInsertionIndex = j + 1;
            foundGoodPosition = true;
            break;
          }
        }

        // If no good position found, use the target position
        if (!foundGoodPosition) {
          bestInsertionIndex = i + 1;
        }
        break;
      }
    }

    // If we haven't found any position, append at the end
    if (bestInsertionIndex === 0) {
      bestInsertionIndex = words.length;
    }

    insertionIndex = bestInsertionIndex;

    // Create the ad HTML with proper styling
    const adHtml = `
      <div class="inline-ad-container" data-ad-id="${ad.id}" data-ad-placement="INLINE" data-ad-index="${index}" style="margin: 20px 0; text-align: center;">
        ${ad.codeSnippet}
      </div>
    `;

    // Insert the ad
    words.splice(insertionIndex, 0, adHtml);

    // Update the content
    modifiedContent = words.join("");

    // Adjust offset for next ad (approximate word count of injected ad)
    offsetAdjustment += Math.max(5, Math.floor(ad.codeSnippet.split(" ").length / 2));
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
