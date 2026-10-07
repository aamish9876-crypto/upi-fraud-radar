# 🛡️ UPI Shield — Defensive Fake UPI & Banking Page Detection MVP

**UPI Shield** is a cybersecurity investigation and triage web application designed to detect, dissect, and document suspected fraudulent UPI, banking, and payment pages. Built as an MVP hackathon project for defensive security analysts, cyber cells, and fraud risk teams.

---

## 🎯 Product Goal

When phishing or payment-trap links are reported, an analyst can paste the suspicious URL or load bundled sample cases. UPI Shield:
1. **Analyzes the URL** using transparent, explainable heuristic rules without making network requests to the target domain.
2. **Calculates a Risk Score (0–100)** with Low, Medium, and High severity ratings.
3. **Explains Every Flagged Signal** in plain language (brand spoofing, urgency traps, credential harvesting tokens, high-risk TLDs, raw IP hosting).
4. **Visualizes the Attack Vector** via a neutral, safe wireframe preview pointing out deceptive mechanisms (e.g. UPI PIN collection traps).
5. **Correlates Infrastructure Clues** in an interactive Campaign Graph connecting domains, hosting IPs, SMS sender clues, and mule UPI handles.
6. **Exports Actionable Dossiers** locally in JSON and printable HTML/PDF formats for human analyst review.

---

## 🔒 Scope & Safety Guidelines

> **IMPORTANT NOTICE:** This is an air-gapped defensive investigation prototype.

- **No Credential Collection:** The application never requests, stores, or transmits passwords, OTPs, UPI PINs, or card details.
- **No Live Outbound HTTP/Crawling:** The app analyzes URL syntax, query markers, and bundled synthetic metadata offline. It does not visit, crawl, or submit forms on third-party pages.
- **Fictional Entities:** All brands (`ApexBank`, `QuickPay`, `BharatPay Gateway`, `Mitra Cooperative Bank`, `FastRupee Wallet`), domains, IP addresses (`198.51.100.x` RFC 5737 test range), phone numbers (`+91 98XXX-xxxxx`), and wallet handles (`*.fakepay`, `*.fakeupi`) are **entirely fictional**. No real individuals or organizations are accused.
- **Demo Heuristics:** Results are labeled as **"Demo analysis"** and **"Potentially suspicious"**, not as legal fraud verdicts. Human review is always required.
- **No Automatic Takedowns:** Does not transmit automated reports to CERT-In, registrars, or live threat feeds. All dossiers remain strictly local to the analyst's workstation.

---

## ⚙️ How the Risk Score is Calculated

The engine calculates a deterministic score from **0 to 100** based on explainable weighted signals:

| Heuristic Signal | Category | Weight | Description |
| :--- | :--- | :--- | :--- |
| **Direct IP Hostname** | Domain & Hosting | `+30 pts` | URL uses a raw IPv4/IPv6 address instead of an authenticated FQDN. |
| **Brand in Subdomain** | Brand Impersonation | `+35 pts` | Moniker (e.g. `apexbank`) appears in subdomain, but apex domain belongs to an unauthorized third party. |
| **Lookalike / Squatted Domain** | Brand Impersonation | `+30 pts` | Domain mimics a known brand name outside the official registry. |
| **Brand in Path** | Brand Impersonation | `+20 pts` | Brand keyword placed inside the directory path on a generic server. |
| **Critical Credential Solicitations** | Credential Harvesting | `+25 pts` | Requesting secret UPI PIN or OTP. In legitimate UPI, PIN is **NEVER** required to receive funds. |
| **High-Risk TLD (.top, .xyz, .click, etc.)** | Domain & Hosting | `+18 pts` | Suffix heavily correlated with disposable phishing kits. |
| **Urgency Keywords ("KYC", "URGENT", "UNBLOCK")** | Phishing Keywords | `+15 to +22 pts` | Psychological coercion designed to bypass user caution. |
| **Financial Bait Keywords ("CASHBACK", "REWARD")** | Phishing Keywords | `+16 to +18 pts` | Fake rewards tricking users into entering their PIN to "accept" money. |
| **Excessive Hyphenation** | Domain & Hosting | `+15 pts` | Domain strings containing $\ge 2$ hyphens to simulate corporate titles. |
| **URL Obfuscation ("@" character)** | Obfuscation | `+25 pts` | Userinfo delimiter tricking browser into routing to subsequent host. |
| **Verified Official Domain** | Mitigating Factor | `-40 pts` | Matches authentic, accredited brand authority domain (caps score $\le 15$). |

### Risk Severities:
- 🟢 **LOW (0 – 34):** Benign service endpoint or legitimate domain.
- 🟡 **MEDIUM (35 – 69):** Unverified domain structures or suspicious indicators requiring review.
- 🔴 **HIGH (70 – 100):** Multiple deceptive markers; high likelihood of fake banking or UPI theft portal.

---

## 🗂️ Core Features

1. **Executive Dashboard (`Overview`):**
   - Summary cards: URLs analyzed, high-risk cases, active campaigns, pending reviews.
   - Recharts visual breakdowns for risk distribution and triggered rules.
   - Recent investigations table with quick inspection buttons.

2. **URL Analysis Engine (`Analyze URL`):**
   - Input box for suspicious URLs with brand selector.
   - One-click sample test cases (Cashback phish, Raw IP phish, KYC freeze, etc.).
   - Live scanning step animation and immediate dossier inspection.

3. **Sample Investigations Queue (`Investigations`):**
   - 8 bundled fictional cases covering diverse scams and benign controls.
   - Multi-criteria search and filtering by URL, brand, risk severity, and triage status.

4. **Investigation Detail Dossier:**
   - Circular score gauge and severity badge.
   - Plain-language detection signals with score impacts.
   - **Neutral Wireframe Preview:** Safe educational wireframe highlighting fraud traps (e.g. deceptive PIN inputs).
   - Infrastructure telemetry: Domain, IP, ASN, Hosting provider, SMS phone clue, and Mule VPA.
   - Case status selector (`New`, `Reviewing`, `Confirmed suspicious`, `False positive`).
   - Analyst notes editor saved locally in `localStorage`.

5. **Threat Campaign Graph (`Campaign Graph`):**
   - Interactive SVG diagram linking clusters:
     - `ApexKYC Syndicate` (Fake KYC, raw IP hosting `198.51.100.42`, SMS sender clue)
     - `Operation GoldenLure` (UPI cashback scratch-card scam, shared phone clue `+91 98XXX-55219`, mule VPA `reward-ops-99@fakeupi`)
     - `Mitra Support Phish` (Fake helpline WhatsApp desk, unblock account trap)
   - Labeled edges: `hosted on`, `deploys lure`, `shares contact clue`, `funnels to wallet`.
   - Node click drawer with associated case links and telemetry inspection.

6. **Dossier & Report Generator (`Reports`):**
   - Download standalone case report in structured **JSON**.
   - Open clean, printable **HTML Dossier** (formatted for PDF export).
   - Batch export all investigations as a single master JSON archive.

7. **Rules & Settings Inspector (`Rules & Settings`):**
   - Transparent scoring weights matrix table.
   - Fictional brands registry.
   - **Restore Default Samples** button to reset local modifications.

---

## 💻 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Dark navy cybersecurity theme)
- **Icons:** Lucide React
- **Data Visualizations:** Recharts (Responsive bar & pie charts)
- **Graph Visualization:** Native Interactive SVG Canvas
- **State & Storage:** React hooks + `localStorage` persistence

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; v24 installed)
- npm

### 1. Installation
Navigate to the project directory:
```bash
cd upi-shield
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000).

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 🔍 Demonstration Workflow for Evaluators

1. **Dashboard Overview:** Observe live triage metrics, risk distributions, and recent cases.
2. **Analyze a Link:**
   - Click **"Analyze Suspicious URL"** in the sidebar.
   - Click one of the quick test presets (e.g., *Fake Cashback Phish* or *Raw IP Bank Phish*).
   - Click **"Analyze URL"** to watch the scanning telemetry.
3. **Inspect the Case Dossier:**
   - Examine the **Detection Signals** tab for explainable rule weights.
   - Switch to the **Neutral Wireframe Preview** tab to see the annotated fake UPI PIN trap.
   - Update the status to `Confirmed suspicious` and enter notes in the **Analyst Investigation Notes** box.
4. **Explore the Campaign Graph:**
   - Click **"View in Campaign Graph"** or open the tab from the sidebar.
   - Click on nodes (`198.51.100.42`, `Operation GoldenLure`, `+91 98XXX-55219`) to inspect connected cases.
5. **Generate an Audit Report:**
   - Click **"Print Dossier"** to preview the printable report or **"Download JSON"** to export structured machine-readable evidence.
