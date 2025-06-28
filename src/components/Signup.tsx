import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpertSignup, setIsExpertSignup] = useState(false);
  
  // Check URL for role parameter (for backward compatibility)
  useEffect(() => {
    const roleParam = new URLSearchParams(location.search).get('role');
    if (roleParam === 'expert') {
      setIsExpertSignup(true);
    }
  }, [location.search]);

  interface Education {
    institution: string;
    degree: string;
    field: string;
    year: string;
  }

  interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: 'user' | 'expert';
    title: string;
    specialties: string[];
    hourlyRate: string;
    experience: string;
    bio: string;
    education: Education[];
  }

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',  // Default to 'user' (client)
    title: '',
    specialties: [],
    hourlyRate: '',
    experience: '',
    bio: '',
    education: [{ institution: '', degree: '', field: '', year: '' }]
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role: 'user' | 'expert') => {
    setFormData(prev => ({
      ...prev,
      role
    }));
    setIsExpertSignup(role === 'expert');
  };
  
  const handleSpecialtiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const specialties = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      specialties
    }));
  };
  
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      education: newEducation
    }));
  };
  
  const addEducationField = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', field: '', year: '' }]
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
      const userResponse = await axios.post('http://localhost:5000/api/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      
      const { user, token } = userResponse.data;
      
      if (user && token) {
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('token', token);
        
        if (isExpertSignup) {
          const expertData = {
            title: formData.title,
            specialties: formData.specialties,
            hourlyRate: parseFloat(formData.hourlyRate),
            experience: formData.experience,
            bio: formData.bio,
            education: formData.education.filter(edu => edu.institution && edu.degree)
          };
          
          const expertResponse = await axios.post('http://localhost:5000/api/experts', expertData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (expertResponse.data) {
            localStorage.setItem('expertId', expertResponse.data._id);
            navigate('/expert-dashboard');
          }
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
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 mb-6">Join as a client or an expert</p>
        
        {/* Role Selection */}
        <div className="mb-6">
          <div className="flex rounded-md shadow-sm mb-2">
            <button
              type="button"
              onClick={() => handleRoleChange('user')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 ${
                formData.role === 'user'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              I'm a Client
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('expert')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 ${
                formData.role === 'expert'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-r border-gray-300'
              }`}
            >
              I'm an Expert
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {formData.role === 'expert' 
              ? 'Join as an expert to offer your services and connect with clients.'
              : 'Sign up as a client to find and book expert services.'}
          </p>
        </div>
        
        {isExpertSignup && (
          <div className="mb-4 bg-blue-50 p-4 rounded-md">
            <p className="text-blue-700 text-sm">
              As an expert, you'll need to complete your profile after signing up to start receiving clients.
            </p>
          </div>
        )}
        
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            {formData.role === 'expert' ? 'Full Name (as it will appear on your profile)' : 'Full Name'}
          </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          {isExpertSignup && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                  Professional Title
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required={isExpertSignup}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Areas of Expertise
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  name="specialties"
                  value={formData.specialties.join(', ')}
                  onChange={handleSpecialtiesChange}
                  required={isExpertSignup}
                  placeholder="e.g., Web Development, UI/UX, Mobile Apps"
                />
                <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hourlyRate">
                  Hourly Rate (USD)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="hourlyRate"
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  required={isExpertSignup}
                  min="0"
                  step="1"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experience">
                  Years of Experience
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="experience"
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required={isExpertSignup}
                  min="0"
                  max="50"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                  Professional Bio
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  required={isExpertSignup}
                  placeholder="Tell us about your professional background and expertise..."
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Education
                </label>
                {formData.education.map((edu, index) => (
                  <div key={index} className="mb-4 p-3 border rounded">
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      required={isExpertSignup}
                    />
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        required={isExpertSignup}
                      />
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="number"
                        placeholder="Year"
                        value={edu.year}
                        onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                        min="1900"
                        max="2100"
                      />
                    </div>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Field of Study"
                      value={edu.field}
                      onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                      required={isExpertSignup}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={addEducationField}
                >
                  + Add Another Education
                </button>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              id="email"
              type="email"
              name="email"
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