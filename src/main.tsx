import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary"; // Make sure this path matches your file structure!

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tip: Since you have a global Error Boundary, turning off retry on failure prevents 
      // your app from trying to fetch missing network data 3 times before showing the error layout.
      retry: false, 
    },
  },
});

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);