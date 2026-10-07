'use client';

import React from 'react';
import { Investigation } from '@/types';
import { CAMPAIGNS } from '@/data/campaigns';
import { 
  Clock, 
  Layers, 
  Search, 
  ArrowUpRight, 
  Zap,
  Flame,
  Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';

interface StatsOverviewProps {
  investigations: Investigation[];
  onSelectCase: (investigation: Investigation) => void;
  onOpenAnalyzer: () => void;
  onViewAllInvestigations: () => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  investigations,
  onSelectCase,
  onOpenAnalyzer,
  onViewAllInvestigations
}) => {
  const totalAnalyzed = investigations.length;
  const highRiskCount = investigations.filter(i => i.riskLevel === 'HIGH').length;
  const mediumRiskCount = investigations.filter(i => i.riskLevel === 'MEDIUM').length;
  const lowRiskCount = investigations.filter(i => i.riskLevel === 'LOW').length;
  const pendingReviewCount = investigations.filter(i => i.status === 'New' || i.status === 'Reviewing').length;
  const campaignCount = CAMPAIGNS.length;

  const highPct = totalAnalyzed > 0 ? Math.round((highRiskCount / totalAnalyzed) * 100) : 0;
  const medPct = totalAnalyzed > 0 ? Math.round((mediumRiskCount / totalAnalyzed) * 100) : 0;
  const lowPct = totalAnalyzed > 0 ? Math.round((lowRiskCount / totalAnalyzed) * 100) : 0;

  const riskData = [
    { name: 'High Risk', count: highRiskCount, color: '#f43f5e' },
    { name: 'Medium Risk', count: mediumRiskCount, color: '#f59e0b' },
    { name: 'Low / Benign', count: lowRiskCount, color: '#10b981' }
  ];

  // Count top detection signal categories
  const categoryCount: Record<string, number> = {};
  investigations.forEach(inv => {
    inv.detectionSignals.forEach(sig => {
      categoryCount[sig.ruleCategory] = (categoryCount[sig.ruleCategory] || 0) + 1;
    });
  });

  const categoryData = Object.entries(categoryCount).map(([name, count]) => ({
    name: name.replace(' & ', ' &\n'),
    count
  })).sort((a, b) => b.count - a.count);

  const recentCases = investigations.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero Tactical Briefing Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 p-5 sm:p-6 shadow-xl shadow-black/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 via-sky-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-950/60 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 tracking-tight">
                  Deterministic Defensive Triage Engine
                </h2>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  REAL-TIME PARSER
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                Analyzing URL structures, lookalike brand vectors, and synthetic metadata offline. Designed to protect consumers from fake UPI payment traps and deceptive banking portals without outbound network calls.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Zero External Egress
                </span>
                <span>•</span>
                <span className="text-slate-300">RFC-5737 Test Fixtures</span>
                <span>•</span>
                <span className="text-slate-300">Deterministic Scoring (0–100)</span>
              </div>
            </div>
          </div>
          <button
            onClick={onOpenAnalyzer}
            className="shrink-0 group relative px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-950/60 flex items-center gap-2 transition-all active:scale-[0.98] border border-cyan-400/40 cursor-pointer"
          >
            <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Analyze New Link</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: URLs Analyzed */}
        <div className="cyber-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">URLs Analyzed</span>
            <div className="w-9 h-9 rounded-xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400 shadow-sm">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-100 tracking-tight">{totalAnalyzed}</span>
            <span className="text-xs text-slate-400 font-medium">cases logged</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-cyan-400 font-medium flex items-center gap-1 font-mono">
              <Radio className="w-3 h-3 animate-pulse" /> 100% Offline
            </span>
            <span className="text-slate-500 font-mono">Local DB</span>
          </div>
        </div>

        {/* Card 2: High-Risk Cases */}
        <div className="cyber-card rounded-2xl p-5 relative overflow-hidden group hover:border-rose-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High-Risk Deceptions</span>
            <div className="w-9 h-9 rounded-xl bg-rose-950/80 border border-rose-800/60 flex items-center justify-center text-rose-400 shadow-sm">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-rose-400 tracking-tight">{highRiskCount}</span>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
              {highPct}% of total
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-rose-400 font-medium font-mono">Score ≥ 70 / 100</span>
            <span className="text-slate-500 font-mono">Requires Action</span>
          </div>
        </div>

        {/* Card 3: Active Campaigns */}
        <div className="cyber-card rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campaign Clusters</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shadow-sm">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-indigo-400 tracking-tight">{campaignCount}</span>
            <span className="text-xs text-slate-400 font-medium">active rings</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-indigo-300 font-medium font-mono">Shared Clues Linked</span>
            <span className="text-slate-500 font-mono">Graph View</span>
          </div>
        </div>

        {/* Card 4: Pending Triage */}
        <div className="cyber-card rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Review</span>
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 shadow-sm">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-400 tracking-tight">{pendingReviewCount}</span>
            <span className="text-xs text-amber-300/80 font-medium font-mono">in queue</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-amber-400 font-medium font-mono">New / Reviewing</span>
            <span className="text-slate-500 font-mono">Triage Queue</span>
          </div>
        </div>
      </div>

      {/* Two Column Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Chart */}
        <div className="cyber-card rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-100">Risk Severity Breakdown</h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                TOTAL: {totalAnalyzed}
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Proportion of flagged URL threat scores</p>

            <div className="h-44 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0b1120" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b1120', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner ring text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs font-mono font-bold text-slate-200">{totalAnalyzed}</span>
                <span className="text-[9px] uppercase font-mono text-slate-500">Cases</span>
              </div>
            </div>
          </div>

          {/* Detailed Progress Bars Legend */}
          <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> High Risk (70–100)
                </span>
                <span className="text-slate-300 font-bold">{highRiskCount} ({highPct}%)</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${highPct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Medium Risk (35–69)
                </span>
                <span className="text-slate-300 font-bold">{mediumRiskCount} ({medPct}%)</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${medPct}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low / Benign (0–34)
                </span>
                <span className="text-slate-300 font-bold">{lowRiskCount} ({lowPct}%)</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${lowPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Detection Rules Trigger Breakdown */}
        <div className="cyber-card rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-100">Most Triggered Heuristic Rules</h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                CYBER MATRIX
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Distribution of detection signals triggered across cases</p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" stroke="#475569" fontSize={11} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={130} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b1120', borderColor: '#334155', borderRadius: '10px', fontSize: '12px' }}
                    itemStyle={{ color: '#38bdf8' }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {categoryData.map((_, index) => (
                      <Cell key={`bar-${index}`} fill={index === 0 ? '#38bdf8' : index === 1 ? '#0284c7' : index === 2 ? '#2563eb' : '#4f46e5'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Primary Vector: <strong className="text-cyan-300">Brand Impersonation & Urgency KYC</strong></span>
            <span className="text-slate-500">Auto-updated</span>
          </div>
        </div>
      </div>

      {/* Recent Investigations List Preview */}
      <div className="cyber-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Recent Investigations Queue</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                ACTIVE
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Latest analyzed URLs with heuristic scores and brand targets</p>
          </div>
          <button
            onClick={onViewAllInvestigations}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors cursor-pointer group"
          >
            <span>View All Queue</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Analyzed URL</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Suspected Brand</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Risk Score</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px]">Key Detection Signal</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-[10px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
              {recentCases.map((inv) => {
                const isHigh = inv.riskLevel === 'HIGH';
                const isMed = inv.riskLevel === 'MEDIUM';

                return (
                  <tr 
                    key={inv.id} 
                    className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    onClick={() => onSelectCase(inv)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-200 font-semibold truncate max-w-xs">{inv.url}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{inv.clues.domain}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                        {inv.suspectedBrandName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono shadow-sm ${
                          isHigh ? 'bg-rose-950/90 text-rose-300 border border-rose-700/80 shadow-rose-950/50' :
                          isMed ? 'bg-amber-950/90 text-amber-300 border border-amber-700/80 shadow-amber-950/50' :
                          'bg-emerald-950/90 text-emerald-300 border border-emerald-700/80 shadow-emerald-950/50'
                        }`}>
                          {inv.riskScore}
                        </span>
                        <span className={`text-[11px] font-bold uppercase font-mono ${
                          isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {inv.riskLevel}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase ${
                        inv.status === 'Confirmed suspicious' ? 'bg-rose-950/80 text-rose-300 border border-rose-800' :
                        inv.status === 'Reviewing' ? 'bg-amber-950/80 text-amber-300 border border-amber-800' :
                        inv.status === 'False positive' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' :
                        'bg-sky-950/80 text-sky-300 border border-sky-800'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      <span className="truncate block max-w-xs text-slate-300 font-medium">
                        {inv.detectionSignals[0]?.title || 'No flags'}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        +{inv.detectionSignals[0]?.scoreImpact || 0} pts
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase(inv);
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 rounded-lg text-xs font-semibold transition-colors border border-slate-700/80 hover:border-cyan-500/40 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
