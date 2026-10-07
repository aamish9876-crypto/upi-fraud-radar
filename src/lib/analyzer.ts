import { FICTIONAL_BRANDS, SUSPICIOUS_KEYWORDS, HIGH_RISK_TLDS } from './constants';
import { DetectionSignal, InfrastructureClues, Investigation, PageWireframeElement, RiskLevel } from '@/types';

/**
 * Deterministic, offline heuristic analyzer.
 * IMPORTANT:
 * - This engine NEVER makes outbound network requests.
 * - It evaluates only the URL structure, syntax tokens, and synthetic metadata.
 * - Rules are heuristic signals for defensive analyst education, NOT definitive verdicts.
 */
export interface AnalysisOptions {
  url: string;
  suspectedBrandId?: string;
  existingId?: string;
}

export function analyzeUrl(options: AnalysisOptions): Investigation {
  const { url: rawUrl, suspectedBrandId, existingId } = options;
  const normalizedUrl = rawUrl.trim();
  const timestamp = new Date().toISOString();
  const id = existingId || `inv-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  let parsedUrl: URL | null = null;
  let parseError = false;

  try {
    // Add protocol if missing for URL parsing
    const urlToParse = normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://')
      ? normalizedUrl
      : `http://${normalizedUrl}`;
    parsedUrl = new URL(urlToParse);
  } catch {
    parseError = true;
  }

  const signals: DetectionSignal[] = [];
  let rawScore = 0;

  const urlLower = normalizedUrl.toLowerCase();
  const hostname = parsedUrl ? parsedUrl.hostname.toLowerCase() : normalizedUrl.toLowerCase();
  const pathname = parsedUrl ? parsedUrl.pathname.toLowerCase() : '';
  const searchParams = parsedUrl ? parsedUrl.search.toLowerCase() : '';

  // 1. Check if raw IP address is used
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  const isIpv6 = hostname.includes(':') && !hostname.includes('.');
  const isIpAddress = isIpv4 || isIpv6;

  if (isIpAddress) {
    rawScore += 30;
    signals.push({
      id: 'sig-raw-ip',
      title: 'Direct IP Hostname Detected',
      severity: 'high',
      scoreImpact: 30,
      explanation: 'Banking and legitimate UPI apps utilize authenticated Fully Qualified Domain Names (FQDNs), not naked IP addresses.',
      technicalDetail: `Host matches IP pattern (${hostname}). Legitimate financial services deploy on registered domains with EV/OV SSL.`,
      ruleCategory: 'Domain & Hosting'
    });
  }

  // 2. Identify Brand Context
  let matchedBrand = suspectedBrandId 
    ? FICTIONAL_BRANDS.find(b => b.id === suspectedBrandId)
    : undefined;

  // Auto-detect brand if not explicitly provided
  if (!matchedBrand) {
    for (const brand of FICTIONAL_BRANDS) {
      const brandFound = brand.brandTerms.some(term => urlLower.includes(term));
      if (brandFound) {
        matchedBrand = brand;
        break;
      }
    }
  }

  // Brand Impersonation Signals
  let isLegitBrandDomain = false;
  if (matchedBrand) {
    isLegitBrandDomain = matchedBrand.officialDomains.some(offDomain => 
      hostname === offDomain || hostname.endsWith(`.${offDomain}`)
    );

    if (isLegitBrandDomain) {
      // Legitimate brand domain: reduces suspicion significantly
      rawScore = Math.max(0, rawScore - 40);
      signals.push({
        id: 'sig-official-domain',
        title: `Verified Official Fictional Domain for ${matchedBrand.name}`,
        severity: 'low',
        scoreImpact: -40,
        explanation: `Matches documented official domain (${matchedBrand.officialDomains.join(', ')}).`,
        technicalDetail: `Hostname ${hostname} resolves to recognized authority namespace for ${matchedBrand.name}.`,
        ruleCategory: 'Brand Impersonation'
      });
    } else {
      // Brand appears in URL but not on official domain
      const brandInSubdomain = matchedBrand.brandTerms.some(term => {
        const parts = hostname.split('.');
        return parts.slice(0, -2).some(p => p.includes(term));
      });
      const brandInDomain = matchedBrand.brandTerms.some(term => hostname.includes(term));
      const brandInPath = matchedBrand.brandTerms.some(term => pathname.includes(term));

      if (brandInSubdomain) {
        rawScore += 35;
        signals.push({
          id: 'sig-subdomain-brand-spoof',
          title: `Brand Deception in Subdomain (${matchedBrand.name})`,
          severity: 'critical',
          scoreImpact: 35,
          explanation: `The brand name appears inside a subdomain prefix, but the root domain belongs to an unauthorized third party.`,
          technicalDetail: `Target brand "${matchedBrand.name}" embedded before apex domain. Classic deceptive hostname formulation.`,
          ruleCategory: 'Brand Impersonation'
        });
      } else if (brandInDomain) {
        rawScore += 30;
        signals.push({
          id: 'sig-domain-lookalike',
          title: `Lookalike / Squatted Brand Domain (${matchedBrand.name})`,
          severity: 'high',
          scoreImpact: 30,
          explanation: `Domain contains the brand name "${matchedBrand.name}" but is not on the recognized registry of legitimate endpoints.`,
          technicalDetail: `Domain "${hostname}" mimics ${matchedBrand.name} without authoritative registry verification.`,
          ruleCategory: 'Brand Impersonation'
        });
      } else if (brandInPath) {
        rawScore += 20;
        signals.push({
          id: 'sig-path-brand-mimic',
          title: `Brand Keyword Masked in URL Path`,
          severity: 'medium',
          scoreImpact: 20,
          explanation: `Target brand name "${matchedBrand.name}" appears inside the URL path on an unrelated host.`,
          technicalDetail: `Path contains "${pathname}". Phishing kits often nest brand login clones in generic server directories.`,
          ruleCategory: 'Brand Impersonation'
        });
      }
    }
  }

  // 3. Keyword Analysis (Urgency, KYC, Cashback, OTP)
  const matchedKeywords: string[] = [];
  for (const item of SUSPICIOUS_KEYWORDS) {
    if (urlLower.includes(item.term)) {
      matchedKeywords.push(item.term);
      // Keyword weight
      rawScore += item.weight;
      signals.push({
        id: `sig-keyword-${item.term}`,
        title: `High-Risk Term Detected: "${item.term.toUpperCase()}"`,
        severity: item.weight >= 20 ? 'high' : 'medium',
        scoreImpact: item.weight,
        explanation: item.explanation,
        technicalDetail: `Found match for pattern "${item.term}" in URL path or parameters.`,
        ruleCategory: item.term.includes('pin') || item.term.includes('otp') ? 'Credential Harvesting' : 'Phishing Keywords'
      });
    }
  }

  // 4. High Risk TLD Analysis
  let matchedTld = '';
  for (const tld of HIGH_RISK_TLDS) {
    if (hostname.endsWith(tld)) {
      matchedTld = tld;
      rawScore += 18;
      signals.push({
        id: `sig-risky-tld-${tld.replace('.', '')}`,
        title: `High-Risk TLD Suffix (${tld})`,
        severity: 'medium',
        scoreImpact: 18,
        explanation: `TLD ${tld} has a statistically high correlation with throwaway phishing kits and disposable hosting.`,
        technicalDetail: `Apex domain utilizes ${tld}. Often associated with low-cost, minimal-KYC domain registrars.`,
        ruleCategory: 'Domain & Hosting'
      });
      break;
    }
  }

  // 5. Hyphenation & Typosquatting
  const hyphenCount = (hostname.match(/-/g) || []).length;
  if (hyphenCount >= 2) {
    rawScore += 15;
    signals.push({
      id: 'sig-excessive-hyphens',
      title: 'Excessive Hyphenation in Domain',
      severity: 'medium',
      scoreImpact: 15,
      explanation: 'Attackers frequently chain hyphens (e.g., bank-kyc-verify-portal) to create fake authoritative-sounding domains.',
      technicalDetail: `Hostname contains ${hyphenCount} hyphens, indicating synthetic keyword stacking.`,
      ruleCategory: 'Domain & Hosting'
    });
  }

  // 6. Suspicious Obfuscation / Characters
  if (normalizedUrl.includes('@')) {
    rawScore += 25;
    signals.push({
      id: 'sig-userinfo-at',
      title: 'Credential Obfuscation via "@" Token',
      severity: 'critical',
      scoreImpact: 25,
      explanation: 'The "@" character in a URL causes browsers to treat everything prior as basic-auth credentials, redirecting to the host after "@".',
      technicalDetail: 'Userinfo delimiter "@" detected in URL string. Common URL confusion attack.',
      ruleCategory: 'Obfuscation & Redirects'
    });
  }

  // 7. Sensitive Credential Harvesting Clues
  const requestsPin = urlLower.includes('pin') || urlLower.includes('mpin') || searchParams.includes('pin');
  const requestsOtp = urlLower.includes('otp') || urlLower.includes('2fa');
  const requestsPan = urlLower.includes('pan') || urlLower.includes('aadhaar');

  const sensitiveFields: string[] = [];
  if (requestsPin) sensitiveFields.push('UPI 6-Digit PIN / MPIN');
  if (requestsOtp) sensitiveFields.push('One-Time Password (OTP)');
  if (requestsPan) sensitiveFields.push('PAN / National Identity');

  if (sensitiveFields.length > 0 && !isLegitBrandDomain) {
    rawScore += 25;
    signals.push({
      id: 'sig-critical-credential-request',
      title: 'Deceptive Payment/Credential Solicitations',
      severity: 'critical',
      scoreImpact: 25,
      explanation: `Soliciting confidential items (${sensitiveFields.join(', ')}) on an external page is the signature mechanism of UPI fraud.`,
      technicalDetail: `Sensitive parameter markers observed. UPI safety rules state: PIN is NEVER required to receive money or rewards.`,
      ruleCategory: 'Credential Harvesting'
    });
  }

  // 8. Parser Malformation Error
  if (parseError) {
    rawScore += 20;
    signals.push({
      id: 'sig-malformed-url',
      title: 'Malformed URL Syntax',
      severity: 'medium',
      scoreImpact: 20,
      explanation: 'The provided URL contains structural irregularities or invalid formatting characters.',
      technicalDetail: 'Failed standard URI RFC-3986 parser validation.',
      ruleCategory: 'Obfuscation & Redirects'
    });
  }

  // Cap score and determine risk level
  let finalScore = Math.min(100, Math.max(0, rawScore));
  if (isLegitBrandDomain && finalScore > 20) {
    finalScore = 15; // Cap if officially verified
  }

  let riskLevel: RiskLevel = 'LOW';
  if (finalScore >= 70) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 35) {
    riskLevel = 'MEDIUM';
  }

  // Build synthetic infrastructure clues (deterministic based on URL hash)
  const hash = Math.abs(normalizedUrl.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  const simIpSuffix = (hash % 200) + 10;
  const simIp = isIpAddress ? hostname : `198.51.100.${simIpSuffix}`; // RFC 5737 doc IP
  const simPhoneSuffix = (hash % 9000) + 1000;
  const simPhone = `+91 98XXX-${simPhoneSuffix}`;
  const simWalletUser = (matchedBrand ? matchedBrand.name.toLowerCase() : 'support') + (hash % 99);
  const simWallet = `${simWalletUser}@fakepay`;

  const simAsns = [
    'AS64512 (Fictional Bulletproof Transit)',
    'AS64520 (Demo Cloud Infra Ltd)',
    'AS64535 (Sample Fast-Flux Provider)',
    'AS65500 (Demo Regional Telecom)'
  ];
  const simAsn = simAsns[hash % simAsns.length];

  const simHosts = [
    'HostPhantom Offshore Ltd (Fictional)',
    'CloudMatrix Hosting Demo (Fictional)',
    'SecureVPS Sample Services',
    'EdgeRouting Labs (Demo)'
  ];
  const simHost = isLegitBrandDomain ? 'Legitimate Corporate Cloud' : simHosts[hash % simHosts.length];

  const domainParts = hostname.split('.');
  const tld = domainParts.length > 1 ? `.${domainParts.slice(-1)[0]}` : matchedTld || '.internal';
  const subdomain = domainParts.length > 2 ? domainParts.slice(0, -2).join('.') : '';
  const domain = domainParts.length >= 2 ? domainParts.slice(-2).join('.') : hostname;

  // Build neutral wireframe mockup elements
  const wireframeElements: PageWireframeElement[] = [];
  let pageType = 'Neutral Information Page';
  let threatSummary = 'No deceptive elements detected on URL analysis.';

  if (finalScore >= 70) {
    if (urlLower.includes('cashback') || urlLower.includes('reward')) {
      pageType = 'Fake Payment Reward / Cashback Trap';
      threatSummary = 'Simulates a lottery/cashback voucher page that instructs the victim to enter their UPI PIN to "receive" funds into their bank account.';
      wireframeElements.push(
        { id: 'wf-1', type: 'header', label: `🎉 Congratulations! ₹${(hash % 5 + 1) * 500} Cashback Approved`, isSuspiciousTrap: false },
        { id: 'wf-2', type: 'badge', label: `Spoofed Badge: Verified by ${matchedBrand ? matchedBrand.name : 'UPI Portal'}`, isSuspiciousTrap: true, trapReason: 'Impersonates trust seals without cryptographic verification' },
        { id: 'wf-3', type: 'text', label: 'Instruction: "Enter your 6-digit UPI PIN below to transfer funds directly to your bank account."', isSuspiciousTrap: true, trapReason: 'FRAUD TRAP: In legitimate UPI, entering your PIN always DEBITS your account. You NEVER need a PIN to receive money.' },
        { id: 'wf-4', type: 'input', label: '6-Digit UPI PIN', valuePlaceholder: '● ● ● ● ● ●', isSuspiciousTrap: true, trapReason: 'Credential theft target' },
        { id: 'wf-5', type: 'button', label: 'Claim Money Now', isSuspiciousTrap: false }
      );
    } else if (urlLower.includes('kyc') || urlLower.includes('unblock') || urlLower.includes('urgent')) {
      pageType = 'Urgent Account Freeze / Fake KYC Portal';
      threatSummary = 'Simulates an urgent compliance warning claiming the victim\'s bank account is suspended unless PAN and netbanking OTP are provided.';
      wireframeElements.push(
        { id: 'wf-1', type: 'warning', label: '⚠️ URGENT: Your Account will be suspended within 24 hours due to pending KYC verification', isSuspiciousTrap: true, trapReason: 'Panic inducement heuristic designed to disable critical reasoning' },
        { id: 'wf-2', type: 'input', label: 'Registered Mobile Number', valuePlaceholder: '+91 9XXXXXXXXX', isSuspiciousTrap: false },
        { id: 'wf-3', type: 'input', label: 'Permanent Account Number (PAN)', valuePlaceholder: 'ABCDE1234F', isSuspiciousTrap: false },
        { id: 'wf-4', type: 'input', label: '6-Digit One Time Password (OTP)', valuePlaceholder: 'Enter SMS OTP', isSuspiciousTrap: true, trapReason: 'Harvesting 2FA authorization token' },
        { id: 'wf-5', type: 'button', label: 'Submit & Unblock Account', isSuspiciousTrap: false }
      );
    } else {
      pageType = 'Deceptive Banking Gateway Portal';
      threatSummary = 'Simulates an unauthorized payment portal designed to harvest customer login credentials and transaction authorization PINs.';
      wireframeElements.push(
        { id: 'wf-1', type: 'header', label: `${matchedBrand ? matchedBrand.name : 'Secure Payment'} Login Verification`, isSuspiciousTrap: false },
        { id: 'wf-2', type: 'input', label: 'Customer User ID / VPA', valuePlaceholder: 'user@upi or 10-digit ID', isSuspiciousTrap: false },
        { id: 'wf-3', type: 'input', label: 'NetBanking Password / MPIN', valuePlaceholder: '••••••••', isSuspiciousTrap: true, trapReason: 'Sensitive credential harvesting form' },
        { id: 'wf-4', type: 'button', label: 'Authorize Transaction', isSuspiciousTrap: false }
      );
    }
  } else if (finalScore >= 35) {
    pageType = 'Ambiguous / Unverified Payment Redirect';
    threatSummary = 'Contains unverified domain structures or keyword triggers requiring human analyst investigation.';
    wireframeElements.push(
      { id: 'wf-1', type: 'header', label: 'Payment Gateway Verification Notice', isSuspiciousTrap: false },
      { id: 'wf-2', type: 'text', label: 'Domain configuration does not match official banking records.', isSuspiciousTrap: false },
      { id: 'wf-3', type: 'button', label: 'Proceed to Merchant', isSuspiciousTrap: false }
    );
  } else {
    pageType = 'Legitimate Banking / Service Endpoint';
    threatSummary = 'Matches official domain patterns and lacks manipulative psychological urgency triggers.';
    wireframeElements.push(
      { id: 'wf-1', type: 'header', label: `${matchedBrand ? matchedBrand.name : 'Payment Portal'} Service Portal`, isSuspiciousTrap: false },
      { id: 'wf-2', type: 'text', label: 'Standard customer service and transaction documentation endpoint.', isSuspiciousTrap: false }
    );
  }

  const clues: InfrastructureClues = {
    domain,
    tld,
    subdomain,
    path: pathname || '/',
    isIpAddress,
    simulatedIp: simIp,
    simulatedAsn: simAsn,
    simulatedHostingProvider: simHost,
    simulatedCountry: isLegitBrandDomain ? 'IN' : 'Synthetic RFC Test Zone',
    simulatedPhoneClue: simPhone,
    simulatedWalletClue: simWallet,
    simulatedRegistrar: isLegitBrandDomain ? 'Accredited Bank Registrar' : 'NameShield Fictional Registrar Ltd',
    simulatedCampaignId: finalScore >= 70 ? (hash % 2 === 0 ? 'camp-golden-lure' : 'camp-apex-kyc') : undefined,
    simulatedCampaignName: finalScore >= 70 ? (hash % 2 === 0 ? 'Operation GoldenLure' : 'ApexKYC Syndicate') : undefined,
    requestedSensitiveFields: sensitiveFields
  };

  return {
    id,
    url: normalizedUrl,
    submittedAt: timestamp,
    suspectedBrandId: matchedBrand?.id,
    suspectedBrandName: matchedBrand?.name || 'Unspecified Brand',
    riskScore: finalScore,
    riskLevel,
    status: 'New',
    analystNotes: '',
    detectionSignals: signals,
    clues,
    wireframe: {
      title: `${pageType} (Neutral Demo Preview)`,
      pageType,
      threatSummary,
      elements: wireframeElements
    },
    isCustomAnalyzed: !existingId
  };
}
