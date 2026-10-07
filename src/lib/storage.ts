import { Investigation, InvestigationStatus } from '@/types';
import { SAMPLE_INVESTIGATIONS } from '@/data/sampleInvestigations';

const STORAGE_KEY = 'upi_shield_investigations_v1';

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach(fn => fn());
}

export function subscribeToInvestigations(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

let cachedSnapshot: Investigation[] = SAMPLE_INVESTIGATIONS;
let cachedRaw: string | null = null;

export function getClientSnapshot(): Investigation[] {
  if (typeof window === 'undefined') return SAMPLE_INVESTIGATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      if (!raw) {
        cachedSnapshot = SAMPLE_INVESTIGATIONS;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_INVESTIGATIONS));
      } else {
        const parsed = JSON.parse(raw) as Investigation[];
        const map = new Map<string, Investigation>();
        parsed.forEach(item => map.set(item.id, item));
        SAMPLE_INVESTIGATIONS.forEach(sample => {
          if (!map.has(sample.id)) {
            map.set(sample.id, sample);
          }
        });
        cachedSnapshot = Array.from(map.values());
      }
    }
    return cachedSnapshot;
  } catch {
    return SAMPLE_INVESTIGATIONS;
  }
}

export function getServerSnapshot(): Investigation[] {
  return SAMPLE_INVESTIGATIONS;
}

export function getStoredInvestigations(): Investigation[] {
  return getClientSnapshot();
}

export function saveInvestigation(investigation: Investigation): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getClientSnapshot();
    const index = current.findIndex(c => c.id === investigation.id);
    let updated: Investigation[];

    if (index >= 0) {
      updated = [...current];
      updated[index] = investigation;
    } else {
      updated = [investigation, ...current];
    }

    cachedRaw = JSON.stringify(updated);
    cachedSnapshot = updated;
    localStorage.setItem(STORAGE_KEY, cachedRaw);
    notifyListeners();
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function updateCaseStatusAndNotes(
  id: string,
  status: InvestigationStatus,
  notes: string
): Investigation | null {
  const current = getStoredInvestigations();
  const index = current.findIndex(c => c.id === id);
  if (index === -1) return null;

  const updatedItem: Investigation = {
    ...current[index],
    status,
    analystNotes: notes
  };

  saveInvestigation(updatedItem);
  return updatedItem;
}

export function resetToDefaultSamples(): void {
  if (typeof window === 'undefined') return;
  cachedSnapshot = SAMPLE_INVESTIGATIONS;
  cachedRaw = JSON.stringify(SAMPLE_INVESTIGATIONS);
  localStorage.setItem(STORAGE_KEY, cachedRaw);
  notifyListeners();
}

/**
 * Generates structured JSON export for a case
 */
export function downloadJsonReport(inv: Investigation): void {
  const reportPayload = {
    reportType: 'UPI Shield Defensive Analysis Report',
    disclaimer: 'DEMO EVALUATION ONLY. Not a legal accusation or live threat intelligence verdict.',
    generatedAt: new Date().toISOString(),
    caseId: inv.id,
    targetUrl: inv.url,
    suspectedBrand: inv.suspectedBrandName,
    riskScore: inv.riskScore,
    riskLevel: inv.riskLevel,
    triageStatus: inv.status,
    analystNotes: inv.analystNotes || 'None recorded.',
    detectionSignals: inv.detectionSignals.map(sig => ({
      title: sig.title,
      severity: sig.severity,
      scoreWeight: sig.scoreImpact,
      category: sig.ruleCategory,
      explanation: sig.explanation,
      technicalDetail: sig.technicalDetail
    })),
    infrastructureClues: inv.clues,
    wireframePreviewMetadata: inv.wireframe
  };

  const blob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `UPI-Shield-Report-${inv.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Triggers a clean printable report window
 */
export function openPrintableReport(inv: Investigation): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const signalsHtml = inv.detectionSignals.map(s => `
    <div style="border-left: 3px solid ${s.severity === 'critical' || s.severity === 'high' ? '#ef4444' : s.severity === 'medium' ? '#f59e0b' : '#10b981'}; padding-left: 10px; margin-bottom: 12px;">
      <div style="font-weight: 600; font-size: 14px;">${s.title} (${s.severity.toUpperCase()} · +${s.scoreImpact} pts)</div>
      <div style="font-size: 13px; color: #475569; margin-top: 2px;">${s.explanation}</div>
      <div style="font-size: 11px; color: #64748b; font-family: monospace; margin-top: 2px;">${s.technicalDetail}</div>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>UPI Shield Case Report - ${inv.id}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; line-height: 1.5; }
        .header { border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 12px; }
        .badge-high { background: #fee2e2; color: #991b1b; }
        .badge-med { background: #fef3c7; color: #92400e; }
        .badge-low { background: #dcfce7; color: #166534; }
        .section { margin-bottom: 24px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #fafafa; }
        .section-title { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #334155; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; }
        .disclaimer { background: #fff7ed; border: 1px solid #ffedd5; padding: 12px; border-radius: 6px; font-size: 12px; color: #9a3412; margin-top: 30px; }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1 style="margin: 0; font-size: 24px; color: #0369a1;">🛡️ UPI SHIELD | Incident Investigation Report</h1>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Defensive Cyber Triage Dossier · Demo Environment</div>
        </div>
        <div style="text-align: right;">
          <div class="badge ${inv.riskLevel === 'HIGH' ? 'badge-high' : inv.riskLevel === 'MEDIUM' ? 'badge-med' : 'badge-low'}">
            ${inv.riskLevel} RISK (${inv.riskScore} / 100)
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Status: <strong>${inv.status}</strong></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Case Metadata</div>
        <div class="grid">
          <div><strong>Case ID:</strong> ${inv.id}</div>
          <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
          <div><strong>Suspected Brand:</strong> ${inv.suspectedBrandName || 'Unspecified'}</div>
          <div><strong>Submitted Date:</strong> ${new Date(inv.submittedAt).toLocaleString()}</div>
          <div style="grid-column: span 2;"><strong>Analyzed URL:</strong> <code style="word-break: break-all; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${inv.url}</code></div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Explainable Heuristic Signals (${inv.detectionSignals.length} Detected)</div>
        ${signalsHtml}
      </div>

      <div class="section">
        <div class="section-title">Synthetic Infrastructure Clues</div>
        <div class="grid">
          <div><strong>Domain:</strong> ${inv.clues.domain}</div>
          <div><strong>Host IP:</strong> ${inv.clues.simulatedIp}</div>
          <div><strong>Hosting Provider:</strong> ${inv.clues.simulatedHostingProvider}</div>
          <div><strong>Autonomous System:</strong> ${inv.clues.simulatedAsn}</div>
          <div><strong>Contact Clue:</strong> ${inv.clues.simulatedPhoneClue || 'None'}</div>
          <div><strong>Wallet / VPA Clue:</strong> ${inv.clues.simulatedWalletClue || 'None'}</div>
          <div><strong>Associated Campaign:</strong> ${inv.clues.simulatedCampaignName || 'Unassigned Cluster'}</div>
          <div><strong>Registrar:</strong> ${inv.clues.simulatedRegistrar || 'Unknown'}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Analyst Notes & Assessment</div>
        <div style="font-size: 13px; color: #334155; font-style: italic; white-space: pre-wrap;">
          ${inv.analystNotes || 'No notes entered by investigating analyst.'}
        </div>
      </div>

      <div class="disclaimer">
        <strong>⚠️ DEMO EVALUATION DISCLAIMER:</strong> This report was compiled by the UPI Shield defensive heuristic prototype using local syntactic rule evaluation and fictional test data fixtures. It does NOT represent definitive proof of criminal activity, does NOT connect to live external threat feeds, and does NOT initiate takedown actions.
      </div>

      <div class="no-print" style="margin-top: 24px; text-align: center;">
        <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 10px 20px; font-weight: 600; border-radius: 6px; cursor: pointer;">
          Print / Save as PDF
        </button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
