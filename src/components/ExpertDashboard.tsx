import React, { useState, useEffect } from 'react';
import { FiHome, FiBook, FiCreditCard, FiMenu, FiX, FiSearch, FiUser, FiHelpCircle, FiLogOut, FiCalendar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import AvailabilityAndPrice from './AvailabilityAndPrice';

const ExpertDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [activeContent, setActiveContent] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleAvailabilityPrice = () => {
    console.log('Setting active content to availabilityAndPrice');
    setActiveContent('availabilityAndPrice');
  };

  const handleBookings = () => {
    navigate('/expert/bookings');
  };

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      {/* Mobile Sidebar Toggle */}
      <button className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded shadow" onClick={() => setSidebarOpen(true)}>
        <FiMenu size={24} />
      </button>
      {/* Sidebar */}
      <aside className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-[#F6F1E7] border-r border-[#E5E1DC] flex flex-col p-6 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <button className="md:hidden absolute top-4 right-4" onClick={() => setSidebarOpen(false)}><FiX size={24} /></button>
        <button className="w-full flex items-center justify-center bg-[#FFC582] rounded-lg px-3 py-2 text-sm font-semibold mb-4 text-[#8C3F00] shadow-sm">
          Hi, {userName || 'User'}
        </button>
        <div className="flex items-center mb-8">
          <span className="inline-block w-12 h-12 rounded-full bg-[#ff9d5c] flex items-center justify-center mr-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#ff9d5c" />
              <polygon points="10,8 24,16 10,24" fill="#232323" />
            </svg>
          </span>
          <span className="text-xl font-bold text-black">Qnnect</span>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button onClick={() => setActiveContent('home')} className="flex items-center px-3 py-2 rounded bg-[#EFE7DB] text-black font-semibold">
                <FiHome className="mr-3" /> Home
              </button>
            </li>
            <li>
              <button onClick={() => setActiveContent('bookings')} className="flex items-center px-3 py-2 rounded text-gray-700 hover:bg-[#EFE7DB] w-full text-left">
                <FiBook className="mr-3" /> Bookings
              </button>
            </li>
            <li>
              <button onClick={handleAvailabilityPrice} className="flex items-center px-3 py-2 rounded text-gray-700 hover:bg-[#EFE7DB] w-full text-left">
                <FiCalendar className="mr-3" /> Availability & Price
              </button>
            </li>
            <li>
              <button onClick={() => setActiveContent('myProfile')} className="flex items-center px-3 py-2 rounded text-gray-700 hover:bg-[#EFE7DB] w-full text-left">
                <FiUser className="mr-3" /> My Profile
              </button>
            </li>
            <li>
              <button onClick={() => setActiveContent('payments')} className="flex items-center px-3 py-2 rounded text-gray-700 hover:bg-[#EFE7DB] w-full text-left">
                <FiCreditCard className="mr-3" /> Payments
              </button>
            </li>
            <li>
              <button onClick={() => setActiveContent('help')} className="flex items-center px-3 py-2 rounded text-gray-700 hover:bg-[#EFE7DB] w-full text-left">
                <FiHelpCircle className="mr-3" /> Help
              </button>
            </li>
            <li>
              <button onClick={handleLogout} className="flex items-center px-3 py-2 rounded text-gray-700 hover:bg-[#EFE7DB] w-full text-left">
                <FiLogOut className="mr-3" /> Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>}
      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#F8F5EE]"> {/* Adjusted background color for main content */}
        {/* Header with Home and Search */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-[#E5E1DC] bg-white">
          <h1 className="text-2xl font-bold text-gray-800">Home</h1>
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-300">
            <FiSearch className="text-gray-500 mr-2" />
            <input type="text" placeholder="Search" className="bg-transparent outline-none text-gray-700" />
          </div>
        </div>
        {/* Content Area - Placeholder for actual dashboard content */}
        <div className="flex-1 p-4 md:p-10">
          {activeContent === 'home' && (
            <div className="text-center text-xl text-gray-600">Welcome to your Expert Dashboard!</div>
          )}
          {activeContent === 'availabilityAndPrice' && <AvailabilityAndPrice />}
          {activeContent === 'bookings' && (
            <div className="text-center text-xl text-gray-600">Bookings content goes here.</div>
          )}
          {activeContent === 'myProfile' && (
            <div className="text-center text-xl text-gray-600">My Profile content goes here.</div>
          )}
          {activeContent === 'payments' && (
            <div className="text-center text-xl text-gray-600">Payments content goes here.</div>
          )}
          {activeContent === 'help' && (
            <div className="text-center text-xl text-gray-600">Help content goes here.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ExpertDashboard; 