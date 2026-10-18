# ✦ Chatakh Creations
**Editorial E-Commerce, Rendered Flawlessly.**  
*An ultra-premium, WebGL-powered fashion platform pushing the boundaries of digital commerce.*

Experience high-end physical fashion blended seamlessly with digital art. Explore curated collections, fluid 3D interactions, and cinematic scroll animations before making your purchase.

<br/>


Chatakh Creations is deployed as a production-grade web application with a complete user journey—from secure authentication to immersive product discovery and seamless cart management.

---

## 💡 Why Chatakh Creations?
E-commerce shouldn't just be a grid of products. 

**Experience matters.**

A standard storefront can make premium, high-quality garments feel disconnected and ordinary. High-end fashion houses rely on storytelling, physics, and emotion to convey the quality of their craftsmanship.

Chatakh Creations brings that editorial experience to the web.  
With a bespoke frontend engine, Chatakh delivers:

- **Immersive WebGL Environments**
- **Cinematic Scroll Animations**
- **Premium Editorial Typography**
- **Symmetric 50/50 Screen Layouts**
- **A Seamless, High-Fidelity Shopping Journey**

Don't just browse clothes. Experience the brand.

---

## ✨ Core Experience

| Feature | Description |
|---|---|
| 🎨 **Cinematic 3D** | Real-time WebGL backgrounds and physical canvas rendering using React Three Fiber. |
| ✨ **Fluid Animation** | GSAP ScrollTriggers and Framer Motion powering buttery-smooth page transitions. |
| 👗 **Editorial Layouts** | High-contrast, meticulously padded presentation mimicking physical fashion magazines. |
| 🛍️ **Smart Filtering** | Instantly discover curated collections across Man, Woman, and Couple categories. |
| 💬 **Custom Interactions** | A bespoke Flamingo custom cursor engine that reacts globally to interactable elements. |
| 🔒 **Secure Auth** | Enterprise-grade user sessions and identity management via Clerk. |

---

## 🎯 The User Journey

```text
                    ┌──────────────────┐
                    │   Landing Page   │
                    └────────┬─────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │    WebGL / GSAP     │
                  │ Editorial Story     │
                  └──────────┬──────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │   The Collections      │
                │                        │
                │ Signature Edit          │
                │ Premium Tailoring       │
                │ Dynamic Filtering       │
                └───────────┬────────────┘
                            │
            ┌───────────────┼────────────────┐
            ▼               ▼                ▼
      ┌──────────┐    ┌────────────┐   ┌──────────────┐
      │ Product  │    │ Seamless   │   │  Cart &      │
      │ Deep Dive│    │ Auth Flow  │   │  Checkout    │
      └──────────┘    └────────────┘   └──────────────┘
```

---

## 🧠 How It Works

Chatakh Creations combines cutting-edge frontend libraries into one cohesive fashion experience.

**Step 1 — Immersion**  
The user lands on the homepage and is instantly greeted by cinematic GSAP auto-revolving marquees and WebGL physics.

**Step 2 — Discovery**  
Navigating to the Collections page reveals a perfectly symmetric 50/50 editorial split. Users can filter by category using high-contrast, perfectly uniform luxury toggles.

**Step 3 — Deep Dive**  
Selecting a garment opens the Product Details.

**Step 4 — Authentication & Cart**  
Users are prompted to securely log in via Clerk before seamlessly managing their shopping cart state.

---

## 🏗️ System Architecture

```text
                           ┌────────────────────┐
                           │      User           │
                           │  Web Environment    │
                           └─────────┬──────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │ React 18 + Vite       │
                         │ Tailwind CSS v4       │
                         │ Custom UI Overrides   │
                         └───────────┬───────────┘
                                     │
              ┌──────────────────────┼─────────────────────┐
              │                      │                     │
              ▼                      ▼                     ▼
      ┌──────────────┐      ┌────────────────┐    ┌────────────────┐
      │ Clerk Auth   │      │ GSAP Engine    │    │ WebGL Canvas   │
      │              │      │                │    │                │
      │ User Mgmt    │      │ ScrollTriggers │    │ React Three    │
      │ Security     │      │ Page Trans.    │    │ Fiber / Drei   │
      └──────────────┘      └────────────────┘    └────────────────┘
              │                      │                     │
              └──────────────────────┼─────────────────────┘
                                     │
                                     ▼
                           ┌───────────────────┐
                           │  Backend / API    │
                           │                   │
                           │ Axios Client      │
                           │ Product Data      │
                           │ Session State     │
                           └───────────────────┘
```

---

## 🛠️ Tech Stack

**Frontend Framework**
- React 18
- Vite 5.4
- Tailwind CSS v4

**Animation & 3D**
- GSAP (GreenSock)
- Framer Motion
- Three.js
- React Three Fiber & Drei

**State & Security**
- Clerk (Authentication)
- React Router DOM
- Axios

---

## 🗺️ Application Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Cinematic Landing Page |
| `/collections` | Public | Luxury product browsing & filtering |
| `/product/:id` | Public | Deep-dive product details |
| `/cart` | Auth-based | Shopping cart management |
| `/login` | Guests | Clerk User Authentication |
| `/signup` | Guests | Account Creation |
| `/about` | Public | Brand story |

---

## 📁 Project Structure

```text
Chatakh_frontend/
│
├── public/                 # High-resolution media, videos, and brand logos
│
├── src/
│   ├── api/                # Axios instances and endpoint configurations
│   │
│   ├── components/
│   │   ├── Navbar & Footer # Global Navigation
│   │   ├── ProductCard     # Encapsulated presentation components
│   │   ├── CustomCursor    # Interactive cursor engine
│   │   └── landing/        # High-end Hero, 3D Canvas, & Scene3D
│   │
│   ├── constants/          # Brand tokens & static assets mappings
│   │
│   ├── context/            # Global state (Auth, Cart)
│   │
│   ├── pages/              # Core route views (Home, Collections, ProductDetails)
│   │
│   ├── utils/              # Helper functions & image transformers
│   │
│   ├── App.jsx             # Core router and layout wrapper
│   └── main.jsx            # Application entry point
│
├── tailwind.config.js      # Custom theme configurations
└── vite.config.js          # Build optimizations
```

---

## ⚡ Getting Started

### Prerequisites
Make sure the following are installed:
- Node.js 18+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/ketarora/Chatakh_frontend.git
cd Chatakh_frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:

| Variable | Required | Purpose |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk Authentication security |
| `VITE_API_URL` | ✅ | Backend API connection |

*Important: Never commit `.env` files or API keys to GitHub.*

### 4. Run Locally
Start the lightning-fast Vite development environment:
```bash
npm run dev
```
The application will spin up instantly at `http://localhost:5174`.

---

## 🔮 Future Roadmap

Potential future improvements include:
- 📱 **React Native Mobile Application**
- 🛍️ **Stripe Integration for actual checkout flows**
- 🪞 **More advanced WebGL clothing inspection models**
- 🌍 **Multi-region language support**
- 📈 **Personalized user wishlists**

---

## 🤝 Contributing
Contributions are welcome for future development.

**Development workflow:**
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature

# Make your changes
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```
Then open a Pull Request.

---

## 📜 License
Private Project — All Rights Reserved

This project and its source code are proprietary unless otherwise stated by the project maintainers.

<br/>

<div align="center">
  <b>✦ Chatakh Creations</b><br/>
  Discover. Style. Inspire.<br/>
  <em>Digital fashion that understands aesthetics.</em>
</div>

<br/>

<div align="center">
  <p>Built with React · GSAP · WebGL · Clerk</p>
  <p>⭐ If you like the project, consider starring the repository! ⭐</p>
</div>
