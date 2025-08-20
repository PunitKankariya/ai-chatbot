import React, { useEffect, useState } from "react";
import AppLayout from "../components/ui/AppLayout";

export default function SettingsPage() {
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(true);
  const [model, setModel] = useState("balanced");
  const [language, setLanguage] = useState("en");
  const [fontSize, setFontSize] = useState("base");
  const [compactSidebar, setCompactSidebar] = useState(false);
  const [autosaveNotes, setAutosaveNotes] = useState(true);
  const [privacyAnalytics, setPrivacyAnalytics] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("app_settings");
    if (stored) {
      const s = JSON.parse(stored);
      setTheme(s.theme ?? "dark");
      setNotifications(s.notifications ?? true);
      setModel(s.model ?? "balanced");
      setLanguage(s.language ?? "en");
      setFontSize(s.fontSize ?? "base");
      setCompactSidebar(!!s.compactSidebar);
      setAutosaveNotes(s.autosaveNotes ?? true);
      setPrivacyAnalytics(s.privacyAnalytics ?? true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "app_settings",
      JSON.stringify({
        theme,
        notifications,
        model,
        language,
        fontSize,
        compactSidebar,
        autosaveNotes,
        privacyAnalytics,
      })
    );
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.fontSize =
      fontSize === "sm" ? "14px" : fontSize === "lg" ? "18px" : "16px";
  }, [theme, notifications, model]);

  useEffect(() => {
    localStorage.setItem(
      "app_settings",
      JSON.stringify({
        theme,
        notifications,
        model,
        language,
        fontSize,
        compactSidebar,
        autosaveNotes,
        privacyAnalytics,
      })
    );
  }, [language, fontSize, compactSidebar, autosaveNotes, privacyAnalytics]);

  return (
    <AppLayout>
      <div className="h-full p-6 text-white">
        <h1 className="text-2xl font-semibold mb-6">⚙️ Settings</h1>

        <div className="grid gap-4 max-w-2xl">
          <section className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h2 className="font-medium">Appearance</h2>
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`px-3 py-2 rounded-lg ${
                  theme === "light"
                    ? "bg-white/20"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-2 rounded-lg ${
                  theme === "dark"
                    ? "bg-white/20"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                Dark
              </button>
            </div>
          </section>

          <section className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h2 className="font-medium">Notifications</h2>
            <label className="mt-3 inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span>Email and in-app updates</span>
            </label>
          </section>

          <section className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h2 className="font-medium">Response Style</h2>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="mt-3 px-3 py-2 rounded-lg bg-white/10"
            >
              <option value="concise">Concise</option>
              <option value="balanced">Balanced</option>
              <option value="detailed">Detailed</option>
            </select>
          </section>

          <section className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h2 className="font-medium">Language</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-3 px-3 py-2 rounded-lg bg-white/10"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
            </select>
          </section>

          <section className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h2 className="font-medium">Interface</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-sm mb-1">Font size</label>
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/10 w-full"
                >
                  <option value="sm">Small</option>
                  <option value="base">Default</option>
                  <option value="lg">Large</option>
                </select>
              </div>
              <label className="inline-flex items-center gap-2 mt-6 md:mt-0">
                <input
                  type="checkbox"
                  checked={compactSidebar}
                  onChange={(e) => setCompactSidebar(e.target.checked)}
                />
                <span>Compact sidebar</span>
              </label>
            </div>
          </section>

          <section className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h2 className="font-medium">Notes</h2>
            <label className="inline-flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={autosaveNotes}
                onChange={(e) => setAutosaveNotes(e.target.checked)}
              />
              <span>Autosave notes</span>
            </label>
          </section>

          <section className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h2 className="font-medium">Privacy</h2>
            <label className="inline-flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={privacyAnalytics}
                onChange={(e) => setPrivacyAnalytics(e.target.checked)}
              />
              <span>Share anonymous analytics</span>
            </label>
          </section>

          <section className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h2 className="font-medium">Data</h2>
            <div className="mt-3 flex gap-3 flex-wrap">
              <button
                onClick={() => {
                  const data = localStorage.getItem("app_settings") || "{}";
                  const blob = new Blob([data], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "settings.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20"
              >
                Export settings
              </button>
              <label className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer">
                Import settings
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const text = await file.text();
                    try {
                      const s = JSON.parse(text);
                      setTheme(s.theme ?? theme);
                      setNotifications(s.notifications ?? notifications);
                      setModel(s.model ?? model);
                      setLanguage(s.language ?? language);
                      setFontSize(s.fontSize ?? fontSize);
                      setCompactSidebar(!!s.compactSidebar);
                      setAutosaveNotes(s.autosaveNotes ?? autosaveNotes);
                      setPrivacyAnalytics(
                        s.privacyAnalytics ?? privacyAnalytics
                      );
                    } catch (_) {}
                  }}
                />
              </label>
              <button
                onClick={() => {
                  localStorage.removeItem("app_settings");
                  setTheme("dark");
                  setNotifications(true);
                  setModel("balanced");
                  setLanguage("en");
                  setFontSize("base");
                  setCompactSidebar(false);
                  setAutosaveNotes(true);
                  setPrivacyAnalytics(true);
                }}
                className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-700"
              >
                Reset to defaults
              </button>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
