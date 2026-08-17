# ✦ Chatakh Creations

<div align="center">
  <img src="./public/logofinn.png" alt="Chatakh Creations Logo" width="300"/>
  <p><em>An ultra-premium, high-performance editorial e-commerce experience.</em></p>
</div>

---

## 💎 Overview
**Chatakh Creations** is a luxury fashion e-commerce frontend designed to emulate the sophisticated, immersive aesthetics of global high-end fashion houses. Built with modern web technologies, it features fluid **3D interactions**, **editorial typography**, and a **pixel-perfect responsive layout**.

This repository focuses purely on the frontend, delivering a seamless, highly engaging user experience from landing to checkout.

## 🚀 Key Features
- **Editorial Aesthetics**: Wide-screen 50/50 split layouts, custom cursors, and premium glassmorphism.
- **Cinematic Animations**: Powered by **GSAP** and **Framer Motion** for silky-smooth scroll triggers, dynamic marquees, and sophisticated page transitions.
- **Flawless E-Commerce Flow**: Comprehensive product filtering, dynamic detail views, and intuitive shopping cart mechanics.
- **Secure Authentication**: Integrated with **Clerk** for robust, secure, and modern user sign-in/sign-up flows.
- **Extreme Performance**: Built on **Vite + React** for lightning-fast HMR and minimal bundle sizes.

## 🛠 Tech Stack
| Category | Technology |
|---|---|
| **Core** | React 18, Vite |
| **Styling** | Tailwind CSS, Vanilla CSS overrides |
| **Animation** | GSAP (GreenSock), Framer Motion |
| **Authentication** | Clerk |
| **Routing** | React Router DOM |
| **HTTP Client** | Axios |

## 🏗️ Local Development Setup

To run this project locally, follow these steps:

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
Create a `.env` file in the root directory and add the necessary keys (e.g., your Clerk publishable key):
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the development server
```bash
npm run dev
```
The app will be available at `http://localhost:5174` (or whatever port Vite automatically assigns).

## 📁 Project Structure
The architecture is designed to be highly modular and scalable:
- `/src/components/` - Reusable UI elements (Navbar, Footer, ProductCards, Animations).
- `/src/pages/` - Core route views (Home, Collections, ProductDetails, Cart).
- `/src/context/` - Global state management (Auth, Cart data).
- `/src/api/` - Axios configurations for backend communication.
- `/src/constants/` - Brand tokens, typography config, and static assets mappings.
- `/public/` - High-resolution editorial media, videos, and logos.

## 💡 Design Philosophy
The UI relies heavily on high-contrast visuals: deep luxury inks (`#1d1512`), crisp white negative space, and strategic vibrant accents (`#ec0080`). We avoided standard drag-and-drop UI kits in favor of bespoke padding logic and custom CSS to achieve the absolute highest caliber of visual polish.

---
<div align="center">
  <sub>Developed with meticulous attention to detail.</sub>
</div>
