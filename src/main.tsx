import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "antd/dist/reset.css"; // Ant Design CSS BEFORE Tailwind to avoid conflicts
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
