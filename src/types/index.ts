export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type InvestigationStatus = 'New' | 'Reviewing' | 'Confirmed suspicious' | 'False positive';

export type SignalSeverity = 'low' | 'medium' | 'high' | 'critical';

export type RuleCategory = 
  | 'Domain & Hosting'
  | 'Brand Impersonation'
  | 'Phishing Keywords'
  | 'Credential Harvesting'
  | 'Obfuscation & Redirects';

export interface Brand {
  id: string;
  name: string;
  officialDomains: string[];
  brandTerms: string[];
  category: 'Bank' | 'UPI App' | 'Payment Gateway' | 'Mobile Wallet';
  description: string;
}

export interface DetectionSignal {
  id: string;
  title: string;
  severity: SignalSeverity;
  scoreImpact: number;
  explanation: string;
  technicalDetail: string;
  ruleCategory: RuleCategory;
}

export interface PageWireframeElement {
  id: string;
  type: 'header' | 'input' | 'button' | 'badge' | 'warning' | 'text';
  label: string;
  valuePlaceholder?: string;
  isSuspiciousTrap: boolean;
  trapReason?: string;
}

export interface InfrastructureClues {
  domain: string;
  tld: string;
  subdomain: string;
  path: string;
  isIpAddress: boolean;
  simulatedIp: string;
  simulatedAsn: string;
  simulatedHostingProvider: string;
  simulatedCountry: string;
  simulatedPhoneClue?: string;
  simulatedWalletClue?: string;
  simulatedRegistrar?: string;
  simulatedCampaignId?: string;
  simulatedCampaignName?: string;
  requestedSensitiveFields: string[];
}

export interface Investigation {
  id: string;
  url: string;
  submittedAt: string;
  suspectedBrandId?: string;
  suspectedBrandName?: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: InvestigationStatus;
  analystNotes: string;
  detectionSignals: DetectionSignal[];
  clues: InfrastructureClues;
  wireframe: {
    title: string;
    pageType: string;
    threatSummary: string;
    elements: PageWireframeElement[];
  };
  isCustomAnalyzed?: boolean;
}

export type NodeType = 'campaign' | 'domain' | 'ip' | 'phone' | 'wallet' | 'investigation';

export interface CampaignGraphNode {
  id: string;
  label: string;
  type: NodeType;
  subtext: string;
  riskLevel?: RiskLevel;
  associatedCases: string[];
  metadata?: Record<string, string>;
  x?: number;
  y?: number;
}

export interface CampaignGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type?: 'primary' | 'secondary';
}

export interface Campaign {
  id: string;
  name: string;
  codeName: string;
  description: string;
  riskLevel: RiskLevel;
  firstDetected: string;
  tactics: string[];
  targetBrands: string[];
  caseIds: string[];
  nodes: CampaignGraphNode[];
  edges: CampaignGraphEdge[];
}
