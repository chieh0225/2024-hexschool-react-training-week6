import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "sweetalert2/src/sweetalert2.scss";
import "./assets/week6.scss";

// import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
