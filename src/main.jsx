import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HeroUIProvider>
  </StrictMode>
);
