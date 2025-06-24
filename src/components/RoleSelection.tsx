import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'user' | 'expert') => {
    navigate(`/signup?role=${role}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Choose Your Role</h2>
        <p className="text-center text-gray-600">Select how you want to join Qnnect</p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('user')}
            className="w-full p-6 text-left border rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-800">Join as a User</h3>
            <p className="text-gray-600">Connect with experts and get the guidance you need</p>
          </button>

          <button
            onClick={() => handleRoleSelect('expert')}
            className="w-full p-6 text-left border rounded-lg hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-800">Join as an Expert</h3>
            <p className="text-gray-600">Share your expertise and connect with users who need your guidance</p>
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection; 