import { createRoot } from "react-dom/client";
import "./globals.css";
import Home from "./page";

const container = document.getElementById("observatorio-root");
if (!container) {
  throw new Error("Elemento #observatorio-root não encontrado no HTML.");
}

createRoot(container).render(<Home />);
