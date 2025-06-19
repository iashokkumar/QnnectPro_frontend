import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import CategoriesSection from './components/CategoriesSection';
import HowItWorksSection from './components/HowItWorksSection';
import ConnectSection from './components/ConnectSection';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import RoleSelection from './components/RoleSelection';
import Dashboard from './components/Dashboard';
import ExpertDashboard from './components/ExpertDashboard';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [navOpen, setNavOpen] = useState(false);
  const [connectModal, setConnectModal] = useState(false);
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/dashboard' || location.pathname === '/expert-dashboard';

  return (
    <GoogleOAuthProvider clientId="253676849799-pcrrah73knig1mbfr177u2nk4klpobdo.apps.googleusercontent.com">
      <div className="min-h-screen bg-orange-500 text-white">
        {/* Navigation Bar */}
        {!hideHeaderFooter && (
          <nav className="bg-white text-gray-800 shadow-lg sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                {/* Logo */}
                <div className="flex items-center">
                  <span className="text-xl font-bold">Qnnect</span>
                </div>
                {/* Hamburger for mobile */}
                <button className="md:hidden p-2" onClick={() => setNavOpen(!navOpen)}>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                {/* Navigation Links */}
                <div className={`fixed md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent z-30 md:flex space-y-4 md:space-y-0 md:space-x-8 p-4 md:p-0 transition-all duration-300 ${navOpen ? 'block' : 'hidden'} md:block`}>
                  <Link to="/" className="block md:inline hover:text-blue-600">Home</Link>
                  <Link to="#" className="block md:inline hover:text-blue-600">Search</Link>
                  <Link to="/categories" className="block md:inline hover:text-blue-600">Categories</Link>
                  <Link to="/experts" className="block md:inline hover:text-blue-600">Explore Experts</Link>
                  <button onClick={() => { setConnectModal(true); setNavOpen(false); }} className="block md:inline hover:text-blue-600 bg-transparent border-none p-0 m-0 focus:outline-none cursor-pointer">Contact us</button>
                  <div className="md:hidden border-t pt-4 mt-4">
                    <Link to="/login" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">Login</Link>
                    <Link to="/role-selection" className="block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 mt-2">Sign Up</Link>
                  </div>
                </div>
                {/* Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Login
                  </Link>
                  <Link to="/role-selection" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Connect Modal */}
        {connectModal && !hideHeaderFooter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full relative p-6">
              <button className="absolute top-2 right-2 text-gray-700 text-2xl font-bold" onClick={() => setConnectModal(false)}>&times;</button>
              <ConnectSection />
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <>
              {/* Hero Section */}
              <header className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8 md:gap-0">
                {/* Left Content */}
                <div className="md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
                  <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-2 md:mb-4">
                    Connect with Experts in Minutes
                  </h2>
                  <h3 className="text-xl md:text-3xl font-semibold mb-4 md:mb-6">
                    Top Minds. Real Insights. One-on-One.
                  </h3>
                  <button className="mt-4 md:mt-6 px-6 py-3 text-base md:text-lg font-medium text-orange-500 bg-white rounded-md hover:bg-gray-200">
                    FIND EXPERTS
                  </button>
                </div>
                {/* Right Illustration - Placeholder */}
                <div className="md:w-1/2 flex justify-center">
                  <div className="w-48 h-48 md:w-64 md:h-64 bg-orange-400 rounded-full flex items-center justify-center text-white text-center">
                    Illustration Placeholder
                  </div>
                </div>
              </header>
              {/* Categories Section */}
              <CategoriesSection />
              {/* How It Works Section */}
              <HowItWorksSection />
              {/* Connect Section */}
              <ConnectSection />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expert-dashboard" element={<ExpertDashboard />} />
        </Routes>
        {/* Footer */}
        {!hideHeaderFooter && <Footer />}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App; 