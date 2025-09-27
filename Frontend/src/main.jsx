import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { BaseUrlProvider } from "./contexts/BaseUrl.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BaseUrlProvider>
        <App />
      </BaseUrlProvider>
    </BrowserRouter>
  </StrictMode>
);
