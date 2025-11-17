# Cognisense Frontend

Cognisense empowers you to visualize and analyze your digital productivity, featuring both a powerful **web dashboard** and an integrated **browser extension** (all in one repo)! Uncover insights about your digital habits with interactive analytics and feedback.

---

## ✨ Overview

Cognisense tracks your online activity and presents actionable insights to help you understand time spent, workflow patterns, and productivity trends.

**This project contains:**
- 🌐 **Web Dashboard** (React, Vite, Tailwind)  
- 🧩 **Browser Extension** (direct activity tracking; see [extension/README.md](./extension/README.md))

### Key Features

- 📊 **Dashboard Analytics:** Visualize detailed web/app activity by day, week, and custom ranges
- 📈 **Productivity Metrics:** Discover which digital behaviors help or hinder you
- 💡 **Suggestions:** Actionable advice based on your tracked data
- 🎨 **Modern, Responsive UI:** Optimized for desktop and mobile

---

## ⚙️ Tech Stack

- **React + Vite:** Fast, modular code & hot reloading (web)
- **Tailwind CSS:** Utility-first styles, responsive out of the box
- **Chart.js:** Powerful interactive graphs
- **Browser Extension APIs:** Tracks tabs, URLs, and syncs data
- **ESLint & Prettier:** Code linting and formatting
- **Husky:** Pre-commit hooks

---

## 🚀 Getting Started (Web Dashboard)

### 1. Clone the repository
```bash
git clone https://github.com/DhruvPokhriyal/cognisense-frontend.git
cd cognisense-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file:
```
VITE_API_BASE_URL=https://your-backend-api.com
```

### 4. Launch the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

---

## 🧩 Browser Extension

- Source code is located in `/extension`.
- Please read [extension/README.md](./extension/README.md) for setup, features, and developer guidance.

---

## 🛠 Project Structure

```
cognisense-frontend/
├── extension/        # Browser extension code & docs
│   └── README.md     # Extension-specific docs
├── public/           # Static assets for web app
├── src/
│   ├── components/   # Reusable React UI
│   ├── pages/        # Dashboard screens
│   ├── hooks/        # Custom hooks
│   ├── api/          # API integration
│   ├── assets/       # Images, icons
│   └── App.jsx       # Entry web app
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

## 🧑‍💻 Technical Notes

### Website

- **Routing:** React Router v6
- **API:** Centralized client in `src/api/`
- **State:** React hooks, scalable to Context/Redux
- **Charts:** Chart.js React wrappers
- **Styling:** Strict Tailwind-first
- **Linting:** ESLint, Prettier, Husky
- **Build:** Vite static build

### Extension

- **Code:** See `/extension`
- **API:** Chrome/Browser APIs for tab and URL activity tracking
- **Sync:** Extension sends data to backend, dashboard pulls analytics

---

## 📢 Contributing

Pull requests are welcome! Issues go [here](https://github.com/DhruvPokhriyal/cognisense-frontend/issues).

---

## 📚 License

MIT © DhruvPokhriyal

---

## 🧬 Technical Deep-Dive

- **Monorepo:** Website + extension, built independently
- **Extension:** Tracks browser events, sends activity to backend for analytics by the dashboard
- **Data Flow:** Extension → Backend → Dashboard (Web)
- **Config:** Tailwind themes, ENV backend endpoint
- **Scalability:** Modular design for adding new analytics or extension features

Find extension docs in [extension/README.md](./extension/README.md)
