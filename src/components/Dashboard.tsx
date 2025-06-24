import React, { useState, useEffect } from 'react';
import { FiHome, FiPhone, FiSearch, FiUser, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState({
    name: localStorage.getItem('userName') || '',
    email: localStorage.getItem('userEmail') || '',
    role: localStorage.getItem('userRole') || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userName = profile.name || 'User';

  // Fetch user details from backend when profile is shown
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          name: res.data.user.name || '',
          email: res.data.user.email || '',
          role: res.data.user.role || '',
        });
      } catch (err: any) {
        setError('Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };
    if (showProfile) fetchProfile();
    // eslint-disable-next-line
  }, [showProfile]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleHome = () => {
    setShowProfile(false);
    navigate('/dashboard');
  };

  const handleProfile = () => {
    setShowProfile(true);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleModify = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/users', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile({
        name: res.data.user.name || '',
        email: res.data.user.email || '',
        role: res.data.user.role || '',
      });
      localStorage.setItem('userName', res.data.user.name);
      localStorage.setItem('userEmail', res.data.user.email);
      localStorage.setItem('userRole', res.data.user.role);
      setEditMode(false);
    } catch (err: any) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#e6d6a7]">
      {/* Sidebar */}
      <aside className="w-80 bg-[#f8d6a2] border-r border-gray-300 flex flex-col p-0">
        {/* Greeting */}
        <div className="flex flex-col items-center py-6 border-b border-gray-300">
          <button className="w-72 text-3xl font-bold bg-[#ffa77b] rounded-2xl py-2 mb-4 border-4 border-black text-black">Hi, {userName}</button>
          {/* Qnnect Logo */}
          <div className="flex items-center mb-4">
            <span className="inline-block w-12 h-12 rounded-full bg-[#ff9d5c] flex items-center justify-center mr-2">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#ff9d5c" />
                <polygon points="10,8 24,16 10,24" fill="#232323" />
              </svg>
            </span>
            <span className="text-3xl font-extrabold text-black">Qnnect</span>
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 mt-6">
          <ul className="space-y-6 pl-6">
            <li>
              <button onClick={handleHome} className="flex items-center text-2xl font-bold text-black hover:text-[#ff9d5c] w-full text-left">
                <FiHome className="mr-4" /> Home
              </button>
            </li>
            <li>
              <a href="#" className="flex items-center text-2xl font-bold text-black hover:text-[#ff9d5c]">
                <FiPhone className="mr-4" /> Bookings
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-2xl font-bold text-black hover:text-[#ff9d5c]">
                <FiSearch className="mr-4" /> Find Experts
              </a>
            </li>
            <li>
              <button onClick={handleProfile} className="flex items-center text-2xl font-bold text-black hover:text-[#ff9d5c] w-full text-left">
                <FiUser className="mr-4" /> My Profile
              </button>
            </li>
            <li>
              <a href="#" className="flex items-center text-2xl font-bold text-black hover:text-[#ff9d5c]">
                <FiHelpCircle className="mr-4" /> Help
              </a>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center text-2xl font-bold text-black hover:text-[#ff9d5c] w-full text-left">
                <FiLogOut className="mr-4" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-12 py-6 border-b border-gray-300 bg-[#e6d6a7]">
          <h1 className="text-6xl font-extrabold text-black">{showProfile ? 'My Profile' : 'Home'}</h1>
          <div className="flex items-center bg-transparent border-4 border-black rounded-full px-6 py-2 w-[400px]">
            <FiSearch className="text-3xl mr-2 text-black" />
            <input
              type="text"
              placeholder=""
              className="flex-1 bg-transparent outline-none text-2xl text-black placeholder-gray-400"
              style={{ minWidth: 0 }}
            />
          </div>
        </div>
        {/* Main content area */}
        <div className="flex-1 p-12">
          {showProfile ? (
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">User Profile</h2>
              {error && <div className="text-red-500 text-center mb-4">{error}</div>}
              {loading ? (
                <div className="text-center text-lg">Loading...</div>
              ) : (
              <form className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-1">Role</label>
                  <select
                    name="role"
                    value={profile.role}
                    onChange={handleProfileChange}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-200"
                  >
                    <option value="client">Client</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="flex justify-end gap-4">
                  {!editMode ? (
                    <button type="button" onClick={handleModify} className="px-6 py-2 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600">Modify</button>
                  ) : (
                    <button type="button" onClick={handleSave} className="px-6 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600">Save</button>
                  )}
                </div>
              </form>
              )}
            </div>
          ) : (
            <div className="flex-1"></div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 