import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "@/store";
import { queryClient } from "@/api/queryClient";
import "@/i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
