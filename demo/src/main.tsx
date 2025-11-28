import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Restore intended SPA route after GitHub Pages redirect fallback
if (sessionStorage.redirect) {
  const redirectUrl = sessionStorage.redirect as string;
  delete sessionStorage.redirect;
  history.replaceState(null, "", redirectUrl);
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="/rhf-demo/">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);