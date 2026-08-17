import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  publishableKey ? (
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  ) : (
    <App />
  )
);
