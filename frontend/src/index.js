import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import "leaflet/dist/leaflet.css";

//Axios in JWT token automatically
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);