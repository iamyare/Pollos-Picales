import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";
import { Production } from "@/pages/Production";
// Importar otros componentes

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/production" element={<Production />} />
        {/* <Route path="/inventory" element={<Inventory />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/financials" element={<Financials />} /> */}
      </Routes>
    </Router>
  );
}

export default App;