import { Brand } from '@/types';

/**
 * STRICT DEMO DISCLAIMER:
 * All brand names, domains, phone numbers, IP addresses, and wallet handles
 * in this demo application are completely fictional or RFC-reserved test fixtures.
 * This tool is built strictly for defensive cybersecurity triage and education.
 * It is NOT connected to real threat feeds, takedown networks, or live certificate logs.
 */
export const DEMO_DISCLAIMER = 
  "DEMO INVESTIGATION SYSTEM: All brand names, domains, phone numbers, IP addresses, and wallet handles are completely fictional. Risk scores are heuristic approximations for analyst demonstration and do NOT represent definitive fraud verdicts. No real credentials are collected or stored.";

export const FICTIONAL_BRANDS: Brand[] = [
  {
    id: 'apex-bank',
    name: 'ApexBank',
    officialDomains: ['apexbank.demo.internal', 'apexbank-online.internal.test'],
    brandTerms: ['apexbank', 'apex-bank', 'apexnetbank', 'apex'],
    category: 'Bank',
    description: 'Fictional premier commercial bank offering retail UPI and corporate netbanking.'
  },
  {
    id: 'quickpay',
    name: 'QuickPay',
    officialDomains: ['quickpay.internal.test', 'pay.quickpay.demo.org'],
    brandTerms: ['quickpay', 'quick-pay', 'qpay', 'quickupi'],
    category: 'UPI App',
    description: 'Fictional popular instant peer-to-peer UPI payments application.'
  },
  {
    id: 'bharatpay',
    name: 'BharatPay Gateway',
    officialDomains: ['bharatpay.internal.test', 'merchant.bharatpay.demo.org'],
    brandTerms: ['bharatpay', 'bharat-pay', 'bpay'],
    category: 'Payment Gateway',
    description: 'Fictional national payment aggregator for QR and merchant POS transactions.'
  },
  {
    id: 'mitrabank',
    name: 'Mitra Cooperative Bank',
    officialDomains: ['mitrabank.internal.test'],
    brandTerms: ['mitrabank', 'mitra-bank', 'mitracoop'],
    category: 'Bank',
    description: 'Fictional regional cooperative bank serving semi-urban and rural customers.'
  },
  {
    id: 'fastrupee',
    name: 'FastRupee Wallet',
    officialDomains: ['fastrupee.internal.test'],
    brandTerms: ['fastrupee', 'fast-rupee', 'frupee'],
    category: 'Mobile Wallet',
    description: 'Fictional prepaid payment instrument and wallet provider.'
  }
];

export const SUSPICIOUS_KEYWORDS: { term: string; weight: number; explanation: string }[] = [
  { term: 'kyc', weight: 22, explanation: 'Scams frequently invoke fake "KYC update" urgency to induce panic' },
  { term: 'pan-update', weight: 20, explanation: 'False PAN card linkage lures commonly precede banking credentials harvest' },
  { term: 'urgent', weight: 15, explanation: 'High-urgency language pushes victims into hasty action without verification' },
  { term: 'verify', weight: 14, explanation: 'Lures users to verify account status on unverified third-party pages' },
  { term: 'cashback', weight: 18, explanation: 'Fraudulent cashback/scratch-card reward traps trick users into entering UPI PIN to receive money' },
  { term: 'reward', weight: 16, explanation: 'Fake lottery or festive payment reward deception' },
  { term: 'unblock', weight: 20, explanation: 'False claims that account or card is suspended unless unblocked immediately' },
  { term: 'blocked', weight: 18, explanation: 'Threat of account freeze designed to bypass normal caution' },
  { term: 'refund', weight: 15, explanation: 'Fake refund claim asking user to enter UPI PIN' },
  { term: 'pin', weight: 25, explanation: 'Explicit solicitation of confidential UPI PIN or MPIN' },
  { term: 'otp', weight: 24, explanation: 'Interception of One-Time Password for two-factor bypass' },
  { term: 'lottery', weight: 20, explanation: 'Pretexting windfall winnings requiring processing fee' },
  { term: 'claim', weight: 14, explanation: 'Incentive to claim monetary vouchers on dubious domain' },
  { term: 'support-help', weight: 12, explanation: 'Spoofed customer service or helpline desk' },
  { term: 'login-portal', weight: 12, explanation: 'Deceptive entry point for banking credential harvesting' }
];

export const HIGH_RISK_TLDS = [
  '.top', '.xyz', '.click', '.buzz', '.cfd', '.sbs', '.rest', '.quest', '.tk', '.live', '.online', '.site', '.work'
];

export const REPUTABLE_DEMO_TLDS = [
  '.gov.in', '.nic.in', '.bank.internal', '.internal.test', '.demo.internal', '.demo.org'
];
