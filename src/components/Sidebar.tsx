'use client';

import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  SearchCode, 
  Network, 
  FileText, 
  Sliders, 
  AlertTriangle,
  PlusCircle,
  Radio
} from 'lucide-react';

export type NavTab = 'overview' | 'investigations' | 'campaign-graph' | 'reports' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAnalyzer: () => void;
  caseCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAnalyzer,
  caseCount
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'investigations', label: 'Investigations', icon: <SearchCode className="w-4 h-4" />, badge: caseCount },
    { id: 'campaign-graph', label: 'Campaign Graph', icon: <Network className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', label: 'Rules & Settings', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-20">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/60 bg-gradient-to-b from-slate-900/50 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40 relative">
              <ShieldCheck className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base text-slate-100 tracking-tight">UPI Shield</span>
                <span className="text-[9px] uppercase font-bold tracking-wider bg-cyan-950/90 text-cyan-300 border border-cyan-800/80 px-1.5 py-0.5 rounded shadow-sm">
                  PRO-SOC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Deceptive Banking Radar</p>
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Offline Triage</span>
            </span>
            <span className="font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.2 rounded">
              AIR-GAPPED
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="p-4">
          <button
            onClick={onOpenAnalyzer}
            className="w-full relative group overflow-hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg shadow-cyan-950/50 hover:shadow-cyan-500/20 transition-all duration-200 active:scale-[0.98] border border-cyan-400/40 cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <PlusCircle className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-90 duration-200" />
            <span>Analyze Suspicious URL</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-cyan-300 border border-cyan-500/30 shadow-md shadow-slate-950/80 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-cyan-400 before:rounded-r'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Safety Notice Footer */}
      <div className="p-4 pb-8 border-t border-slate-800/60 bg-slate-950/90">
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-start gap-2 text-[10.5px] text-slate-400 leading-relaxed shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-slate-200 font-semibold">Demo Sandbox:</span> Offline syntactic heuristic parsing. No credentials stored, no external URLs requested.
          </div>
        </div>
      </div>
    </aside>
  );
};
