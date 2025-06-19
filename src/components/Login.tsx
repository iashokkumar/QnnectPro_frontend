import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      // Handle successful login
      const { user, token } = response.data;
      if (user && token) {
        localStorage.setItem('userName', user.name || 'User');
        localStorage.setItem('userEmail', user.email || '');
        localStorage.setItem('userRole', user.role || '');
        localStorage.setItem('token', token);
      }
      if (user && user.role === 'expert') {
        navigate('/expert-dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (err: any) {
      // Handle backend errors or network errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data.message || 'Login failed');
        console.error('Login failed:', err.response.data);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please ensure the backend is running and accessible.');
        console.error('No response from server:', err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An error occurred. Please try again.');
        console.error('Error during login:', err.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Passwords</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-gray-600">
          Don't have an account? <a href="/role-selection" className="font-medium text-blue-600 hover:text-blue-500">Sign up</a>
        </div>
        <div className="flex justify-center my-4">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              if (credentialResponse.credential) {
                try {
                  const response = await axios.post('http://localhost:5000/api/auth/google', {
                    token: credentialResponse.credential,
                  });
                  const { user, token } = response.data;
                  if (user && token) {
                    localStorage.setItem('userName', user.name || 'User');
                    localStorage.setItem('userEmail', user.email || '');
                    localStorage.setItem('userRole', user.role || '');
                    localStorage.setItem('token', token);
                    if (user.role === 'expert') {
                      navigate('/expert-dashboard');
                    } else {
                      navigate('/dashboard');
                    }
                  }
                } catch (err) {
                  setError('Google login failed.');
                }
              }
            }}
            onError={() => setError('Google login failed.')}
          />
        </div>
      </div>
    </div>
  );
};

export default Login; 