import { Investigation } from '@/types';

export const SAMPLE_INVESTIGATIONS: Investigation[] = [
  {
    id: 'case-apex-01',
    url: 'http://apex-bank-kyc-verify.top/urgent-update',
    submittedAt: '2026-10-06T14:22:00Z',
    suspectedBrandId: 'apex-bank',
    suspectedBrandName: 'ApexBank',
    riskScore: 92,
    riskLevel: 'HIGH',
    status: 'Reviewing',
    analystNotes: 'High urgency phishing page mimicking ApexBank retail banking. Displays fake countdown timer warning of account freeze unless customer inputs NetBanking Password, PAN, and SMS OTP.',
    detectionSignals: [
      {
        id: 'sig-apex-1',
        title: 'Brand Deception in Apex Domain',
        severity: 'critical',
        scoreImpact: 35,
        explanation: 'Domain uses "apex-bank" name string but is registered on an unauthorized disposable registrar rather than the verified bank domain.',
        technicalDetail: 'Target brand ApexBank found in domain token (apex-bank-kyc-verify.top). Official is apexbank.demo.internal.',
        ruleCategory: 'Brand Impersonation'
      },
      {
        id: 'sig-apex-2',
        title: 'High-Risk Term Detected: "KYC"',
        severity: 'high',
        scoreImpact: 22,
        explanation: 'Scammers frequently invoke fake "KYC update" urgency to induce panic and bypass user caution.',
        technicalDetail: 'Token "kyc" located in second-level domain name.',
        ruleCategory: 'Phishing Keywords'
      },
      {
        id: 'sig-apex-3',
        title: 'High-Risk Term Detected: "URGENT"',
        severity: 'medium',
        scoreImpact: 15,
        explanation: 'Manufactured psychological urgency prompts users to act before verifying site authenticity.',
        technicalDetail: 'Path segment contains "/urgent-update".',
        ruleCategory: 'Phishing Keywords'
      },
      {
        id: 'sig-apex-4',
        title: 'High-Risk TLD Suffix (.top)',
        severity: 'medium',
        scoreImpact: 18,
        explanation: 'The .top top-level domain exhibits high prevalence in automated scam domain registration waves.',
        technicalDetail: 'Registrar records show .top domain registered with anonymized privacy proxy.',
        ruleCategory: 'Domain & Hosting'
      },
      {
        id: 'sig-apex-5',
        title: 'Excessive Hyphenation in Domain',
        severity: 'medium',
        scoreImpact: 15,
        explanation: 'Attackers chain hyphens (apex-bank-kyc-verify) to craft authentic-looking composite names.',
        technicalDetail: 'Hostname contains 3 hyphen delimiters.',
        ruleCategory: 'Domain & Hosting'
      }
    ],
    clues: {
      domain: 'apex-bank-kyc-verify.top',
      tld: '.top',
      subdomain: '',
      path: '/urgent-update',
      isIpAddress: false,
      simulatedIp: '198.51.100.42',
      simulatedAsn: 'AS64512 (HostPhantom Offshore Ltd)',
      simulatedHostingProvider: 'HostPhantom Bulletproof VPS',
      simulatedCountry: 'Synthetic RFC Test Zone',
      simulatedPhoneClue: '+91 98XXX-01928',
      simulatedWalletClue: 'apex-support99@fakepay',
      simulatedRegistrar: 'NameShield Fictional Registrar Ltd',
      simulatedCampaignId: 'camp-apex-kyc',
      simulatedCampaignName: 'ApexKYC Syndicate',
      requestedSensitiveFields: ['NetBanking Password', 'PAN Number', 'SMS OTP']
    },
    wireframe: {
      title: 'Urgent Account Freeze / Fake KYC Portal (Neutral Demo Preview)',
      pageType: 'Urgent Account Freeze / Fake KYC Portal',
      threatSummary: 'Presents an aggressive account suspension warning to panic the user into revealing 2FA credentials.',
      elements: [
        { id: 'w1', type: 'warning', label: '⚠️ IMMEDIATE NOTICE: Your ApexBank NetBanking access is frozen. Complete KYC within 4 hours to prevent account closure.', isSuspiciousTrap: true, trapReason: 'Panic induction heuristic designed to disable critical reasoning' },
        { id: 'w2', type: 'input', label: 'Registered Mobile Number', valuePlaceholder: '+91 98765-43210', isSuspiciousTrap: false },
        { id: 'w3', type: 'input', label: 'Permanent Account Number (PAN)', valuePlaceholder: 'ABCDE1234F', isSuspiciousTrap: false },
        { id: 'w4', type: 'input', label: 'NetBanking Password / MPIN', valuePlaceholder: '••••••••', isSuspiciousTrap: true, trapReason: 'Harvesting banking credential' },
        { id: 'w5', type: 'input', label: 'Current SMS OTP', valuePlaceholder: '6-digit OTP', isSuspiciousTrap: true, trapReason: 'Harvesting 2FA authorization token' },
        { id: 'w6', type: 'button', label: 'Verify & Restore Access', isSuspiciousTrap: false }
      ]
    }
  },
  {
    id: 'case-quickpay-02',
    url: 'https://quickpay-reward-claim2025.xyz/cashback?user=win',
    submittedAt: '2026-10-06T16:45:00Z',
    suspectedBrandId: 'quickpay',
    suspectedBrandName: 'QuickPay',
    riskScore: 88,
    riskLevel: 'HIGH',
    status: 'Confirmed suspicious',
    analystNotes: 'Classic UPI cashback scam archetype. Lures victim via WhatsApp scratch card link promising ₹2,499 cash reward. Form prompts victim to enter 6-digit UPI PIN to "receive" cashback.',
    detectionSignals: [
      {
        id: 'sig-qp-1',
        title: 'Brand Impersonation in Domain Name',
        severity: 'critical',
        scoreImpact: 30,
        explanation: 'Domain incorporates "quickpay" brand moniker without authoritative endorsement.',
        technicalDetail: 'Matches brand prefix on unauthenticated domain quickpay-reward-claim2025.xyz.',
        ruleCategory: 'Brand Impersonation'
      },
      {
        id: 'sig-qp-2',
        title: 'High-Risk Term Detected: "CASHBACK"',
        severity: 'high',
        scoreImpact: 18,
        explanation: 'Fake cashback lures deceive victims into believing they must enter a UPI PIN to receive money.',
        technicalDetail: 'Query parameter contains /cashback path descriptor.',
        ruleCategory: 'Phishing Keywords'
      },
      {
        id: 'sig-qp-3',
        title: 'High-Risk Term Detected: "REWARD"',
        severity: 'medium',
        scoreImpact: 16,
        explanation: 'Festive or lottery reward themes manipulate social proof.',
        technicalDetail: 'Keyword "reward" embedded in host label.',
        ruleCategory: 'Phishing Keywords'
      },
      {
        id: 'sig-qp-4',
        title: 'High-Risk TLD Suffix (.xyz)',
        severity: 'medium',
        scoreImpact: 18,
        explanation: 'Frequent domain generation destination for temporary social-engineering campaigns.',
        technicalDetail: 'Host terminates with .xyz TLD.',
        ruleCategory: 'Domain & Hosting'
      },
      {
        id: 'sig-qp-5',
        title: 'Deceptive Payment/Credential Solicitations',
        severity: 'critical',
        scoreImpact: 25,
        explanation: 'Requesting UPI PIN to credit funds violates fundamental UPI protocol specifications.',
        technicalDetail: 'Page requests UPI PIN input under false pretext of inbound transaction settlement.',
        ruleCategory: 'Credential Harvesting'
      }
    ],
    clues: {
      domain: 'quickpay-reward-claim2025.xyz',
      tld: '.xyz',
      subdomain: '',
      path: '/cashback',
      isIpAddress: false,
      simulatedIp: '198.51.100.77',
      simulatedAsn: 'AS64520 (Demo Cloud Infra Ltd)',
      simulatedHostingProvider: 'Demo Cloud VPS Network',
      simulatedCountry: 'Synthetic RFC Test Zone',
      simulatedPhoneClue: '+91 98XXX-55219',
      simulatedWalletClue: 'reward-ops-99@fakeupi',
      simulatedRegistrar: 'GlobalCheapDomains Inc (Fictional)',
      simulatedCampaignId: 'camp-golden-lure',
      simulatedCampaignName: 'Operation GoldenLure',
      requestedSensitiveFields: ['6-Digit UPI PIN / MPIN']
    },
    wireframe: {
      title: 'Fake Payment Reward / Cashback Trap (Neutral Demo Preview)',
      pageType: 'Fake Payment Reward / Cashback Trap',
      threatSummary: 'Deceives user into believing money is incoming, then collects their secret UPI PIN.',
      elements: [
        { id: 'w1', type: 'header', label: '🎉 Congratulations! You have won ₹2,499 QuickPay Festival Cashback', isSuspiciousTrap: false },
        { id: 'w2', type: 'badge', label: 'Verified UPI Merchant Voucher #QP-99124', isSuspiciousTrap: true, trapReason: 'Impersonates authentic trust badge' },
        { id: 'w3', type: 'text', label: 'IMPORTANT: Enter your 6-digit secret UPI PIN below to transfer funds instantly to your primary bank account.', isSuspiciousTrap: true, trapReason: 'FRAUD TRAP: In UPI, entering a PIN always AUTHORIZES A DEBIT. You NEVER enter a PIN to receive funds.' },
        { id: 'w4', type: 'input', label: 'Enter 6-Digit UPI PIN', valuePlaceholder: '● ● ● ● ● ●', isSuspiciousTrap: true, trapReason: 'Direct credential compromise attempt' },
        { id: 'w5', type: 'button', label: 'Deposit to Bank Now', isSuspiciousTrap: false }
      ]
    }
  },
  {
    id: 'case-bharatpay-03',
    url: 'http://198.51.100.42/bharatpay/login/otp-verify.html',
    submittedAt: '2026-10-06T18:10:00Z',
    suspectedBrandId: 'bharatpay',
    suspectedBrandName: 'BharatPay Gateway',
    riskScore: 96,
    riskLevel: 'HIGH',
    status: 'Confirmed suspicious',
    analystNotes: 'Direct IP hosting observed. Shares infrastructure IP 198.51.100.42 with the ApexKYC Syndicate case. Page captures merchant login credentials and authorization tokens.',
    detectionSignals: [
      {
        id: 'sig-bp-1',
        title: 'Direct IP Hostname Detected',
        severity: 'high',
        scoreImpact: 30,
        explanation: 'Banking and legitimate payment gateways deploy behind validated FQDNs with TLS certificates, never raw IP addresses.',
        technicalDetail: 'Host matches raw IPv4 format 198.51.100.42 without domain hostname.',
        ruleCategory: 'Domain & Hosting'
      },
      {
        id: 'sig-bp-2',
        title: 'Brand Keyword Masked in URL Path',
        severity: 'medium',
        scoreImpact: 20,
        explanation: 'Phishing kits often stage brand login clones within arbitrary server directories on compromised or bulletproof servers.',
        technicalDetail: 'Brand "bharatpay" embedded inside path: /bharatpay/login/...',
        ruleCategory: 'Brand Impersonation'
      },
      {
        id: 'sig-bp-3',
        title: 'High-Risk Term Detected: "OTP"',
        severity: 'high',
        scoreImpact: 24,
        explanation: 'Interception of One-Time Password tokens enables two-factor authentication bypass.',
        technicalDetail: 'Keyword "otp" present in script filename (otp-verify.html).',
        ruleCategory: 'Credential Harvesting'
      },
      {
        id: 'sig-bp-4',
        title: 'High-Risk Term Detected: "VERIFY"',
        severity: 'medium',
        scoreImpact: 14,
        explanation: 'Simulates mandatory credential re-verification prompt.',
        technicalDetail: 'Path token includes "verify".',
        ruleCategory: 'Phishing Keywords'
      }
    ],
    clues: {
      domain: '198.51.100.42',
      tld: '[Raw IP]',
      subdomain: '',
      path: '/bharatpay/login/otp-verify.html',
      isIpAddress: true,
      simulatedIp: '198.51.100.42',
      simulatedAsn: 'AS64512 (HostPhantom Offshore Ltd)',
      simulatedHostingProvider: 'HostPhantom Bulletproof VPS',
      simulatedCountry: 'Synthetic RFC Test Zone',
      simulatedPhoneClue: '+91 98XXX-01928',
      simulatedWalletClue: 'merchant-bpay99@fakepay',
      simulatedRegistrar: 'N/A (Direct IP Allocation)',
      simulatedCampaignId: 'camp-apex-kyc',
      simulatedCampaignName: 'ApexKYC Syndicate',
      requestedSensitiveFields: ['Merchant ID', 'Password', '2FA SMS OTP']
    },
    wireframe: {
      title: 'Raw IP Merchant Credential Harvester (Neutral Demo Preview)',
      pageType: 'Raw IP Merchant Credential Harvester',
      threatSummary: 'Unencrypted raw server IP hosting a cloned merchant dashboard to siphon login credentials.',
      elements: [
        { id: 'w1', type: 'header', label: 'BharatPay Merchant Portal - Session Verification', isSuspiciousTrap: false },
        { id: 'w2', type: 'input', label: 'Merchant Registered Mobile / Email', valuePlaceholder: 'merchant@store.com', isSuspiciousTrap: false },
        { id: 'w3', type: 'input', label: 'Merchant Security Password', valuePlaceholder: '••••••••', isSuspiciousTrap: true, trapReason: 'Plaintext credential theft over unencrypted HTTP' },
        { id: 'w4', type: 'input', label: 'Enter 6-Digit Verification OTP', valuePlaceholder: 'OTP from SMS', isSuspiciousTrap: true, trapReason: 'Real-time 2FA relay compromise' },
        { id: 'w5', type: 'button', label: 'Access Merchant Settlement', isSuspiciousTrap: false }
      ]
    }
  },
  {
    id: 'case-mitra-04',
    url: 'https://mitrabank-support-desk.click/unblock-account',
    submittedAt: '2026-10-07T09:15:00Z',
    suspectedBrandId: 'mitrabank',
    suspectedBrandName: 'Mitra Cooperative Bank',
    riskScore: 84,
    riskLevel: 'HIGH',
    status: 'New',
    analystNotes: 'Spam SMS campaign claiming account is locked due to pending utility bill verification. Redirects user to fraudulent WhatsApp / call center support agent.',
    detectionSignals: [
      {
        id: 'sig-mb-1',
        title: 'Brand Impersonation in Domain Name',
        severity: 'critical',
        scoreImpact: 30,
        explanation: 'Domain incorporates "mitrabank" brand moniker without authoritative endorsement.',
        technicalDetail: 'Domain mitrabank-support-desk.click is unregistered with cooperative banking council.',
        ruleCategory: 'Brand Impersonation'
      },
      {
        id: 'sig-mb-2',
        title: 'High-Risk Term Detected: "UNBLOCK"',
        severity: 'high',
        scoreImpact: 20,
        explanation: 'False warnings of blocked accounts coerce victims to surrender authentication tokens.',
        technicalDetail: 'Path segment contains "/unblock-account".',
        ruleCategory: 'Phishing Keywords'
      },
      {
        id: 'sig-mb-3',
        title: 'High-Risk TLD Suffix (.click)',
        severity: 'medium',
        scoreImpact: 18,
        explanation: 'Disposable TLD commonly purchased in bulk for short-lived spam operations.',
        technicalDetail: 'Host terminates with .click TLD.',
        ruleCategory: 'Domain & Hosting'
      },
      {
        id: 'sig-mb-4',
        title: 'Excessive Hyphenation in Domain',
        severity: 'medium',
        scoreImpact: 15,
        explanation: 'Chaining brand with "support-desk" creates false sense of official corporate support.',
        technicalDetail: 'Hostname has 2 hyphen tokens.',
        ruleCategory: 'Domain & Hosting'
      }
    ],
    clues: {
      domain: 'mitrabank-support-desk.click',
      tld: '.click',
      subdomain: '',
      path: '/unblock-account',
      isIpAddress: false,
      simulatedIp: '203.0.113.88',
      simulatedAsn: 'AS64535 (Sample Fast-Flux Provider)',
      simulatedHostingProvider: 'Sample Fast-Flux Network',
      simulatedCountry: 'Synthetic RFC Test Zone',
      simulatedPhoneClue: '+91 99XXX-88124',
      simulatedWalletClue: 'mitra-desk@fakepay',
      simulatedRegistrar: 'FastReg Domain Agency (Fictional)',
      simulatedCampaignId: 'camp-mitra-phish',
      simulatedCampaignName: 'Mitra Support Phish',
      requestedSensitiveFields: ['Debit Card Number', 'ATM PIN', 'Mobile OTP']
    },
    wireframe: {
      title: 'Fake Account Suspension / Helpline Scam (Neutral Demo Preview)',
      pageType: 'Fake Account Suspension / Helpline Scam',
      threatSummary: 'Falsely claims customer account is locked and instructs user to call a scam helpline or enter card PIN.',
      elements: [
        { id: 'w1', type: 'warning', label: '⚠️ Mitra Cooperative Bank Alert: Your Account was Blocked due to Non-Verification.', isSuspiciousTrap: true, trapReason: 'Coercive social engineering prompt' },
        { id: 'w2', type: 'text', label: 'Helpline Contact: +91 99XXX-88124 (Toll-Free Customer Desk)', isSuspiciousTrap: true, trapReason: 'Fraudulent call-center trap leading to remote desktop app install' },
        { id: 'w3', type: 'input', label: 'Debit Card Number (16 Digits)', valuePlaceholder: '4532 •••• •••• ••••', isSuspiciousTrap: true, trapReason: 'Payment card detail theft' },
        { id: 'w4', type: 'input', label: 'ATM / Debit PIN', valuePlaceholder: '••••', isSuspiciousTrap: true, trapReason: 'Critical PIN harvesting' },
        { id: 'w5', type: 'button', label: 'Request Immediate Unblock', isSuspiciousTrap: false }
      ]
    }
  },
  {
    id: 'case-fastrupee-05',
    url: 'https://fastrupee-refund-portal.net/ticket?id=9928',
    submittedAt: '2026-10-07T11:30:00Z',
    suspectedBrandId: 'fastrupee',
    suspectedBrandName: 'FastRupee Wallet',
    riskScore: 58,
    riskLevel: 'MEDIUM',
    status: 'Reviewing',
    analystNotes: 'Suspicious domain claiming transaction refund resolution. Connected via phone clue +91 98XXX-55219 to Operation GoldenLure network.',
    detectionSignals: [
      {
        id: 'sig-fr-1',
        title: 'Brand Impersonation in Domain Name',
        severity: 'critical',
        scoreImpact: 30,
        explanation: 'Domain incorporates "fastrupee" brand moniker without authoritative endorsement.',
        technicalDetail: 'Target brand FastRupee identified on third-party registrant domain.',
        ruleCategory: 'Brand Impersonation'
      },
      {
        id: 'sig-fr-2',
        title: 'High-Risk Term Detected: "REFUND"',
        severity: 'medium',
        scoreImpact: 15,
        explanation: 'Fake refund portals claim failed UPI payments will be refunded upon verification.',
        technicalDetail: 'Hostname contains "refund-portal" descriptor.',
        ruleCategory: 'Phishing Keywords'
      },
      {
        id: 'sig-fr-3',
        title: 'Excessive Hyphenation in Domain',
        severity: 'medium',
        scoreImpact: 15,
        explanation: 'Synthetic domain combining brand with transaction keywords.',
        technicalDetail: 'Hostname contains 2 hyphens.',
        ruleCategory: 'Domain & Hosting'
      }
    ],
    clues: {
      domain: 'fastrupee-refund-portal.net',
      tld: '.net',
      subdomain: '',
      path: '/ticket',
      isIpAddress: false,
      simulatedIp: '198.51.100.77',
      simulatedAsn: 'AS64520 (Demo Cloud Infra Ltd)',
      simulatedHostingProvider: 'Demo Cloud VPS Network',
      simulatedCountry: 'Synthetic RFC Test Zone',
      simulatedPhoneClue: '+91 98XXX-55219',
      simulatedWalletClue: 'refund-desk@fakeupi',
      simulatedRegistrar: 'GlobalCheapDomains Inc (Fictional)',
      simulatedCampaignId: 'camp-golden-lure',
      simulatedCampaignName: 'Operation GoldenLure',
      requestedSensitiveFields: ['Transaction Reference', 'UPI Virtual Payment Address']
    },
    wireframe: {
      title: 'Dispute & Refund Portal Phish (Neutral Demo Preview)',
      pageType: 'Dispute & Refund Portal Phish',
      threatSummary: 'Prompts users with fake pending refund ticket to capture payment handles.',
      elements: [
        { id: 'w1', type: 'header', label: 'FastRupee Payment Dispute Ticket #9928', isSuspiciousTrap: false },
        { id: 'w2', type: 'text', label: 'A failed transaction of ₹1,850 is ready for instant reversal.', isSuspiciousTrap: false },
        { id: 'w3', type: 'input', label: 'Primary UPI ID for Refund Credit', valuePlaceholder: 'name@upi', isSuspiciousTrap: false },
        { id: 'w4', type: 'button', label: 'Process Reversal', isSuspiciousTrap: false }
      ]
    }
  },
  {
    id: 'case-apex-06',
    url: 'https://apexbank-secure-alerts.info/login',
    submittedAt: '2026-10-07T12:05:00Z',
    suspectedBrandId: 'apex-bank',
    suspectedBrandName: 'ApexBank',
    riskScore: 65,
    riskLevel: 'MEDIUM',
    status: 'New',
    analystNotes: 'Recently registered .info domain imitating ApexBank secure communications. Shares infrastructure registrant with ApexKYC Syndicate.',
    detectionSignals: [
      {
        id: 'sig-ap6-1',
        title: 'Brand Impersonation in Domain Name',
        severity: 'critical',
        scoreImpact: 30,
        explanation: 'Domain incorporates "apexbank" brand moniker without authoritative endorsement.',
        technicalDetail: 'Domain registered outside official apexbank.demo.internal scope.',
        ruleCategory: 'Brand Impersonation'
      },
      {
        id: 'sig-ap6-2',
        title: 'High-Risk Term Detected: "LOGIN-PORTAL"',
        severity: 'medium',
        scoreImpact: 12,
        explanation: 'Deceptive entry point for banking credential harvesting.',
        technicalDetail: 'Path segment contains "/login".',
        ruleCategory: 'Phishing Keywords'
      },
      {
        id: 'sig-ap6-3',
        title: 'Excessive Hyphenation in Domain',
        severity: 'medium',
        scoreImpact: 15,
        explanation: 'Attackers chain hyphens to simulate corporate subdomain structures.',
        technicalDetail: 'Hostname contains 2 hyphens.',
        ruleCategory: 'Domain & Hosting'
      }
    ],
    clues: {
      domain: 'apexbank-secure-alerts.info',
      tld: '.info',
      subdomain: '',
      path: '/login',
      isIpAddress: false,
      simulatedIp: '198.51.100.89',
      simulatedAsn: 'AS64512 (HostPhantom Offshore Ltd)',
      simulatedHostingProvider: 'HostPhantom Bulletproof VPS',
      simulatedCountry: 'Synthetic RFC Test Zone',
      simulatedPhoneClue: '+91 98XXX-01928',
      simulatedWalletClue: 'apex-alerts@fakepay',
      simulatedRegistrar: 'NameShield Fictional Registrar Ltd',
      simulatedCampaignId: 'camp-apex-kyc',
      simulatedCampaignName: 'ApexKYC Syndicate',
      requestedSensitiveFields: ['Customer User ID', 'Password']
    },
    wireframe: {
      title: 'Lookalike Banking Portal (Neutral Demo Preview)',
      pageType: 'Lookalike Banking Portal',
      threatSummary: 'Generic bank login prompt targeting retail banking passwords.',
      elements: [
        { id: 'w1', type: 'header', label: 'ApexBank Customer Security Verification', isSuspiciousTrap: false },
        { id: 'w2', type: 'input', label: 'User ID / Customer Number', valuePlaceholder: 'Customer ID', isSuspiciousTrap: false },
        { id: 'w3', type: 'input', label: 'Password', valuePlaceholder: '••••••••', isSuspiciousTrap: true, trapReason: 'Unauthorized login form' },
        { id: 'w4', type: 'button', label: 'Proceed to NetBanking', isSuspiciousTrap: false }
      ]
    }
  },
  {
    id: 'case-quickpay-07',
    url: 'https://quickpay.internal.test/dashboard',
    submittedAt: '2026-10-07T13:40:00Z',
    suspectedBrandId: 'quickpay',
    suspectedBrandName: 'QuickPay',
    riskScore: 10,
    riskLevel: 'LOW',
    status: 'False positive',
    analystNotes: 'Verified official developer environment for QuickPay internal testing. Certified authoritative namespace.',
    detectionSignals: [
      {
        id: 'sig-qp-legit',
        title: 'Verified Official Fictional Domain for QuickPay',
        severity: 'low',
        scoreImpact: -40,
        explanation: 'Matches documented official domain (quickpay.internal.test).',
        technicalDetail: 'Hostname quickpay.internal.test is authenticated root authority for QuickPay.',
        ruleCategory: 'Brand Impersonation'
      }
    ],
    clues: {
      domain: 'quickpay.internal.test',
      tld: '.test',
      subdomain: '',
      path: '/dashboard',
      isIpAddress: false,
      simulatedIp: '198.51.100.10',
      simulatedAsn: 'AS65500 (Verified Cloud Provider)',
      simulatedHostingProvider: 'Verified Enterprise Cloud',
      simulatedCountry: 'IN',
      simulatedRegistrar: 'Accredited Bank Registrar',
      requestedSensitiveFields: []
    },
    wireframe: {
      title: 'Legitimate Service Endpoint (Neutral Demo Preview)',
      pageType: 'Legitimate Service Endpoint',
      threatSummary: 'Legitimate portal without unauthorized credential traps or deceptive urgency.',
      elements: [
        { id: 'w1', type: 'header', label: 'QuickPay Official Portal', isSuspiciousTrap: false },
        { id: 'w2', type: 'text', label: 'Authenticated customer service and transaction documentation endpoint.', isSuspiciousTrap: false }
      ]
    }
  },
  {
    id: 'case-bharatpay-08',
    url: 'https://merchant.bharatpay.demo.org/checkout/help',
    submittedAt: '2026-10-07T14:15:00Z',
    suspectedBrandId: 'bharatpay',
    suspectedBrandName: 'BharatPay Gateway',
    riskScore: 8,
    riskLevel: 'LOW',
    status: 'False positive',
    analystNotes: 'Legitimate merchant developer documentation and integration portal. No phishing attributes.',
    detectionSignals: [
      {
        id: 'sig-bp-legit',
        title: 'Verified Official Fictional Domain for BharatPay Gateway',
        severity: 'low',
        scoreImpact: -40,
        explanation: 'Matches documented official domain (merchant.bharatpay.demo.org).',
        technicalDetail: 'Hostname merchant.bharatpay.demo.org is authenticated root authority for BharatPay.',
        ruleCategory: 'Brand Impersonation'
      }
    ],
    clues: {
      domain: 'bharatpay.demo.org',
      tld: '.org',
      subdomain: 'merchant',
      path: '/checkout/help',
      isIpAddress: false,
      simulatedIp: '198.51.100.20',
      simulatedAsn: 'AS65500 (Verified Cloud Provider)',
      simulatedHostingProvider: 'Verified Enterprise Cloud',
      simulatedCountry: 'IN',
      simulatedRegistrar: 'Accredited Bank Registrar',
      requestedSensitiveFields: []
    },
    wireframe: {
      title: 'Legitimate Documentation Portal (Neutral Demo Preview)',
      pageType: 'Legitimate Documentation Portal',
      threatSummary: 'Official merchant integration manual and standard support references.',
      elements: [
        { id: 'w1', type: 'header', label: 'BharatPay Merchant Documentation', isSuspiciousTrap: false },
        { id: 'w2', type: 'text', label: 'API specifications and merchant integration guides.', isSuspiciousTrap: false }
      ]
    }
  }
];
