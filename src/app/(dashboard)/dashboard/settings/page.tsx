// app/(dashboard)/settings/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import SettingsTabs from "./tabs.client";
import { SETTINGS_TABS, type Role } from "./settings-config";
import { authOptions } from "@explore/app//auth/[...nextauth]/route"; // adjust this path if needed

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

  return (
    <section className="max-w-5xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Change how your dashboard looks and feels.</p>
      </header>

      <SettingsTabs tabs={allowedTabs} />
    </section>
  );
}
