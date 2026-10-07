'use client';

import React, { useState } from 'react';
import { Investigation } from '@/types';
import { downloadJsonReport, openPrintableReport } from '@/lib/storage';
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  FolderDown, 
  ArrowRight
} from 'lucide-react';

interface ReportsViewProps {
  investigations: Investigation[];
  onSelectCase: (investigation: Investigation) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  investigations,
  onSelectCase
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = investigations.filter(inv => {
    if (filterSeverity !== 'all' && inv.riskLevel !== filterSeverity) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inv.url.toLowerCase().includes(q) ||
        (inv.suspectedBrandName || '').toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportAllJson = () => {
    const masterExport = {
      archiveName: 'UPI-Shield-Investigations-Archive',
      exportedAt: new Date().toISOString(),
      disclaimer: 'DEMO INVESTIGATION DATA - DEFENSIVE TRIAGE HEURISTICS ONLY',
      totalCases: investigations.length,
      cases: investigations
    };

    const blob = new Blob([JSON.stringify(masterExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UPI-Shield-Full-Archive-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Reports Header & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Incident Dossier & Report Generator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Produce audited local investigative summaries in JSON or printable format for cyber incident reviews.
          </p>
        </div>

        <button
          onClick={handleExportAllJson}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <FolderDown className="w-4 h-4" />
          <span>Export All Cases (.JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter dossiers by URL or brand..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-slate-400 font-medium">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">All Dossiers</option>
            <option value="HIGH">High Severity Only</option>
            <option value="MEDIUM">Medium Severity Only</option>
            <option value="LOW">Low Severity Only</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inv) => {
          const isHigh = inv.riskLevel === 'HIGH';
          const isMed = inv.riskLevel === 'MEDIUM';

          return (
            <div
              key={inv.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                    {inv.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                    isHigh ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    isMed ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {inv.riskLevel} ({inv.riskScore}/100)
                  </span>
                </div>

                <h3 className="text-xs font-bold font-mono text-slate-200 truncate" title={inv.url}>
                  {inv.url}
                </h3>
                <div className="text-[11px] text-slate-400 mt-1">
                  Target: <strong className="text-slate-300">{inv.suspectedBrandName || 'Unspecified'}</strong>
                </div>

                <div className="mt-3 p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-[11px] space-y-1">
                  <div className="text-slate-400 flex justify-between">
                    <span>Status:</span>
                    <strong className="text-slate-200">{inv.status}</strong>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Signals Flagged:</span>
                    <strong className="text-cyan-400">{inv.detectionSignals.length} triggers</strong>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Host / IP:</span>
                    <span className="font-mono text-slate-300">{inv.clues.simulatedIp}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectCase(inv)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Review Case</span>
                  <ArrowRight className="w-3 h-3" />
                </button>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => openPrintableReport(inv)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
                    title="Print HTML Report / PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => downloadJsonReport(inv)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
                    title="Download JSON Report"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
