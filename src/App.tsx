import { useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";
import Index from './pages/Index';
import Detail from './pages/Detail';
import Category from './pages/Category';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Footer from "./components/Footer";
import Checkout from "./pages/Checkout";

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
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                const allowedRoutes = ["/", "/register", "/login"];

                if (!allowedRoutes.includes(location.pathname)) {
                    const categoryPattern = /^\/product\/category\//;
                    if (!categoryPattern.test(location.pathname)) {
                        navigate("/login");
                    }
                }
            }
        };

        checkUser();
    }, [supabase, location, navigate]);

    const isLoginPage = location.pathname === "/login";
    const isRegisterPage = location.pathname === "/register";

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
                <Route path="/checkout" element={<Checkout supabase={supabase} />}></Route>
                <Route path="/*" element={<Navigate to="/" />}></Route>
            </Routes>
            <Footer />
        </>
    );
}

export default App;
