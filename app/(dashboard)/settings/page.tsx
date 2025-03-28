import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/settings/profile-form";
import { AccountForm } from "@/components/settings/account-form";
import { NotificationsForm } from "@/components/settings/notifications-form";
import { ApiKeysForm } from "@/components/settings/api-keys-form";

export const metadata: Metadata = {
  title: "Settings | SellSmart-Pro",
  description: "User and account management for Amazon sellers",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <Separator />
      <div className="grid gap-10">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            Update your personal information.
          </p>
          <Separator className="my-4" />
          <ProfileForm />
        </div>
        <div>
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-muted-foreground">
            Update your account settings.
          </p>
          <Separator className="my-4" />
          <AccountForm />
        </div>
        <div>
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Configure how you receive notifications.
          </p>
          <Separator className="my-4" />
          <NotificationsForm />
        </div>
        <div>
          <h3 className="text-lg font-medium">API Keys</h3>
          <p className="text-sm text-muted-foreground">
            Manage your Amazon SP-API credentials.
          </p>
          <Separator className="my-4" />
          <ApiKeysForm />
        </div>
      </div>
    </div>
  );
}
