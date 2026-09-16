import React from "react";

/**
 * High-performance, luxury ghost/skeleton loaders with smooth GPU-accelerated shimmer.
 * Crafted specifically to match the app layout tokens, preventing layout shifts and white flashes.
 */

export function TopProgressBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[9999] pointer-events-none overflow-hidden bg-transparent">
      <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 animate-[topBarSlide_1.2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      <style>{`
        @keyframes topBarSlide {
          0% { transform: translateX(-100%); width: 40%; }
          50% { width: 70%; }
          100% { transform: translateX(300%); width: 30%; }
        }
      `}</style>
    </div>
  );
}

export function Pulse({ className = "", style = {} }) {
  return (
    <div
      className={`bg-slate-200/80 dark:bg-slate-800/80 skeleton-shimmer rounded-xl ${className}`}
      style={style}
    />
  );
}

export function DashboardGhost() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto animate-fade-in">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <Pulse className="w-9 h-9 rounded-xl" />
              <Pulse className="w-12 h-3 rounded-full" />
            </div>
            <Pulse className="w-16 h-7 rounded-lg mt-1" />
            <Pulse className="w-24 h-3 rounded-md" />
          </div>
        ))}
      </div>

      {/* Property Groups */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Pulse className="w-36 h-6 rounded-lg" />
          <Pulse className="w-24 h-4 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 p-6 flex flex-col gap-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <Pulse className="w-32 h-5 rounded-md" />
                <Pulse className="w-16 h-5 rounded-full" />
              </div>
              <Pulse className="w-48 h-3.5 rounded" />
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <Pulse className="h-10 rounded-lg" />
                <Pulse className="h-10 rounded-lg" />
                <Pulse className="h-10 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PropertiesGhost() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto animate-fade-in">
      {/* Header Control Panel Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex flex-col gap-2">
          <Pulse className="w-40 h-7 rounded-lg" />
          <Pulse className="w-64 h-3.5 rounded" />
        </div>
        <Pulse className="w-36 h-10 rounded-xl" />
      </div>

      {/* Category Section Skeleton */}
      {[...Array(2)].map((_, catIdx) => (
        <div key={catIdx} className="flex flex-col gap-5">
          <div className="flex items-center gap-3 px-1">
            <Pulse className="w-9 h-9 rounded-lg" />
            <Pulse className="w-44 h-6 rounded-md" />
            <Pulse className="w-8 h-5 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2 flex-1">
                    <Pulse className="w-32 h-5 rounded-md" />
                    <Pulse className="w-44 h-3 rounded" />
                  </div>
                  <Pulse className="w-8 h-8 rounded-full" />
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <Pulse className="w-20 h-4 rounded" />
                  <Pulse className="w-20 h-4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableGhost({ rows = 5 }) {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in">
      {/* Filter / Search Bar Skeleton */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Pulse className="w-36 h-9 rounded-xl" />
          <Pulse className="w-32 h-9 rounded-xl" />
          <Pulse className="w-28 h-9 rounded-xl" />
        </div>
        <Pulse className="w-28 h-9 rounded-xl" />
      </div>

      {/* Summary KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col gap-2"
          >
            <Pulse className="w-24 h-3 rounded" />
            <Pulse className="w-32 h-7 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table Rows Skeleton */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60">
        <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between">
          <Pulse className="w-40 h-4 rounded" />
          <Pulse className="w-24 h-4 rounded" />
        </div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Pulse className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="flex flex-col gap-2">
                <Pulse className="w-36 h-4 rounded" />
                <Pulse className="w-48 h-3 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Pulse className="w-20 h-5 rounded-md" />
              <Pulse className="w-20 h-7 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailGhost() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto animate-fade-in">
      {/* Breadcrumb + Back */}
      <div className="flex items-center gap-3">
        <Pulse className="w-24 h-4 rounded" />
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <Pulse className="w-36 h-4 rounded" />
      </div>

      {/* Main Hero Card Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Pulse className="w-16 h-16 rounded-2xl flex-shrink-0" />
          <div className="flex flex-col gap-2.5">
            <Pulse className="w-48 h-6 rounded-lg" />
            <Pulse className="w-64 h-3.5 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Pulse className="w-28 h-10 rounded-xl" />
          <Pulse className="w-28 h-10 rounded-xl" />
        </div>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col gap-2"
          >
            <Pulse className="w-20 h-3 rounded" />
            <Pulse className="w-24 h-6 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Grid of Inner Cards / Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Pulse className="w-10 h-10 rounded-xl" />
              <div className="flex flex-col gap-1.5">
                <Pulse className="w-28 h-4 rounded" />
                <Pulse className="w-36 h-3 rounded" />
              </div>
            </div>
            <Pulse className="w-16 h-6 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsGhost() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Pulse className="w-36 h-8 rounded-xl" />
        <Pulse className="w-64 h-4 rounded-lg" />
      </div>

      {/* Profile Card Skeleton */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Pulse className="w-16 h-16 rounded-full flex-shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <Pulse className="w-40 h-5 rounded-md" />
            <Pulse className="w-56 h-3.5 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex flex-col gap-2">
            <Pulse className="w-24 h-3.5 rounded" />
            <Pulse className="w-full h-11 rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <Pulse className="w-24 h-3.5 rounded" />
            <Pulse className="w-full h-11 rounded-xl" />
          </div>
        </div>
        <Pulse className="w-32 h-10 rounded-xl self-start" />
      </div>

      {/* Security Card Skeleton */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <Pulse className="w-36 h-5 rounded-md" />
          <Pulse className="w-64 h-3.5 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Pulse className="w-32 h-3.5 rounded" />
            <Pulse className="w-full h-11 rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <Pulse className="w-32 h-3.5 rounded" />
            <Pulse className="w-full h-11 rounded-xl" />
          </div>
        </div>
        <Pulse className="w-40 h-10 rounded-xl self-start" />
      </div>

      {/* Danger Zone Skeleton */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-rose-200/60 dark:border-rose-950/60 shadow-sm flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Pulse className="w-32 h-5 rounded-md" />
          <Pulse className="w-72 h-3.5 rounded" />
        </div>
        <Pulse className="w-32 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30" />
      </div>
    </div>
  );
}

export function SubscriptionGhost() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Pulse className="w-44 h-8 rounded-xl" />
          <Pulse className="w-72 h-4 rounded-lg" />
        </div>
        <Pulse className="w-32 h-10 rounded-xl" />
      </div>

      {/* Main Subscription Plan Hero */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Pulse className="w-12 h-12 rounded-2xl flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Pulse className="w-36 h-6 rounded-lg" />
                <Pulse className="w-20 h-5 rounded-full" />
              </div>
              <Pulse className="w-48 h-3.5 rounded" />
            </div>
          </div>
          <Pulse className="w-36 h-11 rounded-xl" />
        </div>

        {/* 3 Metric Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/40 flex flex-col gap-1.5"
            >
              <Pulse className="w-20 h-3 rounded" />
              <Pulse className="w-28 h-6 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Payment History Table Skeleton */}
      <div className="flex flex-col gap-4">
        <Pulse className="w-36 h-6 rounded-lg" />
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60">
          <div className="p-4 bg-slate-50/70 dark:bg-slate-800/50 flex items-center justify-between">
            <Pulse className="w-32 h-4 rounded" />
            <Pulse className="w-24 h-4 rounded" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 flex items-center justify-between gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <Pulse className="w-40 h-4 rounded" />
                <Pulse className="w-28 h-3 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <Pulse className="w-16 h-5 rounded-full" />
                <Pulse className="w-20 h-5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BillsGhost() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-fade-in">
      {/* Control Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Pulse className="w-40 h-10 rounded-xl" />
          <Pulse className="w-32 h-10 rounded-xl" />
          <Pulse className="w-28 h-10 rounded-xl" />
        </div>
        <Pulse className="w-32 h-10 rounded-xl" />
      </div>

      {/* Bill Groups */}
      {[...Array(2)].map((_, gIdx) => (
        <div
          key={gIdx}
          className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden"
        >
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <Pulse className="w-44 h-5 rounded-md" />
            <Pulse className="w-20 h-4 rounded" />
          </div>
          <div className="p-5 flex flex-col gap-4">
            {[...Array(2)].map((_, bIdx) => (
              <div
                key={bIdx}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <Pulse className="w-10 h-10 rounded-xl flex-shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <Pulse className="w-36 h-4 rounded" />
                    <Pulse className="w-48 h-3 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Pulse className="w-24 h-6 rounded-lg" />
                  <Pulse className="w-20 h-6 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function PaymentsGhost() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto animate-fade-in">
      {/* Header filter */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Pulse className="w-36 h-10 rounded-xl" />
          <Pulse className="w-32 h-10 rounded-xl" />
          <Pulse className="w-40 h-10 rounded-xl" />
        </div>
        <Pulse className="w-36 h-10 rounded-xl" />
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40 flex flex-col gap-2">
          <Pulse className="w-24 h-3.5 rounded" />
          <Pulse className="w-32 h-7 rounded-lg" />
        </div>
        <div className="p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800/40 flex flex-col gap-2">
          <Pulse className="w-24 h-3.5 rounded" />
          <Pulse className="w-32 h-7 rounded-lg" />
        </div>
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex flex-col gap-2">
          <Pulse className="w-24 h-3.5 rounded" />
          <Pulse className="w-32 h-7 rounded-lg" />
        </div>
      </div>

      {/* Ledger Rows */}
      <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700/60">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Pulse className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="flex flex-col gap-2">
                <Pulse className="w-36 h-4 rounded" />
                <Pulse className="w-52 h-3 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Pulse className="w-24 h-6 rounded-lg" />
              <Pulse className="w-20 h-6 rounded-full" />
              <Pulse className="w-24 h-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PublicPageGhost() {
  return (
    <div className="flex flex-col gap-10 w-full max-w-6xl mx-auto px-4 py-10 animate-fade-in">
      {/* Hero Skeleton */}
      <div className="flex flex-col items-center text-center gap-4 max-w-3xl mx-auto w-full">
        <Pulse className="w-28 h-7 rounded-full" />
        <Pulse className="w-4/5 h-10 sm:h-12 rounded-2xl" />
        <Pulse className="w-3/5 h-5 rounded-lg" />
        <div className="flex items-center gap-3 mt-4">
          <Pulse className="w-36 h-12 rounded-xl" />
          <Pulse className="w-36 h-12 rounded-xl" />
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col gap-4"
          >
            <Pulse className="w-12 h-12 rounded-xl" />
            <Pulse className="w-40 h-5 rounded-md" />
            <Pulse className="w-full h-3 rounded" />
            <Pulse className="w-5/6 h-3 rounded" />
            <Pulse className="w-4/6 h-3 rounded" />
          </div>
        ))}
      </div>

      {/* Main Body Skeleton */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col gap-4">
        <Pulse className="w-64 h-6 rounded-lg" />
        <Pulse className="w-full h-3.5 rounded" />
        <Pulse className="w-full h-3.5 rounded" />
        <Pulse className="w-4/5 h-3.5 rounded" />
      </div>
    </div>
  );
}

export default {
  TopProgressBar,
  Pulse,
  DashboardGhost,
  PropertiesGhost,
  TableGhost,
  DetailGhost,
  SettingsGhost,
  SubscriptionGhost,
  BillsGhost,
  PaymentsGhost,
  PublicPageGhost,
};
