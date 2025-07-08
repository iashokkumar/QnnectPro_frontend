import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSignup?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, isSignup = false }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'client' | 'expert'>('client');

  if (!isOpen) return null;

  const handleProceed = () => {
    onClose();
    if (isSignup) {
      navigate(`/signup/${activeTab}`);
    } else {
      navigate('/login');
    }
  };

  const handleSwitchAuth = () => {
    onClose();
    navigate(isSignup ? '/login' : '/signup');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold text-center">
            {isSignup ? 'Create an Account' : 'Welcome Back'}
          </h2>
          {isSignup && (
            <p className="text-center text-indigo-100 mt-1">
              Choose your account type
            </p>
          )}
        </div>

        {isSignup && (
          /* Role Selection Tabs - Only for Sign Up */
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('client')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'client'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              As a Client
            </button>
            <button
              onClick={() => setActiveTab('expert')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'expert'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              As an Expert
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {isSignup ? (
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {activeTab === 'client' ? 'Client Account' : 'Expert Account'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'client'
                  ? 'Find and connect with experts for your needs.'
                  : 'Offer your expertise and connect with clients.'}
              </p>
            </div>
          ) : (
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Sign in to your account
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Access your dashboard and continue your journey
              </p>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleProceed}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSignup ? `Sign up as ${activeTab}` : 'Sign in'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={handleSwitchAuth}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
          <button
            onClick={onClose}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
