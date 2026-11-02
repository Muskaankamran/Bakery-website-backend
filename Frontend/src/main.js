import { createElement } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.js";

const root = document.getElementById("root");
createRoot(root).render(createElement(App));
