import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const isAdminHost = typeof window !== 'undefined' && window.location.hostname === 'admin.localhost';

createRoot(document.getElementById("root")!).render(<App isAdminHost={isAdminHost} />);
