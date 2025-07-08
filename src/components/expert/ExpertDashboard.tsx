import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiBook, FiCreditCard, FiMenu, FiX, FiSearch, FiUser, FiHelpCircle, FiLogOut, FiCalendar } from 'react-icons/fi';

interface NavigationItem {
  name: string;
  path: string;
  content: string;
  icon: React.ReactNode;
}

const ExpertDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('');
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

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const navigation: NavigationItem[] = [
    { 
      name: 'Home', 
      path: '/expert-dashboard', 
      content: 'home', 
      icon: <FiHome className="mr-3" /> 
    },
    { 
      name: 'Bookings', 
      path: '/expert-dashboard/bookings', 
      content: 'bookings', 
      icon: <FiBook className="mr-3" /> 
    },
    { 
      name: 'Availability', 
      path: '/expert-dashboard/availability', 
      content: 'availability', 
      icon: <FiCalendar className="mr-3" /> 
    },
    { 
      name: 'Profile', 
      path: '/expert-dashboard/profile', 
      content: 'profile', 
      icon: <FiUser className="mr-3" /> 
    },
    { 
      name: 'Payments', 
      path: '/expert-dashboard/earnings', 
      content: 'payments', 
      icon: <FiCreditCard className="mr-3" /> 
    },
    { 
      name: 'Help', 
      path: '/expert-dashboard/help', 
      content: 'help', 
      icon: <FiHelpCircle className="mr-3" /> 
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-30 bg-white p-2 rounded shadow" 
        onClick={() => setSidebarOpen(true)}
      >
        <FiMenu size={24} />
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-[#F6F1E7] border-r border-[#E5E1DC] flex flex-col p-6 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <button 
          className="md:hidden absolute top-4 right-4" 
          onClick={() => setSidebarOpen(false)}
        >
          <FiX size={24} />
        </button>
        
        {userName && (
          <div className="w-full flex items-center justify-center bg-[#FFC582] rounded-lg px-3 py-2 text-sm font-semibold mb-4 text-[#8C3F00] shadow-sm">
            Hi, {userName}
          </div>
        )}
        
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#ff9d5c] flex items-center justify-center mr-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#ff9d5c" />
              <polygon points="10,8 24,16 10,24" fill="#232323" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Qnnect</h2>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <button 
                  onClick={() => {
                    handleNavigation(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center px-3 py-2 rounded w-full text-left ${
                    location.pathname === item.path 
                      ? 'bg-[#EFE7DB] text-black font-semibold' 
                      : 'text-gray-700 hover:bg-[#EFE7DB]'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              </li>
            ))}
            <li>
              <button 
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded text-gray-700 hover:bg-[#EFE7DB] w-full text-left"
              >
                <FiLogOut className="mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#F8F5EE]">
        {/* Header with Search */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-[#E5E1DC] bg-white">
          <h1 className="text-2xl font-bold text-gray-800">
            {navigation.find(item => location.pathname.startsWith(item.path))?.name || 'Dashboard'}
          </h1>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 p-4 md:p-10 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ExpertDashboard;
