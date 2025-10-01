'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/app/redux";
import { useUpdateUserMutation } from "@/state/api";

const Settings = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [updateUser] = useUpdateUserMutation();

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

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateUser({
        id: user.id,
        body: {
          name: settings.name,
          email: settings.email,
        },
      }).unwrap();
      alert("Settings updated successfully ✅");
    } catch (err: any) {
      console.error(err);
      alert(err?.data?.message || "Failed to update settings");
    }
  };

  return (
    <div className="p-6">
      {/* Header - Removed duplicate Header component */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div
        className={`max-w-2xl mx-auto rounded-xl p-6 shadow-lg ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={settings.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
              autoComplete="name"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
              autoComplete="email"
            />
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium" htmlFor="role">Role</label>
            <input
              id="role"
              type="text"
              value={settings.role}
              disabled
              className={`px-3 py-2 rounded-lg border cursor-not-allowed ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 border-gray-600"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={settings.notifications}
                onChange={() =>
                  handleChange("notifications", !settings.notifications)
                }
                aria-label="Enable notifications"
              />
              <div
                className={`w-10 h-5 rounded-full transition-colors ${
                  settings.notifications ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                    settings.notifications ? "translate-x-5" : ""
                  }`}
                ></span>
              </div>
            </label>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;