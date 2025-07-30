import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import your components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import ONLY the pages that you have created and want to use
import HomePage from './pages/HomePage';
import CheckerPage from './pages/CheckerPage';
import AboutPage from './pages/AboutPage';
import TipsPage from './pages/TipsPage';
import PricingPage from './pages/PricingPage';
import CheckoutPage from './pages/CheckoutPage'; 
import SupportPage from './pages/SupportPage'; 

function App() {
  return (
    <Router>
      <Navbar />

      <div className="app-container">
        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/check" element={<CheckerPage />} />
            
            <Route path="/about" element={<AboutPage />} />
            <Route path="/tips" element={<TipsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
             <Route path="/checkout/:planName" element={<CheckoutPage />} />
             <Route path="/support" element={<SupportPage />} />
           
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;