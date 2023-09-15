import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";
import Index from './pages/Index';
import Detail from './pages/Detail';
import Category from './pages/Category';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';

const REACT_APP_SUPABASE_URL = "https://vnuqwzaoqxrmtfpumnhy.supabase.co";
const REACT_APP_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudXF3emFvcXhybXRmcHVtbmh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMwMjA5OTYsImV4cCI6MjAwODU5Njk5Nn0.Z3EAQypKZg-MTjLbTuQKF6Q_DZeVMGo_WPTQtQ9dAIY";

const apiUrl = REACT_APP_SUPABASE_URL || "";
const apiKey = REACT_APP_SUPABASE_KEY || "";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const supabase = createClient(apiUrl, apiKey);

  const location = useLocation();
  console.log("LOCATION :", location)

  // Check if the path is /login or /register
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  // Render the Navigation component unless on /login or /register
  const renderNavigation = !(isLoginPage || isRegisterPage);

  return (
    <>
      {renderNavigation && <Navigation supabase={supabase} />}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:id" element={<Detail supabase={supabase} />} />
        <Route path="/product/category/:id" element={<Category />} />
        <Route path="/login" element={<Login supabase={supabase} />}></Route>
        <Route path="/register" element={<Register supabase={supabase} />}></Route>
        <Route path="/cart" element={<Cart supabase={supabase} />}></Route>
      </Routes>
    </>
  );
}

export default App;
