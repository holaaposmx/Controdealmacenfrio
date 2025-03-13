import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { I18nProvider } from "./lib/i18n";
import { initNetworkListeners, cacheEssentialData } from "./lib/offlineStorage";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Initialize offline functionality
initNetworkListeners();

// Cache essential data for offline use
if (navigator.onLine) {
  cacheEssentialData().catch(console.error);
}

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </I18nProvider>
  </React.StrictMode>,
);
