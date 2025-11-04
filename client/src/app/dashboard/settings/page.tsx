'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useUpdateUserMutation } from "@/state/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [updateUser] = useUpdateUserMutation();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    role: "",
    notifications: true,
  });

  useEffect(() => {
    if (user) {
      setSettings({
        name: user.name || "",
        email: user.email || "",
        role: (user as any).role || "USER",
        notifications: true,
      });
    }
  }, [user]);

  const handleChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateUser({
        id: user.id,
        body: {
          name: settings.name,
          email: settings.email,
        },
      }).unwrap();
      toast({
        title: "Settings updated",
        description: "Your profile settings have been saved successfully.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.data?.message || "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Profile Settings</CardTitle>
          <CardDescription>Update your personal information and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={settings.name}
                onChange={(e) => handleChange("name", e.target.value)}
                autoComplete="name"
                placeholder="Enter your name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                autoComplete="email"
                placeholder="Enter your email"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                type="text"
                value={settings.role}
                disabled
                className="bg-muted cursor-not-allowed"
                placeholder="Your role"
              />
              <p className="text-sm text-muted-foreground">
                Role cannot be changed. Contact administrator for role updates.
              </p>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between space-y-0 py-4 border-t">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about important updates
                </p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => handleChange("notifications", checked)}
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;