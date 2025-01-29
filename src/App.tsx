import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Production } from './pages/Production';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/production" replace />} />
        <Route path="/production" element={<Production />} />
      </Routes>
    </Router>
  );
}

export default App;