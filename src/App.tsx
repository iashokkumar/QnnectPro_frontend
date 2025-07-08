import { useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import CategoriesSection from './components/CategoriesSection';
import HowItWorksSection from './components/HowItWorksSection';
import ConnectSection from './components/ConnectSection';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ExpertDashboardLayout from './components/expert/ExpertDashboard';
import DashboardHome from './components/expert/DashboardHome';
import ExpertProfile from './components/expert/ExpertProfile';
import ExpertAvailability from './components/expert/ExpertAvailability';
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [connectModal, setConnectModal] = useState(false);
  const location = useLocation();
  const hideHeaderFooter = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/expert-dashboard');

  return (
    <GoogleOAuthProvider clientId="253676849799-pcrrah73knig1mbfr177u2nk4klpobdo.apps.googleusercontent.com">
      {!hideHeaderFooter && <Header />}
      <div className="min-h-screen bg-orange-500 text-white">

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
                  <Link 
                    to="/signup" 
                    className="inline-block mt-4 md:mt-6 px-6 py-3 text-base md:text-lg font-medium text-orange-500 bg-white rounded-md hover:bg-gray-200"
                  >
                    FIND EXPERTS
                  </Link>
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
          <Route path="/login" element={<Login userType="client" />} />
          <Route path="/signup" element={<Signup role="client" />} />
          <Route path="/login/client" element={<Login userType="client" />} />
          <Route path="/login/expert" element={<Login userType="expert" />} />
          <Route path="/signup/client" element={<Signup role="client" />} />
          <Route path="/signup/expert" element={<Signup role="expert" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Expert Dashboard Routes */}
          <Route path="/expert-dashboard" element={<ExpertDashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<ExpertProfile />} />
            <Route path="availability" element={<ExpertAvailability />} />
            <Route path="sessions" element={<div className="p-8">Sessions Management - Coming Soon</div>} />
            <Route path="earnings" element={<div className="p-8">Earnings - Coming Soon</div>} />
          </Route>
        </Routes>
        {/* Footer */}
        {!hideHeaderFooter && <Footer />}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App; 