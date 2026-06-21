import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isAdminHost } from "@/lib/adminHost";

createRoot(document.getElementById("root")!).render(<App isAdminHost={isAdminHost()} />);
