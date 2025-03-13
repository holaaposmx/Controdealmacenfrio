import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { I18nProvider } from "./lib/i18n";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

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
