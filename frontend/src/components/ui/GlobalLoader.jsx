import React from "react";
import {
  DashboardGhost,
  PropertiesGhost,
  TableGhost,
  SettingsGhost,
  SubscriptionGhost,
  PublicPageGhost,
  Pulse,
} from "./GhostLoader.jsx";

export default function GlobalLoader() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";

  // App Layout Frame Skeleton for direct hits to authenticated routes
  const renderAppSkeleton = (content) => (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Sidebar Pulse Skeleton */}
      <aside className="hidden lg:flex w-64 h-full bg-[#1e293b] flex-col p-6 gap-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Pulse className="w-10 h-10 rounded-xl bg-slate-700/80" />
          <Pulse className="w-28 h-6 rounded-lg bg-slate-700/80" />
        </div>
        <div className="flex flex-col gap-3 mt-4 flex-1">
          {[...Array(7)].map((_, i) => (
            <Pulse key={i} className="w-full h-11 rounded-xl bg-slate-800/80" />
          ))}
        </div>
      </aside>
      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-6 flex items-center justify-between">
          <Pulse className="w-32 h-6 rounded-lg" />
          <Pulse className="w-9 h-9 rounded-full" />
        </header>
        <main className="flex-1 overflow-y-auto p-6">{content}</main>
      </div>
    </div>
  );

  if (path.startsWith("/dashboard")) {
    return renderAppSkeleton(<DashboardGhost />);
  }
  if (path.startsWith("/properties")) {
    return renderAppSkeleton(<PropertiesGhost />);
  }
  if (path.startsWith("/settings")) {
    return renderAppSkeleton(<SettingsGhost />);
  }
  if (path.startsWith("/subscription") || path.startsWith("/pricing")) {
    return renderAppSkeleton(<SubscriptionGhost />);
  }
  if (
    path.startsWith("/payments") ||
    path.startsWith("/bills") ||
    path.startsWith("/rent") ||
    path.startsWith("/reports") ||
    path.startsWith("/units") ||
    path.startsWith("/tenants")
  ) {
    return renderAppSkeleton(<TableGhost rows={5} />);
  }

  // Marketing root homepage split-skeleton fallback
  if (path === "/" || path === "/home") {
    return (
      <div
        style={{ minHeight: "100vh", display: "flex", background: "#0f172a" }}
      >
        {/* Left branding skeleton */}
        <div
          style={{
            width: "40%",
            padding: "48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          className="hidden lg:flex"
        >
          <Pulse className="w-16 h-16 rounded-full" />
          <div>
            <Pulse className="h-10 w-4/5 mb-4 rounded-xl" />
            <Pulse className="h-10 w-3/5 mb-4 rounded-xl" />
            <Pulse className="h-5 w-3/4 mb-8 rounded-lg" />
            <div style={{ display: "flex", gap: "12px" }}>
              <Pulse className="h-12 w-36 rounded-xl" />
              <Pulse className="h-12 w-40 rounded-xl" />
            </div>
          </div>
          <Pulse className="h-3.5 w-1/2 rounded" />
        </div>
        {/* Right carousel skeleton */}
        <div
          style={{
            flex: 1,
            background: "#f8fafc",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Pulse className="w-9 h-9 rounded-xl bg-slate-200" />
            <Pulse className="h-5 w-24 rounded-md bg-slate-200" />
          </div>
          <Pulse className="flex-1 rounded-2xl bg-slate-200" />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <Pulse className="w-8 h-2 rounded bg-slate-300" />
              <Pulse className="w-2 h-2 rounded-full bg-slate-300" />
              <Pulse className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Pulse className="w-10 h-10 rounded-xl bg-slate-200" />
              <Pulse className="w-10 h-10 rounded-xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Public features / tools / research / legal fallback
  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f172a]">
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 justify-between max-w-7xl mx-auto">
        <Pulse className="w-32 h-6 rounded-lg" />
        <Pulse className="w-48 h-5 rounded-md" />
      </div>
      <PublicPageGhost />
    </div>
  );
}
