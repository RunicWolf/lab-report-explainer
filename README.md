# Lab Report Explainer with Doctor Finder

## 📂 Project Folder Structure

```
LAB-REPORT-EXPLAINER/
├── backend/                         # Backend (FastAPI + SQLAlchemy)
│   ├── __pycache__/                # Python cache files
│   ├── venv/                       # Python virtual environment
│   ├── .env                        # Environment variables (backend-specific)
│   ├── .env.example                # Sample env file template
│   ├── .gitignore                  # Git ignore rules (backend)
│   ├── database.py                 # SQLAlchemy setup (engine, SessionLocal, Base)
│   ├── main.py                     # FastAPI app, routes: /start-session/, /chat/, /doctors/
│   ├── models.py                   # SQLAlchemy models (Doctor, etc.)
│   ├── seed_doctors.py             # Script to seed sample doctor data into database
│
├── frontend/                        # Frontend (React + TypeScript + Tailwind CSS)
│   ├── node_modules/               # Frontend dependencies
│   ├── public/                     # Public static assets
│   ├── src/                        # Source files
│   │   ├── assets/                 # Images or other frontend assets
│   │   ├── components/            # React components
│   │   │   ├── DoctorCardList.tsx        # Displays doctor cards with Google Maps links
│   │   │   ├── DoctorRecommendation.tsx  # Search form for doctor specialty/location
│   │   │   ├── LabReportexplainer.tsx    # Lab report upload form + chat assistant UI
│   │   │   ├── Upload.tsx                # Upload helper component
│   │   ├── App.css                  # Global CSS
│   │   ├── App.tsx                  # Main layout and router
│   │   ├── index.css                # Tailwind CSS config applied globally
│   │   ├── main.tsx                 # React root setup
│   │   ├── vite-env.d.ts            # Vite environment types
│   ├── .gitignore                  # Git ignore rules (frontend)
│   ├── eslint.config.js            # ESLint configuration
│   ├── index.html                  # Base HTML template
│   ├── package-lock.json           # Dependency lock file
│   ├── package.json                # Project metadata and scripts
│   ├── postcss.config.js           # PostCSS config (Tailwind plugin integration)
│   ├── README.md                   # Frontend readme
│   ├── report.pdf                  # Sample report/document
│   ├── tailwind.config.js          # Tailwind CSS configuration (light/dark mode toggle enabled)
│   ├── tsconfig.app.json           # TypeScript config (app-specific)
│   ├── tsconfig.json               # Global TypeScript config
│   ├── tsconfig.node.json          # TypeScript config for Node.js files
│   ├── vite.config.ts              # Vite build tool configuration
│
├── .env                             # Root-level environment variables (if needed)
├── .gitignore                       # Git ignore rules (root)
├── doctors.db                       # SQLite database (generated by backend)
├── README.md                        # Main project documentation
```
