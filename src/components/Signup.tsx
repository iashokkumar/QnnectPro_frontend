import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isExpertSignup = new URLSearchParams(location.search).get('role') === 'expert';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        ...formData,
        role: 'user',
      });
      const { user, token } = response.data;
      if (user && token) {
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('token', token);
        if (isExpertSignup) {
          navigate('/expert-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || 'Signup failed');
      } else if (err.request) {
        setError('No response from server. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Sign up as a User</h2>
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign up
            </button>
          </div>
        </form>
        <div className="flex justify-center my-4">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                try {
                  const response = await axios.post('http://localhost:5000/api/auth/google', {
                    token: credentialResponse.credential,
                    role: 'user', // Ensure user role
                  });
                  const { user, token } = response.data;
                  if (user && token) {
                    localStorage.setItem('userName', user.name || 'User');
                    localStorage.setItem('userEmail', user.email || '');
                    localStorage.setItem('userRole', user.role || 'user');
                    localStorage.setItem('token', token);
                    if (isExpertSignup) {
                      navigate('/expert-dashboard');
                    } else {
                      navigate('/dashboard');
                    }
                  }
                } catch (err) {
                  setError('Google signup failed.');
                }
              }
            }}
            onError={() => setError('Google signup failed.')}
          />
        </div>
        <div className="text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default Signup; 