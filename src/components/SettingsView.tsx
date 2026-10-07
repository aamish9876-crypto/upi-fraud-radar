'use client';

import React, { useState } from 'react';
import { SUSPICIOUS_KEYWORDS, HIGH_RISK_TLDS, FICTIONAL_BRANDS, DEMO_DISCLAIMER } from '@/lib/constants';
import { resetToDefaultSamples } from '@/lib/storage';
import { 
  Sliders, 
  ShieldAlert, 
  RotateCcw, 
  Check, 
  Code
} from 'lucide-react';

interface SettingsViewProps {
  onDataReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onDataReset }) => {
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetToDefaultSamples();
    setResetDone(true);
    onDataReset();
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Demo Scope & Safety Statement */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2.5 text-sm font-bold text-slate-100">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <span>Demo Sandbox Scope & Safety Policy</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {DEMO_DISCLAIMER}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px] text-slate-400 font-mono">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <strong className="text-emerald-400 block mb-1">✓ Safe Defensive Scope</strong>
            • Offline deterministic syntax analysis only<br />
            • No automated network calls to target URLs<br />
            • Synthetic RFC-documented IPs & test VPAs<br />
            • Local reports exportable in JSON & HTML
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <strong className="text-rose-400 block mb-1">✗ Prohibited Capabilities</strong>
            • No credential/OTP/PIN intercept or storage<br />
            • No live crawling or web form submissions<br />
            • No real-time takedown API execution<br />
            • No real individuals or organizations targeted
          </div>
        </div>
      </div>

      {/* Heuristic Scoring Rule Weights Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Explainable Scoring Engine Matrix</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Deterministic weights mapped to URL attributes. Cumulative score is clamped to 0–100.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Rule / Keyword Token</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Weight</th>
                <th className="py-2.5 px-3">Cybersecurity Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose-400">Raw IP Hostname</td>
                <td className="py-2.5 px-3 text-slate-400">Domain & Hosting</td>
                <td className="py-2.5 px-3 text-cyan-400 font-bold">+30 pts</td>
                <td className="py-2.5 px-3 font-sans text-xs text-slate-300">
                  Legitimate banks and UPI gateways operate behind trusted FQDNs with TLS, never raw IPv4/IPv6 addresses.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose-400">Brand in Subdomain</td>
                <td className="py-2.5 px-3 text-slate-400">Brand Impersonation</td>
                <td className="py-2.5 px-3 text-cyan-400 font-bold">+35 pts</td>
                <td className="py-2.5 px-3 font-sans text-xs text-slate-300">
                  Subdomain prefix embeds brand name while apex domain belongs to an unauthorized third party.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-rose-400">Brand Lookalike / Squatting</td>
                <td className="py-2.5 px-3 text-slate-400">Brand Impersonation</td>
                <td className="py-2.5 px-3 text-cyan-400 font-bold">+30 pts</td>
                <td className="py-2.5 px-3 font-sans text-xs text-slate-300">
                  Domain includes brand moniker but is absent from official authority namespace.
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-amber-400">High-Risk TLD</td>
                <td className="py-2.5 px-3 text-slate-400">Domain & Hosting</td>
                <td className="py-2.5 px-3 text-cyan-400 font-bold">+18 pts</td>
                <td className="py-2.5 px-3 font-sans text-xs text-slate-300">
                  Disproportionately high correlation with throwaway spam kits ({HIGH_RISK_TLDS.slice(0, 5).join(', ')}...).
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-amber-400">Excessive Hyphenation</td>
                <td className="py-2.5 px-3 text-slate-400">Domain & Hosting</td>
                <td className="py-2.5 px-3 text-cyan-400 font-bold">+15 pts</td>
                <td className="py-2.5 px-3 font-sans text-xs text-slate-300">
                  Domain strings chaining ≥2 hyphens to construct fake authoritative titles.
                </td>
              </tr>
              {SUSPICIOUS_KEYWORDS.slice(0, 6).map((k) => (
                <tr key={k.term}>
                  <td className="py-2.5 px-3 font-bold text-sky-400">&ldquo;{k.term.toUpperCase()}&rdquo;</td>
                  <td className="py-2.5 px-3 text-slate-400">Phishing Keywords</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">+{k.weight} pts</td>
                  <td className="py-2.5 px-3 font-sans text-xs text-slate-300">{k.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Fictional Brands Scope */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" />
          <span>Fictional Monitored Entities ({FICTIONAL_BRANDS.length})</span>
        </h3>
        <p className="text-xs text-slate-400">
          The prototype maintains an authoritative test registry for the following fictional financial institutions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {FICTIONAL_BRANDS.map(brand => (
            <div key={brand.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-200">{brand.name}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                  {brand.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{brand.description}</p>
              <div className="text-[10px] font-mono text-emerald-400">
                Official: {brand.officialDomains.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Storage & Reset Option */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-200">Reset Local Demo Fixtures</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Clears local modifications and restores the original 8 sample investigations.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-900/60 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          {resetDone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <RotateCcw className="w-3.5 h-3.5" />}
          <span>{resetDone ? 'Reset Successful!' : 'Restore Default Samples'}</span>
        </button>
      </div>
    </div>
  );
};
