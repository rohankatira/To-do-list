import React from "react";
import ReactDOM from "react-dom/client"; // ✅ use 'react-dom/client' for React 18+
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";

// ✅ createRoot is the new way to mount your app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
