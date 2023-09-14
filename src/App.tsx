import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Index from './pages/Index';
import Detail from './pages/Detail';
import Category from './pages/Category';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { pathname } = useLocation(); // Get the current route path

  // Define a regular expression pattern for product ID routes
  const productIDPattern = /^\/product\/\d+$/;

  // Check if the path matches the pattern of a product ID route
  const isProductIDRoute = productIDPattern.test(pathname);

  return (
    <>
      {!isProductIDRoute && pathname !== '/' && <Navigation />} {/* Render Navigation if not on a product ID route or index */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:id" element={<Detail />} />
        <Route path="/product/category/:id" element={<Category />} />
      </Routes>
    </>
  );
}

export default App;
