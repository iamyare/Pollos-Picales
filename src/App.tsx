import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Dashboard } from "@/pages/Dashboard";
import { POS } from "@/pages/POS";
import { Products } from "./pages/Inventory";
import { Production } from "./pages/Productions";
import { Finance } from "./pages/Finance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="pos" element={<POS />} />
          <Route path="products" element={<Products/>} />
          <Route path="waste" element={<Production/>} />
          <Route path="finance" element={<Finance/>} />
          {/* Agregar más rutas según sea necesario */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;