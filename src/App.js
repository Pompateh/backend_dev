// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import Dashboard from "./pages/Dashboard";
import Brands from "./pages/Brands";
import Illustrations from "./pages/Illustrations";
import Products from "./pages/Products";
import Typefaces from "./pages/Typefaces";

function App() {
  return (
    <Router>
      <ResponsiveDrawer>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/illustrations" element={<Illustrations />} />
          <Route path="/products" element={<Products />} />
          <Route path="/typefaces" element={<Typefaces />} />
        </Routes>
      </ResponsiveDrawer>
    </Router>
  );
}

export default App;
