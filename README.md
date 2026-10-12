# Sehat Saathi (सेहत साथी / సేహత్ సాథీ)
## AI-Powered Medicine Reminder & Adherence Companion for Elderly Care

**Sehat Saathi** is a full-stack medicine reminder and clinical adherence application built for elderly individuals and their family caregivers. It bridges the communication gap between aging parents and busy sons/daughters through connected dual portals:

1. **Caregiver / Sender Portal:** Enables family members to manage medicines, schedule multi-dose routines, monitor live confirmations, track low inventory refills, store prescriptions and lab reports, chat with elderly parents, and configure doctor/emergency escalations.
2. **Elderly / Receiver Portal:** Designed specifically for older adults with low vision, limited digital dexterity, and regional language preferences. Features a password-free, high-contrast interface, large touch targets, synthesized audio chimes, voice read-aloud instructions (Web Speech API in English, Hindi, and Telugu), and a prominent **“TAKEN MEDICINE”** button.

---

## 🌟 Key Features

### 1. Connected Dual Portals & One-Click Switcher
- **Caregiver Portal:** Rich dashboard with today’s dose progress, upcoming dose countdowns, refill warnings, and real-time alerts.
- **Elderly Receiver Portal:** High-contrast display, text magnification controls (A+, A++, A+++), read-aloud TTS, and celebration feedback upon dose confirmation.
- **Top Simulation Lab Bar:** Easily switch between Caregiver, Elderly, and Pairing views, or trigger simulated live events (ring medicine alarm, expire grace period, dispatch doctor escalation).

### 2. Firebase Database & Authentication
- **Firebase Auth with Google Sign-In:** Secure one-tap login for caregivers using `signInWithPopup` with profile avatar and email display.
- **Firestore Data Persistence:** Persistent cloud storage configured with database schema (`firebase-blueprint.json`) and hardened security rules (`firestore.rules`).

### 3. Google Search Grounding (`gemini-3.5-flash`)
- Real-time search-grounded pharmaceutical lookups, recent recall advisories, and ICMR/WHO guidelines with extracted web citations and source links.

### 4. Multi-Turn Gemini Healthcare Chatbot
- Multi-turn conversation thread with specialized clinical roles:
  - **Geriatric Physician:** Elderly multi-morbidity care and gentle medication adherence.
  - **Clinical Pharmacist:** Food-drug interactions, swallowing safety, and timing.
  - **Caregiver Coach:** Empathy, patience, and dementia/memory support for family members.
- Model selection: **`gemini-3.1-pro-preview`** (complex reasoning), **`gemini-3.5-flash`** (general queries), and **`gemini-3.1-flash-lite`** (fast responses).

### 5. Microphone Audio Transcription (`gemini-3.5-transcribe`)
- Real-time microphone audio capture and speech-to-text conversion for hands-free senior check-ins and caregiver voice notes.

### 6. Real-Time Voice Conversation (`gemini-3.8-live` Live API)
- Low-latency bidirectional voice calls powered by the Gemini Live API (`gemini-3.8-live`) with 16kHz PCM audio capture, 24kHz audio playback, and visual sound waves.

### 2. One-Tap Dose Confirmation & Real-Time Sync
- When the senior taps **“TAKEN MEDICINE”**, the system:
  1. Records the confirmation timestamp and method (`elderly_one_tap`).
  2. Plays a synthesized four-note ascending celebration chime.
  3. Triggers celebratory confetti animation.
  4. Automatically decrements the medicine inventory.
  5. Dispatches an instant confirmation notification to the caregiver dashboard with audible ping.
  6. Displays reassuring confirmation feedback: *"Your medicine confirmation has been sent to your family."*

### 3. Flexible Medicine Scheduling & Multi-Patient Management
- Supports multi-dose daily timings (e.g. 08:00 AM, 08:00 PM), food instructions (*Before Food, After Food, With Food, Empty Stomach*), and dosage forms (*Tablet, Capsule, Syrup, Drops, Inhaler, Injection*).
- Multi-patient switcher: Monitor multiple seniors (e.g., Lakshmi Devi, Ramachandra Rao, Savitri Amma) with isolated medicine lists, dose histories, and emergency contacts.

### 4. Missed-Dose & Doctor Escalation Workflow
- Configurable **Grace Period** (default: 15 mins) before flagging an unconfirmed dose as missed.
- Automated **Doctor & Emergency Escalation Window** (default: 30 mins): Dispatches critical alerts with direct phone dialers for the treating physician and emergency contact.

### 5. Trilingual Accessibility (English, Hindi, Telugu)
- Complete UI translation dictionary for English, Hindi (हिन्दी), and Telugu (తెలుగు).
- Web Speech API integration that speaks customized instructions in the senior's native language.

### 6. AI Health Tips & Clinical Medication Assistant
- Curated geriatric health guidelines for diabetes, hypertension, safe hydration, and avoiding double dosing.
- Integrated AI assistant powered by Google Gemini API (`@google/genai`) with clinical fallback guidelines.

### 7. Refill Tracker, Prescriptions & Lab Reports
- Tracks stock levels with configurable low-stock alert thresholds.
- Detailed refill audit trail and one-click stock replenishment.
- Prescriptions management with clinician diagnoses and medicine lists.
- Metabolic lab report tracking (HbA1c, Fasting Blood Sugar, Lipid Panels, Creatinine) with abnormal flags.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd <repo-folder>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be accessible at `http://localhost:3000`.

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
```
*Note: If no Gemini API key is provided, the application automatically uses the verified geriatric clinical knowledge base fallback.*

---

## 📱 Pairing Flow for Elderly Devices
1. On the Caregiver Portal under **Family Members**, locate the senior's 6-digit pairing code (e.g. `748291`).
2. Open the pairing screen (`/pair`) on the senior's tablet or phone.
3. Enter the 6-digit code or tap a quick-fill demo button.
4. The device pairs instantly and opens the elderly portal with no recurring password prompts.

---

## 🧪 Simulation & Testing Guide
Use the top persistent **Adherence Simulation Lab** bar to test all key workflows:
- **Ring Medicine Alarm Now:** Plays synthesized reminder alert and triggers read-aloud voice instructions.
- **Trigger Missed Dose Alert:** Simulates expiration of the grace window and generates caregiver alert.
- **Dispatch Doctor Escalation:** Simulates 30-minute escalation and notifies treating clinician.
- **Caregiver Away Mode:** Toggles auto-reply behavior in the family chat.
- **Export CSV Report:** Generates a downloadable spreadsheet of all dose confirmations and timestamps under Adherence Reports.
