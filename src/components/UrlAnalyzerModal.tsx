'use client';

import React, { useState } from 'react';
import { FICTIONAL_BRANDS } from '@/lib/constants';
import { analyzeUrl } from '@/lib/analyzer';
import { Investigation } from '@/types';
import { 
  X, 
  AlertTriangle, 
  Search, 
  ArrowRight, 
  Sparkles,
  Info
} from 'lucide-react';

interface UrlAnalyzerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (result: Investigation) => void;
}

export const UrlAnalyzerModal: React.FC<UrlAnalyzerModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickSamples = [
    { label: 'Fake Cashback Phish', url: 'https://quickpay-reward-claim2025.xyz/cashback?user=win', brand: 'quickpay' },
    { label: 'Raw IP Bank Phish', url: 'http://198.51.100.42/bharatpay/login/otp-verify.html', brand: 'bharatpay' },
    { label: 'Urgent KYC Freeze', url: 'http://apex-bank-kyc-verify.top/urgent-update', brand: 'apex-bank' },
    { label: 'Account Unblock Trap', url: 'https://mitrabank-support-desk.click/unblock-account', brand: 'mitrabank' },
    { label: 'Legitimate Brand Domain', url: 'https://quickpay.internal.test/dashboard', brand: 'quickpay' },
  ];

  const handleQuickFill = (sampleUrl: string, sampleBrand: string) => {
    setUrlInput(sampleUrl);
    setSelectedBrand(sampleBrand);
    setError(null);
  };

  const handleStartAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError('Please provide a URL to analyze.');
      return;
    }

    if (trimmed.length < 4) {
      setError('URL string is too short to parse.');
      return;
    }

    setError(null);
    setIsScanning(true);
    setScanStep(1);

    // Fast simulated progressive scan steps to provide realistic cybersecurity feedback
    setTimeout(() => setScanStep(2), 250);
    setTimeout(() => setScanStep(3), 500);
    setTimeout(() => {
      const result = analyzeUrl({
        url: trimmed,
        suspectedBrandId: selectedBrand || undefined
      });
      setIsScanning(false);
      setScanStep(0);
      onAnalysisComplete(result);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-950/95 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-900/90 via-slate-950 to-slate-900/90">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 p-0.5 shadow-md shadow-cyan-950">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Analyze Suspicious URL</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-semibold">
                  OFFLINE RADAR
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Safe, offline triage parsing. Never visits or submits data to the entered address.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleStartAnalysis} className="p-6 space-y-5">
          {/* Quick Sample Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Try Sample Test Cases (Fictional)</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickSamples.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickFill(sample.url, sample.brand)}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 hover:border-cyan-500/50 transition-all cursor-pointer"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Suspicious URL or Hostname</span>
              <span className="text-[11px] text-slate-400">Supports http://, https://, or raw hostname/IP</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. http://apex-bank-kyc-verify.top/urgent-update"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-3 text-sm font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                disabled={isScanning}
                autoFocus
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput('')}
                  className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Suspected Brand Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Suspected Target Brand (Optional)</span>
              <span className="text-[11px] text-slate-400">Auto-detects from URL if left unselected</span>
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              disabled={isScanning}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            >
              <option value="">-- Auto-Detect Suspected Brand --</option>
              {FICTIONAL_BRANDS.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name} ({brand.category})
                </option>
              ))}
            </select>
          </div>

          {/* Safety Notice Box */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed text-[11px]">
              <span className="text-slate-300 font-medium">Safe Local Parsing:</span> This MVP operates in defensive mode. No outbound network connection is established to the target domain, and no forms or scripts are executed.
            </div>
          </div>

          {/* Dynamic Scanning Status or Submit Button */}
          {isScanning ? (
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-300 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  Processing Local Defensive Heuristics...
                </span>
                <span className="text-cyan-400 font-mono text-[11px]">Step {scanStep}/3</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${(scanStep / 3) * 100}%` }}
                ></div>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {scanStep === 1 && '› Parsing URI tokens, hostname, and path structure...'}
                {scanStep === 2 && '› Checking brand impersonation & high-urgency keywords...'}
                {scanStep === 3 && '› Correlating synthetic infrastructure clues & scoring...'}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg shadow-md shadow-cyan-900/40 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Analyze URL</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
