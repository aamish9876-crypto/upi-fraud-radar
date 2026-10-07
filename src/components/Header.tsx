'use client';

import React, { useState, useEffect } from 'react';
import { User, Clock } from 'lucide-react';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  onOpenAnalyzer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab }) => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'overview':
        return { title: 'Executive Overview', subtitle: 'Real-time triage telemetry & deceptive page detections' };
      case 'investigations':
        return { title: 'Investigation Queue', subtitle: 'Dissecting reported suspicious domains and fake payment traps' };
      case 'campaign-graph':
        return { title: 'Threat Campaign Graph', subtitle: 'Correlating shared infrastructure, telephony, and mule wallets' };
      case 'reports':
        return { title: 'Incident Dossiers & Reports', subtitle: 'Download and export audited technical findings for local review' };
      case 'settings':
        return { title: 'Detection Engine & Rules', subtitle: 'Inspect deterministic scoring weights and test configurations' };
    }
  };

  const { title, subtitle } = getTabTitle(currentTab);

  return (
    <header className="h-18 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/80 px-8 flex items-center justify-between sticky top-0 z-30 shadow-md shadow-black/40">
      {/* Title & View Context */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-base font-bold text-slate-100 tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h1>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded font-semibold tracking-wide">
            v1.0-DEFENSE
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Live SOC Timestamp */}
        {timeString && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{timeString}</span>
          </div>
        )}

        {/* Environment Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-200 font-medium text-[11px]">Demo Mode</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 font-mono text-[10.5px]">Air-Gapped Heuristics</span>
        </div>

        {/* Analyst Profile: NOVA NEXUS */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-600 to-indigo-600 border border-cyan-400/50 flex items-center justify-center text-white shadow-md shadow-cyan-950/50 relative">
            <User className="w-4 h-4" />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950"></span>
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-100 tracking-tight">NOVA NEXUS</div>
            <div className="text-[10px] text-slate-400 font-medium">Cyber Triage Analyst</div>
          </div>
        </div>
      </div>
    </header>
  );
};
