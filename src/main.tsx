import React from "react";
import ReactDOM from "react-dom/client";
import { Provider }
from "react-redux";

import { store }
from "./redux/store";

import "./index.css";

import App from "./App";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

const queryClient =
  new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <QueryClientProvider
      client={queryClient}
    >
      <Provider store={store}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);