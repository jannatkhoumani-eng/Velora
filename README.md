<p align="center">
  <img src="https://img.shields.io/badge/Velora-Restaurant%20Management-d4a056?style=for-the-badge&labelColor=0B1120" alt="Velora Badge" />
</p>

<h1 align="center">✨ Velora — Luxury Restaurant Reservation System</h1>

<p align="center">
  <b>A full-stack restaurant reservation management platform featuring a cinematic React dashboard and a C-based CLI engine.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Backend-Express.js-000?logo=express&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/CLI-C%20Language-A8B9CC?logo=c&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square" />
</p>

---

## 📖 About

**Velora** is a premium restaurant reservation management system built as a university mini-project. The project combines two complementary approaches:

1. **A C-based CLI application** — the foundational reservation engine with file-based persistence.
2. **A modern full-stack web application** — a cinematic React + Express.js platform for managing reservations through a luxury-themed dashboard.

The web interface features glassmorphism design, ambient audio, a splash screen experience, an intelligent "Velora Assistant" panel, real-time analytics, and QR-code reservation tickets.

---

## 🌟 Features

### Web Application (React + Express)

| Feature | Description |
|---------|-------------|
| 🎬 **Cinematic Splash Screen** | Immersive entrance with ambient audio and smooth animations |
| 📊 **Analytics Dashboard** | Visual insights with charts powered by Recharts |
| ➕ **Add Reservations** | Full validation — name, phone, date, time, table capacity |
| 📋 **List Reservations** | View all active bookings with detailed information |
| 🔍 **Search** | Search by ID, name, or date & time |
| 🪑 **Available Tables** | Real-time table availability for any date/time slot |
| 🤖 **Velora Assistant** | Intelligent insights panel with data-driven recommendations |
| 🎫 **QR Code Tickets** | Generate reservation tickets with scannable QR codes |
| 🌙 **Premium Dark UI** | Glassmorphism, gradients, micro-animations, mouse glow effects |
| 🎵 **Ambient Audio** | Background music for an immersive experience |

### CLI Application (C)

| Feature | Description |
|---------|-------------|
| 📝 **Reserve a Table** | Input-validated booking (name, phone, time, capacity checks) |
| ❌ **Cancel Reservation** | Remove bookings by ID with confirmation |
| 📃 **List Reservations** | Display all active reservations |
| 🪑 **Check Available Tables** | View free tables for a given date and time |
| 🔎 **Search Reservations** | Search by ID, name + surname, or date + time |
| 💾 **Persistent Storage** | Data saved to `reservations.txt` automatically |

---

## 🏗️ Architecture

```
Velora/
├── janna.c                    # C CLI reservation engine
├── README.md
├── .gitignore
│
└── restaurant-app/
    ├── client/                # React Frontend (Vite)
    │   ├── public/
    │   │   ├── audio/         # Ambient audio files
    │   │   └── videos/        # Hero video assets
    │   └── src/
    │       ├── components/    # Reusable UI components
    │       │   ├── AmbiencePlayer.jsx
    │       │   ├── FloatingLines.jsx
    │       │   ├── Logo.jsx
    │       │   ├── MouseGlow.jsx
    │       │   ├── ReservationTicket.jsx
    │       │   └── SplashScreen.jsx
    │       ├── pages/         # Application pages
    │       │   ├── AddReservation.jsx
    │       │   ├── AnalyticsDashboard.jsx
    │       │   ├── AvailableTables.jsx
    │       │   ├── Dashboard.jsx
    │       │   ├── LandingPage.jsx
    │       │   ├── ListReservations.jsx
    │       │   └── SearchReservations.jsx
    │       ├── App.jsx        # Main app with routing & layout
    │       ├── App.css
    │       ├── index.css      # Global styles & design tokens
    │       └── main.jsx       # Entry point
    │
    └── server/                # Express.js Backend
        ├── index.js           # API routes & validation logic
        ├── data.json          # JSON-based data store
        └── package.json
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, React Router v7, Vite |
| **Styling** | TailwindCSS 3, Custom CSS (glassmorphism, gradients) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **QR Codes** | qrcode.react |
| **HTTP Client** | Axios |
| **Backend** | Node.js, Express.js |
| **Data Storage** | JSON file (server), TXT file (CLI) |
| **CLI** | C (GCC compatible) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 16
- **npm** ≥ 8
- **GCC** (for the C CLI — optional)

### 1. Clone the Repository

```bash
git clone https://github.com/jannatkhoumani-eng/Velora.git
cd Velora
```

### 2. Run the Web Application

**Start the backend server:**

```bash
cd restaurant-app/server
npm install
npm run dev
```

The API server will start on `http://localhost:5000`.

**Start the frontend (in a new terminal):**

```bash
cd restaurant-app/client
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

### 3. Run the C CLI (Optional)

```bash
gcc janna.c -o velora_cli
./velora_cli
```

On Windows:

```bash
gcc janna.c -o velora_cli.exe
velora_cli.exe
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/reservations` | Retrieve all reservations |
| `POST` | `/reservations` | Create a new reservation |
| `DELETE` | `/reservations/:id` | Delete a reservation by ID |
| `GET` | `/search?type=id&query=1` | Search by ID |
| `GET` | `/search?type=name&query=Ali` | Search by name |
| `GET` | `/search?type=datetime&qDate=15/05/26&qTime=19:00` | Search by date & time |
| `GET` | `/available-tables?date=15/05/26&time=19:00` | Check table availability |

### Example — Create a Reservation

```bash
curl -X POST http://localhost:5000/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Doe",
    "prenom": "John",
    "telephone": "0612345678",
    "date": "20/05/26",
    "heure": "19:30",
    "persons": 4,
    "table": 5
  }'
```

---

## ⏰ Restaurant Operating Hours

| Session | Hours |
|---------|-------|
| Morning / Lunch | 09:00 — 12:59 |
| Afternoon / Dinner | 14:00 — 22:59 |

### Table Configuration

| Tables | Capacity |
|--------|----------|
| 1 – 3 | 2 persons |
| 4 – 6 | 4 persons |
| 7 – 9 | 6 persons |
| 10 | 10 persons |

---

## 👩‍💻 Author

**Jannat Khoumani**
- GitHub: [@jannatkhoumani-eng](https://github.com/jannatkhoumani-eng)

---

## 📄 License

This project was developed as a university mini-project. Feel free to use it for educational purposes.

---

<p align="center">
  <i>Built with ❤️ and ☕ by Jannat</i>
</p>
