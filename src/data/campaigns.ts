import { Campaign, CampaignGraphEdge, CampaignGraphNode } from '@/types';

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-apex-kyc',
    name: 'ApexKYC Syndicate',
    codeName: 'CAMP-APEX-SYNDICATE-01',
    description: 'Coordinated infrastructure deploying fake KYC urgency warnings and unencrypted IP gateways targeting retail and merchant banking credentials.',
    riskLevel: 'HIGH',
    firstDetected: '2026-09-28',
    tactics: [
      'Urgent SMS KYC account freeze pretexts',
      'Bulletproof hosting (HostPhantom VPS)',
      'Raw IP hosting without TLS',
      'Netbanking password & 2FA OTP interception'
    ],
    targetBrands: ['ApexBank', 'BharatPay Gateway'],
    caseIds: ['case-apex-01', 'case-bharatpay-03', 'case-apex-06'],
    nodes: [
      {
        id: 'node-c-apex',
        label: 'ApexKYC Syndicate',
        type: 'campaign',
        subtext: 'Central Threat Cluster',
        riskLevel: 'HIGH',
        associatedCases: ['case-apex-01', 'case-bharatpay-03', 'case-apex-06'],
        metadata: {
          threatCluster: 'ApexKYC-Actor',
          focus: 'Retail Banking Credential Harvest',
          origin: 'Synthetic Demo Threat Tracking'
        },
        x: 320,
        y: 200
      },
      {
        id: 'node-dom-apex1',
        label: 'apex-bank-kyc-verify.top',
        type: 'domain',
        subtext: 'Fake KYC Phish',
        riskLevel: 'HIGH',
        associatedCases: ['case-apex-01'],
        metadata: { registrar: 'NameShield Fictional Registrar Ltd', tld: '.top' },
        x: 140,
        y: 90
      },
      {
        id: 'node-dom-apex2',
        label: 'apexbank-secure-alerts.info',
        type: 'domain',
        subtext: 'Alert Lookalike',
        riskLevel: 'MEDIUM',
        associatedCases: ['case-apex-06'],
        metadata: { registrar: 'NameShield Fictional Registrar Ltd', tld: '.info' },
        x: 500,
        y: 90
      },
      {
        id: 'node-ip-42',
        label: '198.51.100.42',
        type: 'ip',
        subtext: 'AS64512 (HostPhantom)',
        riskLevel: 'HIGH',
        associatedCases: ['case-apex-01', 'case-bharatpay-03'],
        metadata: { provider: 'HostPhantom Bulletproof VPS', type: 'Raw Dedicated Server' },
        x: 220,
        y: 330
      },
      {
        id: 'node-ip-89',
        label: '198.51.100.89',
        type: 'ip',
        subtext: 'AS64512 (Secondary IP)',
        riskLevel: 'MEDIUM',
        associatedCases: ['case-apex-06'],
        metadata: { provider: 'HostPhantom Secondary Subnet' },
        x: 440,
        y: 330
      },
      {
        id: 'node-phone-01928',
        label: '+91 98XXX-01928',
        type: 'phone',
        subtext: 'SMS Sender Clue',
        riskLevel: 'HIGH',
        associatedCases: ['case-apex-01', 'case-bharatpay-03', 'case-apex-06'],
        metadata: { carrier: 'Sample Telecom Marker', purpose: 'Phishing SMS Originator' },
        x: 100,
        y: 230
      },
      {
        id: 'node-wallet-apex',
        label: 'apex-support99@fakepay',
        type: 'wallet',
        subtext: 'Mule Wallet Clue',
        riskLevel: 'HIGH',
        associatedCases: ['case-apex-01'],
        metadata: { psp: 'FakePay UPI Switch', flaggedDate: '2026-10-06' },
        x: 550,
        y: 230
      }
    ],
    edges: [
      { id: 'e-1', source: 'node-c-apex', target: 'node-dom-apex1', label: 'deploys lure' },
      { id: 'e-2', source: 'node-c-apex', target: 'node-dom-apex2', label: 'deploys secondary' },
      { id: 'e-3', source: 'node-dom-apex1', target: 'node-ip-42', label: 'hosted on' },
      { id: 'e-4', source: 'node-dom-apex2', target: 'node-ip-89', label: 'hosted on' },
      { id: 'e-5', source: 'node-phone-01928', target: 'node-c-apex', label: 'shares contact clue' },
      { id: 'e-6', source: 'node-c-apex', target: 'node-wallet-apex', label: 'funnels to wallet' },
      { id: 'e-7', source: 'node-ip-42', target: 'node-c-apex', label: 'shared IP server' }
    ]
  },
  {
    id: 'camp-golden-lure',
    name: 'Operation GoldenLure',
    codeName: 'CAMP-GOLDEN-LURE-02',
    description: 'Mass social media lure campaign distributing bogus festive scratch-cards and cashback offers to coerce victims into entering their UPI PIN.',
    riskLevel: 'HIGH',
    firstDetected: '2026-10-01',
    tactics: [
      'Viral WhatsApp festive scratch cards',
      'Deceptive "PIN required to receive cashback" prompt',
      'Disposable .xyz and .net domains',
      'Mule UPI handles for illicit credit routings'
    ],
    targetBrands: ['QuickPay', 'FastRupee Wallet'],
    caseIds: ['case-quickpay-02', 'case-fastrupee-05'],
    nodes: [
      {
        id: 'node-c-golden',
        label: 'Operation GoldenLure',
        type: 'campaign',
        subtext: 'Cashback Fraud Network',
        riskLevel: 'HIGH',
        associatedCases: ['case-quickpay-02', 'case-fastrupee-05'],
        metadata: {
          tactic: 'UPI PIN Debit Trap',
          socialVectors: 'WhatsApp / Telegram groups'
        },
        x: 320,
        y: 190
      },
      {
        id: 'node-dom-qp',
        label: 'quickpay-reward-claim2025.xyz',
        type: 'domain',
        subtext: 'Fake Voucher Lure',
        riskLevel: 'HIGH',
        associatedCases: ['case-quickpay-02'],
        metadata: { registrar: 'GlobalCheapDomains Inc', tld: '.xyz' },
        x: 130,
        y: 100
      },
      {
        id: 'node-dom-fr',
        label: 'fastrupee-refund-portal.net',
        type: 'domain',
        subtext: 'Fake Refund Clue',
        riskLevel: 'MEDIUM',
        associatedCases: ['case-fastrupee-05'],
        metadata: { registrar: 'GlobalCheapDomains Inc', tld: '.net' },
        x: 510,
        y: 100
      },
      {
        id: 'node-ip-77',
        label: '198.51.100.77',
        type: 'ip',
        subtext: 'AS64520 (Demo Cloud)',
        riskLevel: 'HIGH',
        associatedCases: ['case-quickpay-02', 'case-fastrupee-05'],
        metadata: { host: 'Demo Cloud VPS Network' },
        x: 320,
        y: 330
      },
      {
        id: 'node-phone-55219',
        label: '+91 98XXX-55219',
        type: 'phone',
        subtext: 'Shared WhatsApp Vector',
        riskLevel: 'HIGH',
        associatedCases: ['case-quickpay-02', 'case-fastrupee-05'],
        metadata: { origin: 'WhatsApp Broadcast Forwarder' },
        x: 110,
        y: 250
      },
      {
        id: 'node-wallet-golden',
        label: 'reward-ops-99@fakeupi',
        type: 'wallet',
        subtext: 'Mule Destination VPA',
        riskLevel: 'HIGH',
        associatedCases: ['case-quickpay-02'],
        metadata: { vpaType: 'Target Receiver Handle' },
        x: 530,
        y: 250
      }
    ],
    edges: [
      { id: 'eg-1', source: 'node-c-golden', target: 'node-dom-qp', label: 'distributes reward lure' },
      { id: 'eg-2', source: 'node-c-golden', target: 'node-dom-fr', label: 'distributes refund lure' },
      { id: 'eg-3', source: 'node-dom-qp', target: 'node-ip-77', label: 'hosted on' },
      { id: 'eg-4', source: 'node-dom-fr', target: 'node-ip-77', label: 'hosted on' },
      { id: 'eg-5', source: 'node-phone-55219', target: 'node-c-golden', label: 'reported with' },
      { id: 'eg-6', source: 'node-c-golden', target: 'node-wallet-golden', label: 'shares receiver wallet' }
    ]
  },
  {
    id: 'camp-mitra-phish',
    name: 'Mitra Support Phish',
    codeName: 'CAMP-MITRA-DESK-03',
    description: 'Impersonation of cooperative banking customer care utilizing fake account block alerts and deceptive telephone helpdesks.',
    riskLevel: 'HIGH',
    firstDetected: '2026-10-04',
    tactics: [
      'Fake utility bill account freeze SMS',
      'Bogus customer helpline telephone funnel',
      'Card PIN and OTP collection forms',
      'Fast-flux disposable server switching'
    ],
    targetBrands: ['Mitra Cooperative Bank'],
    caseIds: ['case-mitra-04'],
    nodes: [
      {
        id: 'node-c-mitra',
        label: 'Mitra Support Phish',
        type: 'campaign',
        subtext: 'Fake Helpline Ring',
        riskLevel: 'HIGH',
        associatedCases: ['case-mitra-04'],
        metadata: { tactic: 'Fake Bank Support Desk' },
        x: 320,
        y: 190
      },
      {
        id: 'node-dom-mitra',
        label: 'mitrabank-support-desk.click',
        type: 'domain',
        subtext: 'Fake Support Portal',
        riskLevel: 'HIGH',
        associatedCases: ['case-mitra-04'],
        metadata: { registrar: 'FastReg Domain Agency', tld: '.click' },
        x: 150,
        y: 100
      },
      {
        id: 'node-ip-88',
        label: '203.0.113.88',
        type: 'ip',
        subtext: 'AS64535 (Fast-Flux)',
        riskLevel: 'HIGH',
        associatedCases: ['case-mitra-04'],
        metadata: { proxy: 'Bulletproof reverse proxy' },
        x: 480,
        y: 100
      },
      {
        id: 'node-phone-mitra',
        label: '+91 99XXX-88124',
        type: 'phone',
        subtext: 'Fake Support Helpline',
        riskLevel: 'HIGH',
        associatedCases: ['case-mitra-04'],
        metadata: { type: 'Fraudulent IVR / WhatsApp' },
        x: 180,
        y: 320
      },
      {
        id: 'node-wallet-mitra',
        label: 'mitra-desk@fakepay',
        type: 'wallet',
        subtext: 'Mule Wallet Clue',
        riskLevel: 'HIGH',
        associatedCases: ['case-mitra-04'],
        metadata: { category: 'Simulated Fee Mule' },
        x: 460,
        y: 320
      }
    ],
    edges: [
      { id: 'em-1', source: 'node-c-mitra', target: 'node-dom-mitra', label: 'deploys fake desk' },
      { id: 'em-2', source: 'node-dom-mitra', target: 'node-ip-88', label: 'hosted on' },
      { id: 'em-3', source: 'node-phone-mitra', target: 'node-c-mitra', label: 'reported helpline' },
      { id: 'em-4', source: 'node-c-mitra', target: 'node-wallet-mitra', label: 'diverts processing fees' }
    ]
  }
];

// Helper to get all nodes and edges across campaigns or for a combined view
export function getAllCampaignGraphData(): { nodes: CampaignGraphNode[]; edges: CampaignGraphEdge[] } {
  const nodeMap = new Map<string, CampaignGraphNode>();
  const edges: CampaignGraphEdge[] = [];

  for (const camp of CAMPAIGNS) {
    for (const node of camp.nodes) {
      if (!nodeMap.has(node.id)) {
        nodeMap.set(node.id, node);
      }
    }
    for (const edge of camp.edges) {
      edges.push(edge);
    }
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges
  };
}
