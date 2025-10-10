import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ButtonSizeTest from "./pages/ButtonSizeTest";
import AIIconographyShowcase from "./pages/AIIconographyShowcase";
import NotFound from "./pages/NotFound";

const App = () => (
  <>
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AIIconographyShowcase />} />
        <Route path="/button-test" element={<ButtonSizeTest />} />
        {/* Redirect old route to main showcase */}
        <Route path="/ai-showcase" element={<Navigate to="/" replace />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
