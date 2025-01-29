import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { POS } from "@/pages/POS";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pos" element={<POS />} />
          {/* Agregar más rutas según sea necesario */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;