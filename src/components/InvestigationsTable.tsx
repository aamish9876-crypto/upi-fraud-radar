'use client';

import React, { useState, useMemo } from 'react';
import { Investigation } from '@/types';
import { FICTIONAL_BRANDS } from '@/lib/constants';
import { downloadJsonReport } from '@/lib/storage';
import { 
  Search, 
  Filter, 
  Download, 
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  Copy,
  Check
} from 'lucide-react';

interface InvestigationsTableProps {
  investigations: Investigation[];
  onSelectCase: (investigation: Investigation) => void;
  onOpenAnalyzer: () => void;
}

export const InvestigationsTable: React.FC<InvestigationsTableProps> = ({
  investigations,
  onSelectCase,
  onOpenAnalyzer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredData = useMemo(() => {
    return investigations.filter((inv) => {
      // Search query (URL, Brand, Domain)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesUrl = inv.url.toLowerCase().includes(query);
        const matchesBrand = (inv.suspectedBrandName || '').toLowerCase().includes(query);
        const matchesDomain = inv.clues.domain.toLowerCase().includes(query);
        const matchesId = inv.id.toLowerCase().includes(query);
        if (!matchesUrl && !matchesBrand && !matchesDomain && !matchesId) {
          return false;
        }
      }

      // Risk Filter
      if (riskFilter !== 'all' && inv.riskLevel !== riskFilter) {
        return false;
      }

      // Status Filter
      if (statusFilter !== 'all' && inv.status !== statusFilter) {
        return false;
      }

      // Brand Filter
      if (brandFilter !== 'all' && inv.suspectedBrandId !== brandFilter) {
        return false;
      }

      return true;
    });
  }, [investigations, searchQuery, riskFilter, statusFilter, brandFilter]);

  const handleCopyUrl = (url: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setRiskFilter('all');
    setStatusFilter('all');
    setBrandFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || riskFilter !== 'all' || statusFilter !== 'all' || brandFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by URL, domain, case ID, or suspected brand..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action: New Analysis */}
          <button
            onClick={onOpenAnalyzer}
            className="shrink-0 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-900/40 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Analyze URL</span>
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filters:</span>
          </div>

          {/* Risk Level */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">Risk: All Severities</option>
            <option value="HIGH">High Risk (70-100)</option>
            <option value="MEDIUM">Medium Risk (35-69)</option>
            <option value="LOW">Low Risk (0-34)</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">Status: All States</option>
            <option value="New">New</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Confirmed suspicious">Confirmed suspicious</option>
            <option value="False positive">False positive</option>
          </select>

          {/* Brand */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="all">Brand: All Targets</option>
            {FICTIONAL_BRANDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 ml-auto cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                <th className="py-3 px-4 font-semibold">Analyzed URL / Target Host</th>
                <th className="py-3 px-4 font-semibold">Suspected Brand</th>
                <th className="py-3 px-4 font-semibold">Risk Score</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Key Detection Signal</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="font-semibold text-slate-300">No matching investigations found</p>
                      <p className="text-[11px] text-slate-500">
                        Try modifying your search query or clearing active filters.
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={handleResetFilters}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-xs font-medium cursor-pointer"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((inv) => {
                  const isHigh = inv.riskLevel === 'HIGH';
                  const isMed = inv.riskLevel === 'MEDIUM';

                  return (
                    <tr
                      key={inv.id}
                      onClick={() => onSelectCase(inv)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* URL & Domain */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-slate-200 truncate max-w-sm block">
                            {inv.url}
                          </span>
                          <button
                            onClick={(e) => handleCopyUrl(inv.url, inv.id, e)}
                            className="text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                            title="Copy URL"
                          >
                            {copiedId === inv.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] text-slate-500">
                            {inv.clues.domain}
                          </span>
                          {inv.clues.isIpAddress && (
                            <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1 rounded font-mono">
                              RAW IP
                            </span>
                          )}
                          <span className="text-slate-600 text-[10px]">·</span>
                          <span className="text-[10px] font-mono text-slate-500">{inv.id}</span>
                        </div>
                      </td>

                      {/* Suspected Brand */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-200">
                          {inv.suspectedBrandName || 'Unspecified'}
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                            isHigh ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                            isMed ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {inv.riskScore}
                          </span>
                          <span className={`text-[11px] font-medium uppercase font-mono ${
                            isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {inv.riskLevel}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          inv.status === 'Confirmed suspicious' ? 'bg-rose-900/60 text-rose-300 border border-rose-800' :
                          inv.status === 'Reviewing' ? 'bg-amber-900/60 text-amber-300 border border-amber-800' :
                          inv.status === 'False positive' ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-800' :
                          'bg-sky-900/60 text-sky-300 border border-sky-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>

                      {/* Key Detection Signal */}
                      <td className="py-3.5 px-4 text-slate-400">
                        <span className="truncate block max-w-xs text-slate-300">
                          {inv.detectionSignals[0]?.title || 'No flags'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          +{inv.detectionSignals[0]?.scoreImpact || 0} pts impact
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(inv.submittedAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectCase(inv)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => downloadJsonReport(inv)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                            title="Download Report JSON"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Count */}
        <div className="p-3 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredData.length} of {investigations.length} cases</span>
          <span>Offline Defensive Triage Sandbox</span>
        </div>
      </div>
    </div>
  );
};
