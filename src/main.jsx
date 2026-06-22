import React from "react";
import ReactDOM from "react-dom/client";
import "./storage-polyfill.js";
import AZEcosistema from "./AZEcosistema.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AZEcosistema />
  </React.StrictMode>
);
