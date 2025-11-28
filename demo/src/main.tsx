import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// Read redirect query param
const params = new URLSearchParams(location.search);
const redirect = params.get("redirect");

if (redirect) {
  history.replaceState(null, "", redirect);
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="/react-hook-form-ai/">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);