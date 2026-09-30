# Insan Cendekia Madani (ICM) Lesson Plan Studio & DOCX Exporter

An AI-powered, browser-based lesson plan studio engineered specifically for educators and curriculum leaders at **Insan Cendekia Madani (ICM) High School** (Cambridge & Indonesian National SPK Curriculum).

Generate comprehensive, pedagogy-rich, 3-session weekly lesson plans aligned with the **Anderson-Krathwohl Taxonomy (AKT)**, **ICM Islamic & Character Values**, and **Differentiated Instruction**, then export directly to official **Microsoft Word (`.docx`)** documents.

---

## 🌟 Key Features

### 1. Dual Input Workflows
- **Quick Teacher Notes / Brain Dump**: Type or paste unstructured thoughts, demo ideas, laboratory experiments, or Islamic reflections. Gemini automatically extracts and formats them into rigorous Anderson-Krathwohl objectives, step-by-step procedures, and timed sessions.
- **Structured Syllabus Input**: Formally input Grade, Subject, Semester, Unit/Chapter, Academic Year, Duration, **Capaian Pembelajaran (CP)**, and **Tujuan Pembelajaran (TP)**.

### 2. School Timetable & Grade Presets
- **Grade 10 Preset**: Session 1 (80 min) • Session 2 (80 min) • Session 3 (40 min)
- **Grade 11 Preset**: Session 1 (80 min) • Session 2 (80 min) • Session 3 (80 min)
- **Custom Mode**: Freely configure number of sessions and custom durations.

### 3. Anderson-Krathwohl Taxonomy (AKT) Matrix
- Foundational $\rightarrow$ Progressing $\rightarrow$ Culminating learning progression across weekly sessions.
- Seamless mapping of cognitive dimensions (*Remember, Understand, Apply, Analyze, Evaluate, Create*) with knowledge dimensions (*Factual, Conceptual, Procedural, Metacognitive*), e.g., `FC1`, `CC2`, `PC3`, `AC4`.
- Built-in interactive AKT Matrix reference guide accessible directly within the studio.

### 4. ICM Islamic & Character Values Integration
- Embedded core character dimensions:
  - **Faithful** (Iman & Taqwa)
  - **Adab Akhlaq** (Moral excellence & manners)
  - **Independence** (Mandiri)
  - **Intelligence** (Fathonah & critical inquiry)
  - **Leadership** (Kepemimpinan & Amanah)
- Contextualized integration into subject matter through Islamic reflections (e.g., *Sunnatullah*, *Tadabbur Alam*, *Ta'awun*).

### 5. Differentiated Learning Framework
- Built-in differentiation strategies across **Content**, **Process**, **Product**, and **Learning Profile / Readiness**.
- Clear scaffolding for tiered student readiness (struggling, on-level, and advanced/mastery).

### 6. Dynamic School & Accreditation Logo Customization
- Upload and preview custom primary school logos and secondary accreditation logos (e.g., ICM High School & Cambridge Assessment International Education).
- Embedded directly into the document header of exported Word files.

### 7. Native Microsoft Word (`.docx`) Export
- Generates pixel-perfect `.docx` files matching ICM's official administrative template:
  - Formatted tables with school-branded headers
  - Checkboxes for values and differentiation
  - 3-session instructional activity tables (Opening, Main Activity, Closing)
  - Formative and summative assessment grids
  - Administrative signature blocks for **Principal**, **Curriculum VP**, and **Subject Teacher**

### 8. 100% Client-Side Privacy & BYOK
- Your Google Gemini API key is stored strictly in your browser's `localStorage` or loaded via local environment variables.
- Direct communication with Google's Gemini API with zero intermediate proxy or data logging.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite](https://vite.dev/)
- **AI Engine**: [@google/genai](https://www.npmjs.com/package/@google/genai) (Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini 2.0 Flash)
- **Document Engine**: [docx](https://docx.js.org/) + [file-saver](https://www.npmjs.com/package/file-saver)
- **Icons**: [lucide-react](https://lucide.dev/)
- **Styling**: Modern responsive CSS design system with dark/light themes and clean glassmorphism accents

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/fluffykitten/lessonplan-gen.git
cd lessonplan-gen
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Key (Optional)
You can enter your Gemini API key directly in the web app UI via the **"Set Gemini Key"** button, or configure it via `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

### 5. Build for Production
```bash
npm run build
```
Preview the production build:
```bash
npm run preview
```

---

## 📁 Project Structure

```
lesson-plan-generator/
├── public/                  # Static assets & favicons
├── src/
│   ├── assets/              # Default logos & brand imagery
│   │   ├── logos.ts         # Base64 fallbacks for ICM & Cambridge logos
│   │   └── hero.png         # Landing illustrations
│   ├── components/          # React components
│   │   ├── Header.tsx       # Navigation bar, model selector & key trigger
│   │   ├── Sidebar.tsx      # Dual-mode input form & controls
│   │   ├── LessonPlanPreview.tsx # Live interactive preview & in-place editor
│   │   ├── ApiKeyModal.tsx  # API key configuration modal
│   │   ├── AktMatrixModal.tsx # Anderson-Krathwohl reference guide
│   │   └── LogoCustomizerModal.tsx # Custom logo upload & manager
│   ├── data/                # Presets, sample lesson plans, and model definitions
│   │   ├── models.ts        # Gemini model configurations
│   │   └── sampleLessonPlan.ts # Sample physics/chemistry plan
│   ├── services/            # Core business logic
│   │   ├── geminiService.ts # Gemini prompt engineering & response parsing
│   │   └── docxGenerator.ts # Microsoft Word (.docx) document generator
│   ├── types/               # TypeScript interfaces & definitions
│   │   └── lessonPlan.ts    # Lesson plan, AKT matrix, & session types
│   ├── App.tsx              # Root application state & layout
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global design tokens & styling
├── .env.example             # Example environment configuration
├── package.json             # Project dependencies & scripts
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
