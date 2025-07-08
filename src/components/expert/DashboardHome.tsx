import React, { useState, useEffect } from 'react';
import { FiClock, FiDollarSign, FiStar, FiCalendar, FiUser, FiAlertCircle } from 'react-icons/fi';

interface StatItem {
  name: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}

interface Session {
  id: string;
  clientName: string;
  date: string;
  time: string;
  type: 'Video Call' | 'Voice Call' | 'In-Person';
  status?: 'upcoming' | 'completed' | 'cancelled';
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/expert/dashboard');
        // const data = await response.json();
        
        // Mock data - remove this once API is implemented
        setTimeout(() => {
          setStats([
            { 
              name: 'Upcoming Sessions', 
              value: '0', 
              icon: <FiCalendar className="text-blue-500" /> 
            },
            { 
              name: 'Pending Requests', 
              value: '0',
              icon: <FiClock className="text-yellow-500" />
            },
            { 
              name: 'Total Earnings', 
              value: '$0',
              icon: <FiDollarSign className="text-green-500" />
            },
            { 
              name: 'Rating', 
              value: '0.0',
              icon: <FiStar className="text-amber-400" />
            },
          ]);
          
          setUpcomingSessions([]);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load dashboard data');
        setIsLoading(false);
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userName || 'Expert'}!
        </h1>
        <p className="mt-1 text-gray-600">Here's what's happening with your business today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {stat.icon}
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      {stat.change && (
                        <span className={`ml-2 text-sm font-medium ${
                          stat.changeType === 'positive' ? 'text-green-600' : 
                          stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {stat.change}
                        </span>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Upcoming Sessions
          </h3>
        </div>
        <div className="bg-white overflow-hidden">
          {upcomingSessions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {upcomingSessions.map((session) => (
                <li key={session.id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <FiUser className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {session.clientName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.date} • {session.time}
                        </div>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {session.type}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming sessions</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by setting your availability and promoting your profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
