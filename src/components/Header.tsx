import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from './auth/AuthModal';

const Header = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const closeModals = () => {
    setIsSignupModalOpen(false);
  };
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center
          ">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Qnnect</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/features" className="text-base font-medium text-gray-700 hover:text-indigo-600">
                Features
              </Link>
              <Link to="/pricing" className="text-base font-medium text-gray-700 hover:text-indigo-600">
                Pricing
              </Link>
              <Link to="/about" className="text-base font-medium text-gray-700 hover:text-indigo-600">
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-base font-medium text-gray-700 hover:text-indigo-600"
            >
              Sign in
            </Link>
            <button
              onClick={openSignupModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Sign up
            </button>
          </div>
          {/* Signup Modal */}
          <AuthModal 
            isOpen={isSignupModalOpen} 
            onClose={closeModals} 
            isSignup={true} 
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
