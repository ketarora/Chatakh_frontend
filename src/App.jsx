import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth as useClerkAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Boot from "./components/Boot";
import { ScrollToTop, BackToTop } from "./components/Chrome";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import About from "./pages/About";
import Collections from "./pages/Collections";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import ProductDetails from "./pages/ProductDetails";
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import { setupAxiosInterceptors } from "./api/axios";
import "./App.css";

const ClerkTokenBridge = () => {
  let getToken = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ({ getToken } = useClerkAuth());
  } catch {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (getToken) setupAxiosInterceptors(getToken);
  }, [getToken]);

  return null;
};

const App = () => {
  const shouldUseClerk = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  return (
    <CartProvider>
      <WishlistProvider>
        <AuthProvider>
          <BrowserRouter>
            {shouldUseClerk && <ClerkTokenBridge />}
            <Boot />
            <ScrollToTop />
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:mainCollection" element={<Collections />} />
                <Route path="/navratri" element={<Collections />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            <BackToTop />
          </BrowserRouter>
        </AuthProvider>
      </WishlistProvider>
    </CartProvider>
  );
};

export default App;
