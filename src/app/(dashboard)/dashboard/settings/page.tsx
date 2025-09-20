// app/(dashboard)/settings/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SettingsTabs from "./tabs.client";
import { headers } from "next/headers";
import { SETTINGS_TABS, type Role } from "./settings-config";
import { authOptions } from "@/src/lib/authOptions";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    // no user → send to login
    redirect("/login");
  }

  // now session.user.role will be populated
  const role = session.user.role as Role;
  const allowedTabs = SETTINGS_TABS.filter((tab) => tab.allowedRoles.includes(role));

  // Read ?tab and ?tenant on server to set initial tab and pass through query
  const h = await headers();
  const url = new URL(h.get("x-url") || "http://local/" + (h.get("x-pathname") || "/"));
  const initialTab = url.searchParams.get("tab") || undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-primary via-background-secondary/30 to-background-primary">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl animate-blob-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-blob-slower" />
      </div>

      <section className="relative max-w-7xl mx-auto space-y-8 p-6 lg:p-8">
        {/* Enhanced Header */}
        <header className="space-y-4 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1
                className="text-xl sm:text-2xl lg:text-4xl font-bold"
                style={{
                  background:
                    "linear-gradient(to right, hsl(var(--brand-500)), hsl(var(--brand-600)))",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                Settings
              </h1>
              <p className="text-md sm:text-lg text-text-secondary max-w-2xl">
                Customize your dashboard experience and manage your platform settings
              </p>
            </div>

            {/* Quick stats or info */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
              <div className="flex items-center gap-2 px-4 py-2 bg-background-secondary/80 backdrop-blur-sm rounded-xl border border-border-secondary/50">
                <span className="text-brand-500">🎨</span>
                <span className="text-sm font-medium text-text-primary">
                  {allowedTabs.length} Settings
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background-secondary/80 backdrop-blur-sm rounded-xl border border-border-secondary/50">
                <span className="text-green-500">✓</span>
                <span className="text-sm font-medium text-text-primary">Admin Access</span>
              </div>
            </div>
          </div>
        </header>

        <SettingsTabs tabs={allowedTabs} />
      </section>
    </div>
  );
}
