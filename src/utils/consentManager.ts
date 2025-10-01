// src/utils/consentManager.ts

import React from "react";

export interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  necessary: boolean;
  timestamp: number;
  version: string;
}

export interface ConsentConfig {
  requiresConsent?: boolean;
  consentTypes?: string[];
  gdprApplies?: boolean;
  ccpaApplies?: boolean;
}

class ConsentManager {
  private static instance: ConsentManager;
  private consentState: ConsentState | null = null;
  private listeners: ((consent: ConsentState) => void)[] = [];
  private storageKey = "tenant_ad_consent";
  private consentVersion = "1.0";

  private constructor() {
    this.loadConsentFromStorage();
  }

  public static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager();
    }
    return ConsentManager.instance;
  }

  private loadConsentFromStorage(): void {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if consent version is current
        if (parsed.version === this.consentVersion) {
          this.consentState = parsed;
        }
      }
    } catch (error) {
      console.warn("Failed to load consent from storage:", error);
    }
  }

  private saveConsentToStorage(): void {
    if (typeof window === "undefined" || !this.consentState) return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.consentState));
    } catch (error) {
      console.warn("Failed to save consent to storage:", error);
    }
  }

  public getConsent(): ConsentState | null {
    return this.consentState;
  }

  public setConsent(consent: Partial<ConsentState>): void {
    this.consentState = {
      analytics: consent.analytics ?? false,
      marketing: consent.marketing ?? false,
      functional: consent.functional ?? true,
      necessary: true, // Always true
      timestamp: Date.now(),
      version: this.consentVersion,
    };

    this.saveConsentToStorage();
    this.notifyListeners();
  }

  public hasConsent(type: string): boolean {
    if (!this.consentState) return false;

    switch (type.toLowerCase()) {
      case "analytics":
        return this.consentState.analytics;
      case "marketing":
        return this.consentState.marketing;
      case "functional":
        return this.consentState.functional;
      case "necessary":
        return this.consentState.necessary;
      default:
        return false;
    }
  }

  public canShowAd(config?: ConsentConfig): boolean {
    // If no consent config, allow the ad
    if (!config?.requiresConsent) return true;

    // If no consent state and consent is required, deny
    if (!this.consentState) return false;

    // Check if all required consent types are granted
    const requiredTypes = config.consentTypes || ["marketing"];
    return requiredTypes.every((type) => this.hasConsent(type));
  }

  public isConsentRequired(): boolean {
    if (typeof window === "undefined") return false;

    // Check if we're in a GDPR region (simplified check)
    const isEU = this.isEURegion();
    const isCCPA = this.isCCPARegion();

    return isEU || isCCPA;
  }

  private isEURegion(): boolean {
    // Simplified EU detection - in production, use a proper geolocation service
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const euTimezones = [
      "Europe/London",
      "Europe/Berlin",
      "Europe/Paris",
      "Europe/Rome",
      "Europe/Madrid",
      "Europe/Amsterdam",
      "Europe/Brussels",
      "Europe/Vienna",
      "Europe/Prague",
      "Europe/Warsaw",
      "Europe/Stockholm",
      "Europe/Helsinki",
      "Europe/Copenhagen",
      "Europe/Oslo",
      "Europe/Dublin",
      "Europe/Lisbon",
      "Europe/Athens",
      "Europe/Budapest",
      "Europe/Bucharest",
      "Europe/Sofia",
      "Europe/Zagreb",
      "Europe/Ljubljana",
      "Europe/Bratislava",
      "Europe/Vilnius",
      "Europe/Riga",
      "Europe/Tallinn",
      "Europe/Malta",
      "Europe/Nicosia",
    ];

    return euTimezones.includes(timezone);
  }

  private isCCPARegion(): boolean {
    // Simplified CCPA detection - in production, use a proper geolocation service
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
      timezone.includes("America/Los_Angeles") ||
      timezone.includes("America/San_Francisco") ||
      timezone.includes("America/Sacramento")
    );
  }

  public addConsentListener(callback: (consent: ConsentState) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    if (this.consentState) {
      this.listeners.forEach((callback) => {
        try {
          callback(this.consentState!);
        } catch (error) {
          console.warn("Error in consent listener:", error);
        }
      });
    }
  }

  public showConsentBanner(): void {
    // This would trigger the consent banner UI
    // For now, we'll just set default functional consent
    if (!this.consentState && this.isConsentRequired()) {
      this.setConsent({
        analytics: true, // Default to true for better user experience
        marketing: false,
        functional: true,
      });
    }
  }

  public clearConsent(): void {
    this.consentState = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.storageKey);
    }
    this.notifyListeners();
  }

  // IAB TCF v2 compatibility (basic implementation)
  public getTCString(): string {
    // This would return the actual TCF consent string in a real implementation
    // For now, return a basic consent string
    if (!this.consentState) return "";

    const purposes = [];
    if (this.consentState.analytics) purposes.push("1");
    if (this.consentState.marketing) purposes.push("2", "3", "4");
    if (this.consentState.functional) purposes.push("5");

    return `TC:${purposes.join(",")}:${this.consentState.timestamp}`;
  }
}

export const consentManager = ConsentManager.getInstance();

// React hook for using consent in components
export function useConsent() {
  const [consent, setConsent] = React.useState<ConsentState | null>(consentManager.getConsent());

  React.useEffect(() => {
    const unsubscribe = consentManager.addConsentListener(setConsent);
    return unsubscribe;
  }, []);

  return {
    consent,
    hasConsent: (type: string) => consentManager.hasConsent(type),
    canShowAd: (config?: ConsentConfig) => consentManager.canShowAd(config),
    setConsent: (newConsent: Partial<ConsentState>) => consentManager.setConsent(newConsent),
    isConsentRequired: () => consentManager.isConsentRequired(),
    getTCString: () => consentManager.getTCString(),
  };
}
