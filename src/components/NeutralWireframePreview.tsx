'use client';

import React from 'react';
import { Investigation } from '@/types';
import { AlertTriangle, Lock, EyeOff } from 'lucide-react';

interface NeutralWireframePreviewProps {
  investigation: Investigation;
}

export const NeutralWireframePreview: React.FC<NeutralWireframePreviewProps> = ({
  investigation
}) => {
  const { wireframe, riskLevel } = investigation;
  const isHighRisk = riskLevel === 'HIGH';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
      {/* Wireframe Browser Frame Mockup */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          </div>
          <span className="text-[11px] text-slate-400 font-medium pl-2">
            Safe Neutral Wireframe (No Live Scripts)
          </span>
        </div>

        <div className="flex items-center space-x-2 font-mono text-[11px] bg-slate-950 px-3 py-1 rounded border border-slate-800 text-slate-400 truncate max-w-sm">
          <Lock className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate">{investigation.url}</span>
        </div>

        <div className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
          Neutral Abstract View
        </div>
      </div>

      {/* Wireframe Canvas */}
      <div className="p-6 bg-slate-950/80">
        {/* Threat Summary Banner */}
        <div className={`p-4 rounded-lg mb-6 border flex items-start gap-3 ${
          isHighRisk 
            ? 'bg-rose-950/30 border-rose-900/60 text-rose-300' 
            : 'bg-sky-950/30 border-sky-900/60 text-sky-300'
        }`}>
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isHighRisk ? 'text-rose-400' : 'text-sky-400'}`} />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide">
              {wireframe.pageType}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {wireframe.threatSummary}
            </p>
          </div>
        </div>

        {/* Abstract Safe UI Representation */}
        <div className="max-w-md mx-auto bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 text-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
              [Simulated Layout Wireframe]
            </span>
          </div>

          {wireframe.elements.map((el) => {
            if (el.type === 'header') {
              return (
                <div key={el.id} className="text-center py-2">
                  <h3 className="text-sm font-bold text-slate-200">{el.label}</h3>
                </div>
              );
            }

            if (el.type === 'warning') {
              return (
                <div key={el.id} className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-lg text-amber-300 text-xs">
                  <div className="font-semibold">{el.label}</div>
                  {el.isSuspiciousTrap && el.trapReason && (
                    <div className="mt-1 text-[11px] text-rose-400 font-mono flex items-start gap-1">
                      <span>↳ Flagged Indicator:</span> {el.trapReason}
                    </div>
                  )}
                </div>
              );
            }

            if (el.type === 'badge') {
              return (
                <div key={el.id} className="text-center">
                  <span className="inline-block px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-cyan-300 font-mono">
                    {el.label}
                  </span>
                  {el.isSuspiciousTrap && el.trapReason && (
                    <div className="mt-1 text-[11px] text-rose-400 font-mono text-center">
                      ↳ {el.trapReason}
                    </div>
                  )}
                </div>
              );
            }

            if (el.type === 'text') {
              return (
                <div key={el.id} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg">
                  <p className="text-xs text-slate-300 leading-relaxed">{el.label}</p>
                  {el.isSuspiciousTrap && el.trapReason && (
                    <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-rose-400 font-semibold font-mono">
                      ⚠️ {el.trapReason}
                    </div>
                  )}
                </div>
              );
            }

            if (el.type === 'input') {
              return (
                <div key={el.id} className="space-y-1">
                  <label className="text-xs font-medium text-slate-400 block">{el.label}</label>
                  <div className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-500 flex items-center justify-between">
                    <span>{el.valuePlaceholder || 'Input Field'}</span>
                    {el.isSuspiciousTrap && <EyeOff className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                  {el.isSuspiciousTrap && el.trapReason && (
                    <div className="text-[10px] text-rose-400 font-mono">
                      ↳ Sensitive Harvester: {el.trapReason}
                    </div>
                  )}
                </div>
              );
            }

            if (el.type === 'button') {
              return (
                <div key={el.id} className="pt-2">
                  <div className="w-full py-2 px-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs font-medium text-center font-mono">
                    [Form Submission Action: {el.label}]
                  </div>
                </div>
              );
            }

            return null;
          })}

          <div className="border-t border-slate-800 pt-3 text-center">
            <span className="text-[10px] text-slate-500">
              Interactive forms are disabled in this defensive preview sandbox.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
