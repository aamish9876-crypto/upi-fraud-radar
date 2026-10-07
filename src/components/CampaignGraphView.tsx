'use client';

import React, { useState, useMemo } from 'react';
import { CAMPAIGNS } from '@/data/campaigns';
import { CampaignGraphNode, CampaignGraphEdge, NodeType } from '@/types';
import { 
  Network, 
  Layers, 
  Globe, 
  Server, 
  Phone, 
  CreditCard, 
  ArrowRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Info
} from 'lucide-react';

interface CampaignGraphViewProps {
  onSelectCaseById: (caseId: string) => void;
  selectedCampaignId?: string;
}

export const CampaignGraphView: React.FC<CampaignGraphViewProps> = ({
  onSelectCaseById,
  selectedCampaignId: initialCampaignId
}) => {
  const [activeCampaignFilter, setActiveCampaignFilter] = useState<string>(initialCampaignId || 'all');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Compute filtered nodes and edges
  const { filteredNodes, filteredEdges, activeCampaignObj } = useMemo(() => {
    let nodes: CampaignGraphNode[] = [];
    let edges: CampaignGraphEdge[] = [];
    let campaignObj = undefined;

    if (activeCampaignFilter === 'all') {
      const nodeMap = new Map<string, CampaignGraphNode>();
      // Offset positions slightly for combined view
      CAMPAIGNS.forEach((camp, cIdx) => {
        const xOffset = (cIdx % 2) * 360;
        const yOffset = Math.floor(cIdx / 2) * 360;
        camp.nodes.forEach(n => {
          if (!nodeMap.has(n.id)) {
            nodeMap.set(n.id, {
              ...n,
              x: (n.x || 300) + xOffset,
              y: (n.y || 200) + yOffset
            });
          }
        });
        edges.push(...camp.edges);
      });
      nodes = Array.from(nodeMap.values());
    } else {
      campaignObj = CAMPAIGNS.find(c => c.id === activeCampaignFilter);
      if (campaignObj) {
        nodes = campaignObj.nodes;
        edges = campaignObj.edges;
      }
    }

    if (typeFilter !== 'all') {
      nodes = nodes.filter(n => n.type === typeFilter);
      const nodeIds = new Set(nodes.map(n => n.id));
      edges = edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
    }

    return { filteredNodes: nodes, filteredEdges: edges, activeCampaignObj: campaignObj };
  }, [activeCampaignFilter, typeFilter]);

  const selectedNode = useMemo(() => {
    return filteredNodes.find(n => n.id === selectedNodeId) || null;
  }, [filteredNodes, selectedNodeId]);

  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case 'campaign':
        return { bg: '#312e81', border: '#818cf8', text: '#c7d2fe', dot: '#a5b4fc' };
      case 'domain':
        return { bg: '#881337', border: '#f43f5e', text: '#fecdd3', dot: '#fb7185' };
      case 'ip':
        return { bg: '#083344', border: '#06b6d4', text: '#cffafe', dot: '#22d3ee' };
      case 'phone':
        return { bg: '#064e3b', border: '#10b981', text: '#a7f3d0', dot: '#34d399' };
      case 'wallet':
        return { bg: '#451a03', border: '#f59e0b', text: '#fde68a', dot: '#fbbf24' };
      default:
        return { bg: '#1e293b', border: '#64748b', text: '#cbd5e1', dot: '#94a3b8' };
    }
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'campaign':
        return <Layers className="w-3.5 h-3.5" />;
      case 'domain':
        return <Globe className="w-3.5 h-3.5" />;
      case 'ip':
        return <Server className="w-3.5 h-3.5" />;
      case 'phone':
        return <Phone className="w-3.5 h-3.5" />;
      case 'wallet':
        return <CreditCard className="w-3.5 h-3.5" />;
      default:
        return <Network className="w-3.5 h-3.5" />;
    }
  };

  // SVG viewBox coordinates
  const viewBoxWidth = activeCampaignFilter === 'all' ? 1000 : 700;
  const viewBoxHeight = activeCampaignFilter === 'all' ? 700 : 450;

  return (
    <div className="space-y-4">
      {/* Investigative Notice Callout */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-cyan-300">Investigative Notice:</strong> Graph connections illustrate correlated synthetic infrastructure indicators (shared hosting subnets, common SMS originators, mule payment accounts). <em>Connections are investigative clues and do not prove common ownership.</em>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Campaign Filter Tabs */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Campaign:</span>
          <button
            onClick={() => { setActiveCampaignFilter('all'); setSelectedNodeId(null); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCampaignFilter === 'all'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Clusters ({CAMPAIGNS.length})
          </button>
          {CAMPAIGNS.map(camp => (
            <button
              key={camp.id}
              onClick={() => { setActiveCampaignFilter(camp.id); setSelectedNodeId(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeCampaignFilter === camp.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {camp.name}
            </button>
          ))}
        </div>

        {/* Node Type Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-semibold">Filter Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="all">All Entity Types</option>
            <option value="campaign">Threat Campaigns</option>
            <option value="domain">Domains</option>
            <option value="ip">Hosting / IPs</option>
            <option value="phone">Telephony Clues</option>
            <option value="wallet">Mule Wallets</option>
          </select>
        </div>
      </div>

      {/* Main Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Canvas Area */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden relative min-h-[480px] flex flex-col">
          {/* Canvas Controls Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 rounded-lg p-1 text-slate-400">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.6))}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.7))}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1.5 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-slate-500">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>

          {/* Interactive SVG Diagram */}
          <div className="flex-1 w-full h-full overflow-auto flex items-center justify-center p-4">
            <svg
              viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
              className="w-full h-auto transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="8"
                  markerHeight="6"
                  refX="14"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#475569" />
                </marker>
                <marker
                  id="arrowhead-active"
                  markerWidth="8"
                  markerHeight="6"
                  refX="14"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 8 3, 0 6" fill="#38bdf8" />
                </marker>
                <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Render Graph Edges */}
              {filteredEdges.map((edge) => {
                const sourceNode = filteredNodes.find(n => n.id === edge.source);
                const targetNode = filteredNodes.find(n => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const sx = sourceNode.x || 100;
                const sy = sourceNode.y || 100;
                const tx = targetNode.x || 200;
                const ty = targetNode.y || 200;
                const mx = (sx + tx) / 2;
                const my = (sy + ty) / 2;

                const isConnectedToSelected = selectedNodeId === edge.source || selectedNodeId === edge.target;

                return (
                  <g key={edge.id} className="transition-all">
                    {/* Line path */}
                    <line
                      x1={sx}
                      y1={sy}
                      x2={tx}
                      y2={ty}
                      stroke={isConnectedToSelected ? '#38bdf8' : '#334155'}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                      strokeDasharray={isConnectedToSelected ? 'none' : '4 2'}
                      markerEnd={isConnectedToSelected ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                    />
                    {/* Edge Label Pill */}
                    <rect
                      x={mx - (edge.label.length * 3.2)}
                      y={my - 8}
                      width={edge.label.length * 6.4}
                      height={16}
                      rx={4}
                      fill="#0f172a"
                      stroke={isConnectedToSelected ? '#0284c7' : '#1e293b'}
                      strokeWidth={1}
                    />
                    <text
                      x={mx}
                      y={my + 3}
                      fill={isConnectedToSelected ? '#38bdf8' : '#94a3b8'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Render Graph Nodes */}
              {filteredNodes.map((node) => {
                const colors = getNodeColor(node.type);
                const isSelected = selectedNodeId === node.id;
                const nx = node.x || 150;
                const ny = node.y || 150;
                const isCamp = node.type === 'campaign';

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform"
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    {/* Pulsing ring for selected node or campaign */}
                    {isSelected && (
                      <circle
                        cx={nx}
                        cy={ny}
                        r={isCamp ? 42 : 32}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth={2}
                        strokeDasharray="4 2"
                        className="animate-spin"
                        style={{ transformOrigin: `${nx}px ${ny}px` }}
                      />
                    )}

                    {/* Node Body */}
                    {isCamp ? (
                      <circle
                        cx={nx}
                        cy={ny}
                        r={34}
                        fill={colors.bg}
                        stroke={isSelected ? '#38bdf8' : colors.border}
                        strokeWidth={isSelected ? 3 : 2}
                        className="filter drop-shadow-md"
                      />
                    ) : (
                      <rect
                        x={nx - 60}
                        y={ny - 22}
                        width={120}
                        height={44}
                        rx={10}
                        fill={colors.bg}
                        stroke={isSelected ? '#38bdf8' : colors.border}
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        className="filter drop-shadow-md"
                      />
                    )}

                    {/* Icon indicator dot */}
                    <circle
                      cx={isCamp ? nx : nx - 42}
                      cy={isCamp ? ny - 10 : ny}
                      r={4}
                      fill={colors.dot}
                    />

                    {/* Label & Subtext */}
                    {isCamp ? (
                      <>
                        <text
                          x={nx}
                          y={ny + 4}
                          fill={colors.text}
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {node.label.length > 14 ? node.label.substring(0, 12) + '...' : node.label}
                        </text>
                        <text
                          x={nx}
                          y={ny + 16}
                          fill="#94a3b8"
                          fontSize="8"
                          textAnchor="middle"
                        >
                          {node.subtext}
                        </text>
                      </>
                    ) : (
                      <>
                        <text
                          x={nx - 30}
                          y={ny - 4}
                          fill={colors.text}
                          fontSize="10"
                          fontWeight="600"
                          fontFamily="monospace"
                        >
                          {node.label.length > 15 ? node.label.substring(0, 14) + '...' : node.label}
                        </text>
                        <text
                          x={nx - 30}
                          y={ny + 9}
                          fill="#94a3b8"
                          fontSize="8.5"
                          fontFamily="monospace"
                        >
                          {node.subtext}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Canvas Legend Bar */}
          <div className="bg-slate-900 border-t border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-300">Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-[11px]">Threat Cluster</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-[11px]">Domain</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                <span className="text-[11px]">IP / Host</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-[11px]">Phone Clue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-[11px]">Mule Wallet</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Click any node to inspect telemetry
            </div>
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                <span>Entity Inspector</span>
              </h3>
              <p className="text-xs text-slate-400">
                Detailed telemetry for selected graph node
              </p>
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                {/* Node Type & Header */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono bg-slate-800 text-cyan-300 border border-slate-700 flex items-center gap-1">
                      {getNodeIcon(selectedNode.type)}
                      <span>{selectedNode.type}</span>
                    </span>
                    {selectedNode.riskLevel && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        selectedNode.riskLevel === 'HIGH' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {selectedNode.riskLevel} Risk
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold font-mono text-slate-100 break-all">
                    {selectedNode.label}
                  </div>
                  <div className="text-xs text-slate-400">
                    {selectedNode.subtext}
                  </div>
                </div>

                {/* Metadata Attributes */}
                {selectedNode.metadata && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-300">
                      Telemetry Attributes
                    </h4>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs font-mono">
                      {Object.entries(selectedNode.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-slate-900 last:border-0">
                          <span className="text-slate-500 capitalize">{key}:</span>
                          <span className="text-slate-300 text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connected Investigations */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Associated Cases ({selectedNode.associatedCases.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedNode.associatedCases.map((caseId) => (
                      <div
                        key={caseId}
                        className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-cyan-400 font-mono">{caseId}</div>
                          <div className="text-[11px] text-slate-400">Correlated incident dossier</div>
                        </div>
                        <button
                          onClick={() => onSelectCaseById(caseId)}
                          className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 text-slate-400 text-xs space-y-2">
                <Network className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p>No entity selected.</p>
                <p className="text-[11px] text-slate-500">
                  Click any node in the SVG diagram to view associated threat clues and case dossiers.
                </p>
              </div>
            )}
          </div>

          {/* Active Campaign Dossier Summary */}
          {activeCampaignObj && (
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs">
              <div className="text-slate-400 font-semibold mb-1">
                Campaign Profile: {activeCampaignObj.name}
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
                {activeCampaignObj.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {activeCampaignObj.targetBrands.map((brand, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    Target: {brand}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
