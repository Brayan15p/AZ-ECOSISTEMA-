import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import AppShell from "./pages/AppShell.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<AppShell />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
