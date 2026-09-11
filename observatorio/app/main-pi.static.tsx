import { createRoot } from "react-dom/client";
import "./globals.css";
import PIDashboard from "./pi_dashboard";

const container = document.getElementById("pi-root");
const dataScript = document.getElementById("pi-data");
if (!container || !dataScript) {
  throw new Error("Elemento #pi-root ou #pi-data não encontrado no HTML.");
}

const payload = JSON.parse(dataScript.textContent || "{}");

createRoot(container).render(
  <PIDashboard data={payload.chartData} totals={payload.totals} />
);
