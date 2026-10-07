'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { Investigation, InvestigationStatus } from '@/types';
import { 
  subscribeToInvestigations, 
  getClientSnapshot, 
  getServerSnapshot, 
  saveInvestigation, 
  updateCaseStatusAndNotes,
  resetToDefaultSamples 
} from '@/lib/storage';
import { Sidebar, NavTab } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { StatsOverview } from '@/components/StatsOverview';
import { InvestigationsTable } from '@/components/InvestigationsTable';
import { CampaignGraphView } from '@/components/CampaignGraphView';
import { ReportsView } from '@/components/ReportsView';
import { SettingsView } from '@/components/SettingsView';
import { UrlAnalyzerModal } from '@/components/UrlAnalyzerModal';
import { InvestigationDetailModal } from '@/components/InvestigationDetailModal';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const investigations = useSyncExternalStore(
    subscribeToInvestigations,
    getClientSnapshot,
    getServerSnapshot
  );
  const [selectedCase, setSelectedCase] = useState<Investigation | null>(null);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);
  const [activeCampaignGraphFilter, setActiveCampaignGraphFilter] = useState<string | undefined>(undefined);

  const handleAnalysisComplete = (newInvestigation: Investigation) => {
    saveInvestigation(newInvestigation);
    setIsAnalyzerOpen(false);
    // Directly open the inspection dossier for the analyzed URL
    setSelectedCase(newInvestigation);
  };

  const handleUpdateStatusAndNotes = (id: string, status: InvestigationStatus, notes: string) => {
    const updated = updateCaseStatusAndNotes(id, status, notes);
    if (updated && selectedCase?.id === id) {
      setSelectedCase(updated);
    }
  };

  const handleNavigateToCampaign = (campaignId: string) => {
    setSelectedCase(null);
    setActiveCampaignGraphFilter(campaignId);
    setCurrentTab('campaign-graph');
  };

  const handleSelectCaseById = (caseId: string) => {
    const found = investigations.find(i => i.id === caseId);
    if (found) {
      setSelectedCase(found);
    }
  };

  const handleDataReset = () => {
    resetToDefaultSamples();
    setSelectedCase(null);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab === 'campaign-graph') {
            setActiveCampaignGraphFilter(undefined);
          }
        }}
        onOpenAnalyzer={() => setIsAnalyzerOpen(true)}
        caseCount={investigations.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenAnalyzer={() => setIsAnalyzerOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'overview' && (
            <StatsOverview
              investigations={investigations}
              onSelectCase={(inv) => setSelectedCase(inv)}
              onOpenAnalyzer={() => setIsAnalyzerOpen(true)}
              onViewAllInvestigations={() => setCurrentTab('investigations')}
            />
          )}

          {currentTab === 'investigations' && (
            <InvestigationsTable
              investigations={investigations}
              onSelectCase={(inv) => setSelectedCase(inv)}
              onOpenAnalyzer={() => setIsAnalyzerOpen(true)}
            />
          )}

          {currentTab === 'campaign-graph' && (
            <CampaignGraphView
              onSelectCaseById={handleSelectCaseById}
              selectedCampaignId={activeCampaignGraphFilter}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              investigations={investigations}
              onSelectCase={(inv) => setSelectedCase(inv)}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              onDataReset={handleDataReset}
            />
          )}
        </main>
      </div>

      {/* URL Analysis Modal */}
      <UrlAnalyzerModal
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
        onAnalysisComplete={handleAnalysisComplete}
      />

      {/* Investigation Dossier Detail Modal */}
      <InvestigationDetailModal
        key={selectedCase?.id || 'none'}
        investigation={selectedCase}
        isOpen={selectedCase !== null}
        onClose={() => setSelectedCase(null)}
        onUpdateStatusAndNotes={handleUpdateStatusAndNotes}
        onNavigateToCampaign={handleNavigateToCampaign}
      />
    </div>
  );
}
