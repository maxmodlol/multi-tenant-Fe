"use client";

import { useEffect, useState } from "react";
import {
  MessageCircle,
  Loader2,
  Eye,
  Facebook,
  Users,
  ChevronDown,
  ChevronUp,
  Send,
  LogIn,
} from "lucide-react";
import { Button } from "@explore/components/ui/button";
import { Input } from "@explore/components/ui/input";
import { FACEBOOK_CONFIG, initializeFacebookSDK } from "@explore/config/facebook";

interface FacebookCommentsProps {
  url: string;
  width?: number;
  numPosts?: number;
  orderBy?: "social" | "reverse_time" | "time";
  colorscheme?: "light" | "dark" | "auto";
  className?: string;
  showPreview?: boolean;
}

export default function FacebookComments({
  url,
  width = 100,
  numPosts = 10,
  orderBy = "social",
  colorscheme = "light",
  className = "",
  showPreview = true,
}: FacebookCommentsProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreviewMode, setShowPreviewMode] = useState(showPreview);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Check if we're in development mode
    const isDev =
      window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    setIsDevelopment(isDev);

    // Check if we're on HTTPS or localhost (required for Facebook SDK)
    const isSecure =
      window.location.protocol === "https:" || window.location.hostname === "localhost";

    if (!isSecure) {
      // Don't load Facebook SDK on HTTP pages (except localhost)
      setIsLoading(false);
      setError("Facebook SDK requires HTTPS. Use HTTPS or localhost for development.");
      return;
    }

    // Check if Facebook SDK is already loaded
    if (window.FB) {
      initializeComments();
      return;
    }

    // Load Facebook SDK only on secure pages
    const loadFacebookSDK = () => {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/ar_AR/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";

      script.onload = () => {
        if (window.FB) {
          window.FB.init({
            xfbml: true,
            version: "v18.0",
          });
          initializeComments();
        } else {
          setError("فشل في تحميل Facebook SDK");
          setIsLoading(false);
        }
      };

      script.onerror = () => {
        setError("فشل في تحميل Facebook SDK");
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    loadFacebookSDK();
  }, [url, width, numPosts, orderBy, colorscheme]);

  const initializeComments = () => {
    try {
      if (window.FB) {
        // Initialize Facebook SDK with proper configuration
        initializeFacebookSDK();

        window.FB.XFBML.parse();

        // Check login status
        window.FB.getLoginStatus((response: any) => {
          if (response.status === "connected") {
            setIsLoggedIn(true);
            getUserInfo();
          }
        });

        setIsLoaded(true);
        setIsLoading(false);
      }
    } catch (err) {
      setError("فشل في تهيئة التعليقات");
      setIsLoading(false);
    }
  };

  const getUserInfo = () => {
    if (window.FB) {
      window.FB.api("/me", { fields: "name,picture" }, (response: any) => {
        if (response && !response.error) {
          setUserInfo(response);
        }
      });
    }
  };

  const handleFacebookLogin = () => {
    // Check if we're on HTTPS or localhost
    const isSecure =
      window.location.protocol === "https:" || window.location.hostname === "localhost";

    if (!isSecure) {
      setError("Facebook login requires HTTPS. Please use HTTPS or localhost for development.");
      return;
    }

    if (window.FB) {
      window.FB.login(
        (response: any) => {
          if (response.authResponse) {
            setIsLoggedIn(true);
            getUserInfo();
            setShowPreviewMode(false); // Switch to real comments after login
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },
        { scope: "public_profile,email" },
      );
    }
  };

  const handleFacebookLogout = () => {
    if (window.FB) {
      window.FB.logout(() => {
        setIsLoggedIn(false);
        setUserInfo(null);
      });
    }
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;

    // Check if we're in development mode (mock user)
    if (isDevelopment && userInfo?.name === "مستخدم تجريبي") {
      // Simulate comment submission in development
      setIsSubmitting(true);
      setTimeout(() => {
        setCommentText("");
        setIsSubmitting(false);
        // Show success message
        alert("تم إرسال التعليق بنجاح! (وضع التطوير)");
      }, 1000);
      return;
    }

    if (!window.FB) {
      setError("Facebook SDK غير متاح. يرجى استخدام HTTPS.");
      return;
    }

    setIsSubmitting(true);

    // Use Facebook API to post comment
    window.FB.api(
      `/${url.split("/").pop()}/comments`,
      "POST",
      { message: commentText },
      (response: any) => {
        setIsSubmitting(false);
        if (response && !response.error) {
          setCommentText("");
          // Refresh comments
          if (window.FB) {
            window.FB.XFBML.parse();
          }
        } else {
          console.error("Error posting comment:", response.error);
          setError("فشل في إرسال التعليق. يرجى المحاولة مرة أخرى.");
        }
      },
    );
  };

  // Determine colorscheme based on current theme
  const getColorScheme = () => {
    if (colorscheme === "auto") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return colorscheme;
  };

  // Development mode component for HTTP environments
  const DevelopmentMode = () => (
    <div className="bg-background-secondary border border-border-primary rounded-xl p-4 sm:p-6">
      <div className="space-y-4">
        {/* Development Warning */}
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-warning-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-warning-800 mb-1">وضع التطوير</h4>
              <p className="text-sm text-warning-700 mb-3">
                Facebook login يتطلب HTTPS. في وضع التطوير، يمكنك رؤية معاينة للتعليقات.
              </p>
              <div className="text-xs text-warning-600 space-y-1">
                <p>• استخدم HTTPS في الإنتاج</p>
                <p>• أو استخدم localhost للتطوير</p>
                <p>• التعليقات الحقيقية ستعمل في الإنتاج</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Login Button */}
        <div className="text-center">
          <Button
            variant="primary"
            onClick={() => {
              // Simulate login in development
              setIsLoggedIn(true);
              setUserInfo({
                name: "مستخدم تجريبي",
                picture: { data: { url: "/icons/author-avatar.svg" } },
              });
              setShowPreviewMode(false);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Facebook className="h-4 w-4 ml-2" />
            تسجيل الدخول التجريبي (وضع التطوير)
          </Button>
        </div>
      </div>
    </div>
  );

  // Preview component showing how comments will look
  const CommentsPreview = () => (
    <div className="bg-background-secondary border border-border-primary rounded-xl p-4 sm:p-6">
      <div className="space-y-4">
        {/* Mock Facebook Comments Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-secondary">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Facebook className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary text-sm">تعليقات فيسبوك</h4>
              <p className="text-xs text-text-tertiary">0 تعليق</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-text-tertiary" />
            <span className="text-xs text-text-tertiary">0 مشارك</span>
          </div>
        </div>

        {/* Mock Comment Input */}
        <div className="bg-background-primary border border-border-primary rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs text-gray-600">?</span>
            </div>
            <div className="flex-1">
              <div className="bg-background-secondary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-tertiary">
                اكتب تعليقاً...
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-text-quaternary">
              <span>👍</span>
              <span>❤️</span>
              <span>😮</span>
              <span>😢</span>
              <span>😡</span>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="text-xs px-4 py-1"
              onClick={handleFacebookLogin}
            >
              <LogIn className="h-3 w-3 ml-1" />
              تسجيل الدخول للتعليق
            </Button>
          </div>
        </div>

        {/* Mock Comments */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-semibold">أ</span>
            </div>
            <div className="flex-1">
              <div className="bg-background-primary border border-border-primary rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-text-primary text-sm">أحمد محمد</span>
                  <span className="text-xs text-text-quaternary">منذ ساعة</span>
                </div>
                <p className="text-sm text-text-secondary">
                  مقال رائع ومفيد جداً! شكراً لك على هذه المعلومات القيمة.
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-text-quaternary">
                  <button className="hover:text-text-tertiary transition-colors">👍 أعجبني</button>
                  <button className="hover:text-text-tertiary transition-colors">رد</button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-semibold">س</span>
            </div>
            <div className="flex-1">
              <div className="bg-background-primary border border-border-primary rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-text-primary text-sm">سارة أحمد</span>
                  <span className="text-xs text-text-quaternary">منذ 3 ساعات</span>
                </div>
                <p className="text-sm text-text-secondary">
                  هل يمكنك مشاركة المزيد من التفاصيل حول هذا الموضوع؟
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-text-quaternary">
                  <button className="hover:text-text-tertiary transition-colors">👍 أعجبني</button>
                  <button className="hover:text-text-tertiary transition-colors">رد</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Show More Button */}
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-text-brand-primary hover:text-text-brand-secondary"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 ml-1" />
                إخفاء التعليقات
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 ml-1" />
                عرض المزيد من التعليقات
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  if (error) {
    const isHttpsError = error.includes("HTTPS") || error.includes("Facebook SDK requires");

    return (
      <div
        className={`bg-background-secondary border border-border-primary rounded-xl p-6 text-center ${className}`}
      >
        <div className="flex flex-col items-center gap-4">
          <MessageCircle className="h-8 w-8 text-text-tertiary" />

          {isHttpsError ? (
            <div className="space-y-3">
              <p className="text-text-tertiary text-sm font-medium">
                Facebook Comments يتطلب HTTPS
              </p>
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 text-right">
                <p className="text-warning-700 text-sm mb-2">⚠️ Facebook login لا يعمل على HTTP</p>
                <div className="text-xs text-warning-600 space-y-1">
                  <p>• استخدم HTTPS في الإنتاج</p>
                  <p>• أو استخدم localhost للتطوير</p>
                  <p>• التعليقات ستعمل عند استخدام HTTPS</p>
                </div>
              </div>

              {/* Show development mode for HTTP */}
              {isDevelopment && window.location.protocol !== "https:" && (
                <div className="mt-4">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setError(null);
                      setIsLoggedIn(true);
                      setUserInfo({
                        name: "مستخدم تجريبي",
                        picture: { data: { url: "/icons/author-avatar.svg" } },
                      });
                      setShowPreviewMode(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Facebook className="h-4 w-4 ml-2" />
                    تجربة وضع التطوير
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-text-tertiary text-sm">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  window.location.reload();
                }}
                className="text-text-brand-primary hover:text-text-brand-secondary text-sm font-medium transition-colors"
              >
                إعادة المحاولة
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={`bg-background-secondary border border-border-primary rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-text-brand-primary" />
          <span className="text-text-secondary text-sm">جاري تحميل التعليقات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-border-primary">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-background-brand-primary rounded-lg">
            <MessageCircle className="h-4 w-4 text-text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">التعليقات</h3>
            <p className="text-sm text-text-tertiary">شاركنا رأيك حول هذا المقال</p>
          </div>
        </div>

        {/* Preview Toggle */}
        {showPreview && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreviewMode(!showPreviewMode)}
              className="text-text-brand-primary hover:text-text-brand-secondary"
            >
              <Eye className="h-4 w-4 ml-1" />
              {showPreviewMode ? "إخفاء المعاينة" : "معاينة التعليقات"}
            </Button>
          </div>
        )}
      </div>

      {/* Development Mode for HTTP */}
      {isDevelopment && window.location.protocol !== "https:" && !isLoggedIn && <DevelopmentMode />}

      {/* Preview Mode */}
      {showPreviewMode && <CommentsPreview />}

      {/* Real Facebook Comments */}
      {!showPreviewMode && (
        <>
          {/* User Login Status */}
          {isLoggedIn && userInfo && (
            <div className="bg-background-brand-primary border border-border-brand rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={userInfo.picture?.data?.url || "/icons/author-avatar.svg"}
                    alt={userInfo.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-text-primary">مرحباً، {userInfo.name}</h4>
                    <p className="text-sm text-text-secondary">يمكنك الآن التعليق على هذا المقال</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFacebookLogout}
                  className="text-text-tertiary hover:text-text-secondary"
                >
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          )}

          {/* Comment Form for Logged-in Users */}
          {isLoggedIn && (
            <div className="bg-background-secondary border border-border-primary rounded-xl p-4 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={userInfo?.picture?.data?.url || "/icons/author-avatar.svg"}
                    alt={userInfo?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <Input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="اكتب تعليقك هنا..."
                      className="border-border-primary focus:border-border-brand"
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() || isSubmitting}
                    className="px-4"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Facebook Comments Plugin */}
          <div className="bg-background-secondary border border-border-primary rounded-xl p-4 sm:p-6">
            <div
              className="fb-comments"
              data-href={url}
              data-width={`${width}%`}
              data-numposts={numPosts}
              data-order-by={orderBy}
              data-colorscheme={getColorScheme()}
              data-lazy="true"
              style={{
                minHeight: "200px",
                width: "100%",
              }}
            />
          </div>

          {/* Login Prompt for Non-logged-in Users */}
          {!isLoggedIn && (
            <div className="bg-background-brand-primary border border-border-brand rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg flex-shrink-0">
                  <Facebook className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-text-primary mb-2">سجل دخولك للتعليق</h4>
                  <p className="text-sm text-text-secondary mb-4">
                    سجل دخولك باستخدام حساب فيسبوك للتعليق والتفاعل مع الآخرين
                  </p>

                  {/* HTTPS Check */}
                  {window.location.protocol !== "https:" &&
                    window.location.hostname !== "localhost" && (
                      <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-warning-700">
                          ⚠️ Facebook login يتطلب HTTPS. يرجى استخدام HTTPS أو localhost للتطوير.
                        </p>
                      </div>
                    )}

                  <Button
                    variant="primary"
                    onClick={handleFacebookLogin}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={
                      window.location.protocol !== "https:" &&
                      window.location.hostname !== "localhost"
                    }
                  >
                    <Facebook className="h-4 w-4 ml-2" />
                    تسجيل الدخول بفيسبوك
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* General Footer note */}
      <div className="text-center px-4">
        <p className="text-xs text-text-quaternary leading-relaxed">
          التعليقات مدعومة من فيسبوك. قد تحتاج إلى تسجيل الدخول إلى حسابك على فيسبوك للمشاركة.
        </p>
      </div>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    FB: any;
  }
}
