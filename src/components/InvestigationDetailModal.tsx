'use client';

import React, { useState } from 'react';
import { Investigation, InvestigationStatus } from '@/types';
import { NeutralWireframePreview } from './NeutralWireframePreview';
import { downloadJsonReport, openPrintableReport } from '@/lib/storage';
import { 
  X, 
  Download, 
  Printer, 
  Network, 
  Save, 
  Check, 
  Layers, 
  Phone, 
  CreditCard, 
  Server, 
  Globe, 
  Calendar,
  FileText
} from 'lucide-react';

interface InvestigationDetailModalProps {
  investigation: Investigation | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatusAndNotes: (id: string, status: InvestigationStatus, notes: string) => void;
  onNavigateToCampaign?: (campaignId: string) => void;
}

export const InvestigationDetailModal: React.FC<InvestigationDetailModalProps> = ({
  investigation,
  isOpen,
  onClose,
  onUpdateStatusAndNotes,
  onNavigateToCampaign
}) => {
  const [activeTab, setActiveTab] = useState<'signals' | 'wireframe' | 'clues'>('signals');
  const [currentStatus, setCurrentStatus] = useState<InvestigationStatus>(investigation?.status || 'New');
  const [notes, setNotes] = useState(investigation?.analystNotes || '');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  if (!isOpen || !investigation) return null;

  const handleStatusChange = (newStatus: InvestigationStatus) => {
    setCurrentStatus(newStatus);
    onUpdateStatusAndNotes(investigation.id, newStatus, notes);
    triggerSavedFeedback();
  };

  const handleSaveNotes = () => {
    onUpdateStatusAndNotes(investigation.id, currentStatus, notes);
    triggerSavedFeedback();
  };

  const triggerSavedFeedback = () => {
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const isHigh = investigation.riskLevel === 'HIGH';
  const isMed = investigation.riskLevel === 'MEDIUM';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-start space-x-4">
            {/* High-Tech Circular Score Gauge */}
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className="stroke-slate-800"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  className={
                    isHigh ? 'stroke-rose-500' : isMed ? 'stroke-amber-500' : 'stroke-emerald-500'
                  }
                  strokeWidth="5"
                  strokeDasharray={163.36}
                  strokeDashoffset={163.36 - (163.36 * investigation.riskScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-base font-extrabold font-mono leading-none ${
                  isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {investigation.riskScore}
                </span>
                <span className="text-[8px] uppercase font-mono text-slate-400 font-bold tracking-tight mt-0.5">
                  {investigation.riskLevel}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/80">
                  {investigation.id}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(investigation.submittedAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-100 font-mono mt-1 break-all select-all">
                {investigation.url}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">Suspected Target:</span>
                <span className="text-xs font-semibold text-slate-200 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {investigation.suspectedBrandName || 'Unspecified'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => openPrintableReport(investigation)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Print Dossier / Export PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => downloadJsonReport(investigation)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Download JSON Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('signals')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'signals'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Detection Signals ({investigation.detectionSignals.length})
            </button>
            <button
              onClick={() => setActiveTab('clues')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'clues'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Infrastructure Clues
            </button>
            <button
              onClick={() => setActiveTab('wireframe')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'wireframe'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Neutral Wireframe Preview
            </button>
          </div>

          {/* Quick status dropdown on tab bar */}
          <div className="flex items-center space-x-2 py-2">
            <span className="text-[11px] text-slate-400 font-medium">Status:</span>
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value as InvestigationStatus)}
              className="bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="New">New</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Confirmed suspicious">Confirmed suspicious</option>
              <option value="False positive">False positive</option>
            </select>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: Detection Signals */}
          {activeTab === 'signals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    Explainable Detection Reasons
                  </h3>
                  <p className="text-xs text-slate-400">
                    Transparent rule triggers that contributed to the cumulative risk score ({investigation.riskScore}/100)
                  </p>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {investigation.detectionSignals.length} triggers evaluated
                </div>
              </div>

              {investigation.detectionSignals.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-xs">
                  No suspicious syntactic signals flagged for this URL.
                </div>
              ) : (
                <div className="space-y-3">
                  {investigation.detectionSignals.map((sig) => {
                    const isCrit = sig.severity === 'critical';
                    const isHighSig = sig.severity === 'high';
                    const isMedSig = sig.severity === 'medium';

                    return (
                      <div
                        key={sig.id}
                        className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 mt-0.5 ${
                              isCrit ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                              isHighSig ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                              isMedSig ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                              'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            }`}>
                              {sig.severity}
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-200">
                                {sig.title}
                              </h4>
                              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                {sig.explanation}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono text-xs font-bold text-cyan-400">
                              {sig.scoreImpact > 0 ? `+${sig.scoreImpact}` : sig.scoreImpact} pts
                            </span>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {sig.ruleCategory}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-800/60 font-mono text-[11px] text-slate-400 bg-slate-900/40 px-2.5 py-1.5 rounded">
                          <span className="text-cyan-400 font-semibold">Technical Detail:</span> {sig.technicalDetail}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Infrastructure Clues */}
          {activeTab === 'clues' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    Linked Synthetic Infrastructure Clues
                  </h3>
                  <p className="text-xs text-slate-400">
                    Simulated investigative telemetry for cross-campaign correlation.
                  </p>
                </div>
                {investigation.clues.simulatedCampaignId && onNavigateToCampaign && (
                  <button
                    onClick={() => onNavigateToCampaign(investigation.clues.simulatedCampaignId!)}
                    className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800/80 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>View in Campaign Graph</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Domain & DNS */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>Domain & DNS Profile</span>
                  </div>
                  <div className="text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Domain Apex:</span>
                      <span className="text-slate-200">{investigation.clues.domain}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Subdomain:</span>
                      <span className="text-slate-200">{investigation.clues.subdomain || '[None]'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Registrar (Simulated):</span>
                      <span className="text-slate-200">{investigation.clues.simulatedRegistrar || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Direct IP Mode:</span>
                      <span className={investigation.clues.isIpAddress ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                        {investigation.clues.isIpAddress ? 'Yes (Raw IP Host)' : 'No (FQDN)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hosting & ASN */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>Hosting & Infrastructure</span>
                  </div>
                  <div className="text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Host IP:</span>
                      <span className="text-cyan-300">{investigation.clues.simulatedIp}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Autonomous System:</span>
                      <span className="text-slate-200">{investigation.clues.simulatedAsn}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Provider:</span>
                      <span className="text-slate-200">{investigation.clues.simulatedHostingProvider}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Geo Test Zone:</span>
                      <span className="text-slate-200">{investigation.clues.simulatedCountry}</span>
                    </div>
                  </div>
                </div>

                {/* Telephony & Mule Accounts */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Telephony Clue (SMS / Caller)</span>
                  </div>
                  <div className="text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Sender Identifier:</span>
                      <span className="text-emerald-300">{investigation.clues.simulatedPhoneClue || 'None reported'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pt-1 font-sans">
                      Reported as the originating SMS sender header or WhatsApp outreach number.
                    </div>
                  </div>
                </div>

                {/* Mule VPA / Payment Clue */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span>Mule Wallet / VPA Clue</span>
                  </div>
                  <div className="text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between py-1 border-b border-slate-900">
                      <span className="text-slate-500">Receiver Handle:</span>
                      <span className="text-indigo-300">{investigation.clues.simulatedWalletClue || 'None reported'}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 pt-1 font-sans">
                      Designated beneficiary handle where illicit fund routing was attempted.
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Attribution Box */}
              {investigation.clues.simulatedCampaignName && (
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-indigo-400" />
                    <div>
                      <div className="text-xs font-bold text-indigo-200">
                        Associated Campaign: {investigation.clues.simulatedCampaignName}
                      </div>
                      <div className="text-[11px] text-indigo-300/80">
                        Shares infrastructure telemetry and lure themes with other reported cases.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Neutral Wireframe */}
          {activeTab === 'wireframe' && (
            <NeutralWireframePreview investigation={investigation} />
          )}

          {/* Analyst Case Notes Section */}
          <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Analyst Investigation Notes</span>
              </label>
              {isSavedNotice && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3 h-3" /> Saved to local storage
                </span>
              )}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record forensic observations, takedown correspondence, or case triage notes..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Notes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            Heuristic results are demo approximations and do not constitute a legal fraud verdict.
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => openPrintableReport(investigation)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={() => downloadJsonReport(investigation)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-cyan-950"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
