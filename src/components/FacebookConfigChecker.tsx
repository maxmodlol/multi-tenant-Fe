"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Facebook, ExternalLink } from "lucide-react";
import { Button } from "@explore/components/ui/button";

interface ConfigStatus {
  hasAppId: boolean;
  isHttps: boolean;
  isLocalhost: boolean;
  hasFacebookSDK: boolean;
  appId: string | null;
  currentUrl: string;
  protocol: string;
  hostname: string;
}

export default function FacebookConfigChecker() {
  const [config, setConfig] = useState<ConfigStatus>({
    hasAppId: false,
    isHttps: false,
    isLocalhost: false,
    hasFacebookSDK: false,
    appId: null,
    currentUrl: "",
    protocol: "",
    hostname: "",
  });

  useEffect(() => {
    const checkConfig = () => {
      const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const currentUrl = window.location.href;
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      const isHttps = protocol === "https:";
      const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
      const hasFacebookSDK = typeof window.FB !== "undefined";

      setConfig({
        hasAppId: !!appId && appId !== "YOUR_FACEBOOK_APP_ID",
        isHttps,
        isLocalhost,
        hasFacebookSDK,
        appId: appId ?? null,
        currentUrl,
        protocol,
        hostname,
      });
    };

    checkConfig();

    // Check again after a delay to see if Facebook SDK loads
    const timer = setTimeout(checkConfig, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-700" : "text-red-700";
  };

  const isConfigValid = config.hasAppId && (config.isHttps || config.isLocalhost);

  return (
    <div className="bg-background-secondary border border-border-primary rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Facebook className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-text-primary">Facebook Comments Configuration</h3>
      </div>

      {/* Overall Status */}
      <div
        className={`p-4 rounded-lg border ${
          isConfigValid ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex items-center gap-2">
          {isConfigValid ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-500" />
          )}
          <span className={`font-medium ${isConfigValid ? "text-green-700" : "text-red-700"}`}>
            {isConfigValid ? "Configuration Valid" : "Configuration Issues Found"}
          </span>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Facebook App ID</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(config.hasAppId)}
            <span className={`text-sm ${getStatusColor(config.hasAppId)}`}>
              {config.hasAppId ? "Configured" : "Missing"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">HTTPS Protocol</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(config.isHttps)}
            <span className={`text-sm ${getStatusColor(config.isHttps)}`}>
              {config.isHttps ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Localhost</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(config.isLocalhost)}
            <span className={`text-sm ${getStatusColor(config.isLocalhost)}`}>
              {config.isLocalhost ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Facebook SDK</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(config.hasFacebookSDK)}
            <span className={`text-sm ${getStatusColor(config.hasFacebookSDK)}`}>
              {config.hasFacebookSDK ? "Loaded" : "Not Loaded"}
            </span>
          </div>
        </div>
      </div>

      {/* Current Environment Info */}
      <div className="bg-background-primary border border-border-primary rounded-lg p-4">
        <h4 className="font-medium text-text-primary mb-2">Current Environment</h4>
        <div className="space-y-1 text-sm text-text-secondary">
          <div>
            <strong>URL:</strong> {config.currentUrl}
          </div>
          <div>
            <strong>Protocol:</strong> {config.protocol}
          </div>
          <div>
            <strong>Hostname:</strong> {config.hostname}
          </div>
          <div>
            <strong>App ID:</strong> {config.appId || "Not set"}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.reload()}
          className="flex-1"
        >
          Refresh Check
        </Button>

        {!config.hasAppId && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open("https://developers.facebook.com/", "_blank")}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 ml-2" />
            Create Facebook App
          </Button>
        )}
      </div>

      {/* Instructions */}
      {!isConfigValid && (
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <h4 className="font-medium text-warning-800 mb-2">Setup Required</h4>
          <div className="text-sm text-warning-700 space-y-1">
            {!config.hasAppId && (
              <p>• Create a Facebook App and add the App ID to your environment variables</p>
            )}
            {!config.isHttps && !config.isLocalhost && (
              <p>• Use HTTPS in production or localhost for development</p>
            )}
            <p>• See the setup guide for detailed instructions</p>
          </div>
        </div>
      )}
    </div>
  );
}
