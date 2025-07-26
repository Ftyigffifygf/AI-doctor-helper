 🩺 AI Doctor Helper

A mobile-first AI healthcare companion built with **React Native**, **TypeScript**, **Supabase**, and the **OpenAI API**, designed to assist healthcare professionals with diagnostics, patient record management, and secure interactions.

---

### 🚀 Features

* **AI‑powered diagnostics**: Analyze symptoms and patient data to provide suggested diagnoses and care plans.
* **Secure patient records**: Patient data stored safely in a Supabase backend with user authentication and access control.
* **Interactive chat interface**: Chat directly with the AI assistant for medical guidance and follow‑up questions.
* **Role-based access**: Different views and workflows for doctors, admins, and patients.
* **Responsive cross‑platform UI**: Developed with React Native and Expo for seamless use on both Android and iOS.

---

### 🧩 Tech Stack

* **React Native (+ Expo)** – cross‑platform mobile app
* **TypeScript** – stricter typing and developer tooling
* **Supabase** – PostgreSQL backend, authentication, and storage
* **OpenAI API** – ChatGPT or similar LLM for diagnostic assistance
* **Push Notifications** – for appointment reminders or alerts
* **Optional Modules** – symptom-checker logic, triage routing, and treatment suggestions

---

### 🛠️ Installation & Setup

#### Prerequisites

* Node.js ≥ 14.x (with npm or Yarn)
* Expo CLI
* Supabase account/project
* OpenAI API key

#### Quick Start

```bash
git clone https://github.com/Ftyigffifygf/AI-doctor-helper.git
cd AI-doctor-helper
npm install
```

Create a `.env` file in the project root:

```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-public-key
OPENAI_API_KEY=your-openai-secret-key
```

Start the development server:

```bash
npm start
```

Scan the QR code with Expo Go on your iPhone or Android to launch the app.

---

### 🏗️ Project Structure

```
AI‑doctor‑helper/
├── app/              # App entry and screens (login, dashboard, chat, patient detail)
├── components/       # Reusable UI components (Card, Button, ChatBubble, etc.)
├── services/         # API wrappers and business logic
│   ├── supabase.ts   # Supabase client initialization
│   └── aiService.ts  # OpenAI API helper functions
├── config/           # App-wide constants/configuration
├── styles/           # Shared style definitions
├── supabase/         # Database schema, migrations, seed scripts
├── utils/            # Utility helpers (formatting, validation, etc.)
├── App.tsx           # Main entry point
├── package.json      
└── tsconfig.json     
```

---

### ⚙️ Usage Examples

#### Launch Chatbot Evaluation:

Open the in-app chat and send patient symptoms. For example:

```
Patient: I'm experiencing chest pain and shortness of breath.
AI Assistant: Based on the input, possible causes include angina, GERD, or panic attack. Please provide more details, like pain duration and triggers.
```

#### Secure Data Flow:

* Doctors sign in to access assigned patient records.
* Patient data is fetched/read/written via Supabase.
* AI suggestions are attached to patient notes and stored in the database.

---

### ✅ Contributions

Contributions are welcome! Steps for contributing:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes and push.
4. Submit a pull request with a clear description and screenshot/demo if applicable.

---

### 📜 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

### 🧠 Acknowledgments & Inspiration

* The **OpenAI** team for providing ChatGPT / GPT‑4 APIs for intelligent conversation support.
* **Supabase** for robust backend-as-a-service and secure user authentication.
* Projects like **Smart Doctor (Permit.io integration)** and **AI clinic triage models** that shaped our design approach ([ai.plainenglish.io][1], [github.com][2], [en.wikipedia.org][3], [dev.to][4]).

---

### 🎯 What’s Next?

* **Symptom‑check module**: Interactive form for symptom input and structured triage routing.
* **Doctor review workflows**: Allow human-in‑loop validation of AI‑generated suggestions.
* **Analytics dashboard**: View AI suggestion accuracy, patient engagement metrics, and triage stats.
* **HIPAA/GDPR compliance**: Encryption, audit logs, and data retention policies.
* **Internationalization & localization**: Support for multiple languages and regions.

---

### ☎️ Contact

Built by \Girish .
Feel free to open issues or reach out via GitHub for questions, support, or collaboration!

---

Let me know if there are more specific areas—like deployment guides, CI/CD, API endpoints, or UI flows—you’d like to add or emphasize!

[1]: https://ai.plainenglish.io/lets-build-ai-router-for-healthcare-triage-system-1f100b19ec2f?utm_source=chatgpt.com "Let's Build AI-Router for Healthcare Triage System | by Aniket Hingane"
[2]: https://github.com/a5okol/ai-medical-doctor?utm_source=chatgpt.com "AI Medical Doctor Telegram Bot - GitHub"
[3]: https://en.wikipedia.org/wiki/Heidi_Health?utm_source=chatgpt.com "Heidi Health"
[4]: https://dev.to/sumankalia/smart-doctor-ai-powered-medical-assistant-with-human-in-the-loop-access-control-using-permitio--1peh?utm_source=chatgpt.com "Smart Doctor: AI-Powered Medical Assistant with Human-in-the ..."
