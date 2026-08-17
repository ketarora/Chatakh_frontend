<div align="center">
  <img src="./public/logofinn.png" alt="Chatakh Creations Logo" width="350"/>
  <br />
  <p><em>An ultra-premium, WebGL-powered editorial e-commerce frontend.</em></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Three.js-WebGL-000000?style=flat-square&logo=three.js&logoColor=white" alt="Three.js" />
    <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/GSAP-Animation-88CE02?style=flat-square&logo=greensock&logoColor=white" alt="GSAP" />
  </p>
</div>

---

## 💎 Overview

**Chatakh Creations** is not just an e-commerce platform; it is a meticulously crafted digital experience. Designed to emulate the sophisticated, immersive aesthetics of global high-end fashion houses (inspired by luxury editorial layouts), this platform blends physical fashion with digital art.

By leveraging **WebGL (React Three Fiber)** and **GSAP ScrollTriggers**, the platform delivers cinematic 3D interactions, editorial typography, and a pixel-perfect layout that transcends standard drag-and-drop storefronts.

## 🚀 Extraordinary Features

### 🎨 Immersive WebGL & 3D Environments
- **Thread Canvas & Scene3D**: Integrates `@react-three/fiber` and `@react-three/drei` to render gorgeous, real-time 3D physics and visual canvas elements in the background, making the website feel alive.
- **Living Atelier Scene**: Interactive 3D environments that react to user scroll and cursor movement seamlessly.

### ✨ Cinematic Animations
- **GSAP (GreenSock) Mastery**: Utilizes `@gsap/react` for buttery-smooth, staggered scroll triggers, dynamic auto-revolving marquees, and complex parallax effects.
- **Framer Motion**: Handles seamless, physical-feeling page transitions and micro-interactions.
- **Custom Cursor Engine**: A highly tailored, globally tracked custom cursor system that reacts uniquely when hovering over interactive elements.

### 🛍️ Flawless E-Commerce Flow
- **Editorial Layouts**: Wide-screen 50/50 split presentations, beautifully encapsulated product cards, and massive luxury toggle pills for filtering.
- **Dynamic Collections**: Real-time filtering and routing for specific category states (Man, Woman, Couple).
- **Cart & Product Details**: Integrated context management for shopping carts and highly immersive product deep-dives.

### 🔒 Enterprise-Grade Infrastructure
- **Authentication**: Seamless, secure user management powered by **Clerk**.
- **Performance**: Built natively on **Vite** for lightning-fast HMR and aggressive production minification.
- **API Connectivity**: Scalable asynchronous backend communication via **Axios**.

## 🛠 Tech Stack Deep Dive

| Layer | Technologies |
|---|---|
| **Core Framework** | React 18, Vite |
| **Styling Engine** | Tailwind CSS v4, Custom Vanilla Overrides (`Landing.css`, `index.css`) |
| **WebGL / 3D** | Three.js, React Three Fiber, React Three Drei |
| **Animation Engine** | GSAP, Framer Motion |
| **Authentication** | Clerk (`@clerk/clerk-react`) |
| **Routing & State** | React Router DOM, Custom Context APIs |

## 🏗️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ketarora/Chatakh_frontend.git
cd Chatakh_frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure your essential keys:
```env
# Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Backend Connection
VITE_API_URL=http://localhost:5000/api
```

### 4. Ignite the Development Server
```bash
npm run dev
```
The application will spin up instantly at `http://localhost:5174`.

## 📁 Architecture

The codebase strictly adheres to modular, scalable React patterns:

```text
├── public/                 # High-resolution editorial media, videos, and brand logos
├── src/
│   ├── api/                # Axios instances and endpoint configurations
│   ├── components/         # Reusable UI (Navbar, Footer, ProductCards, CustomCursor)
│   │   └── landing/        # High-end landing page components (HeroScene, 3D Canvas)
│   ├── constants/          # Brand tokens, static assets mappings
│   ├── context/            # Global state (AuthContext, CartContext)
│   ├── pages/              # Core route views (Home, Collections, ProductDetails)
│   ├── utils/              # Helper functions
│   ├── App.jsx             # Core router and layout wrapper
│   └── main.jsx            # Application entry point
├── tailwind.config.js      # Custom theme configurations
└── vite.config.js          # Build optimizations
```

## 💡 Design Philosophy

The UI breaks standard conventions to prioritize emotion and luxury:
- **Color Palette**: Relies on deep luxury inks (e.g., `#1d1512`), crisp white negative space (`#fffaf6`), and strategic vibrant accents (`#ec0080`).
- **Typography**: Editorial-grade serif headers heavily contrasted against modern sans-serif body text.
- **Geometry**: Pill-shaped navigational elements, perfectly symmetric encapsulated cards, and strict central-aligned grid systems that evoke high fashion editorials.

---
<div align="center">
  <sub>Engineered with meticulous attention to detail.</sub>
</div>
