import { Link, useLocation } from 'react-router-dom';

const UserTypeSelector = () => {
  const location = useLocation();
  const isSignIn = location.pathname === '/login';
  const actionText = isSignIn ? 'Sign In' : 'Sign Up';
  const actionLower = actionText.toLowerCase().replace(' ', '-');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {actionText} As
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <Link
              to={`/${actionLower}?type=client`}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
            >
              {actionText} as a Client
            </Link>
            <div className="relative flex justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  OR
                </span>
              </div>
            </div>
            <Link
              to={`/${actionLower}?type=expert`}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4"
            >
              {actionText} as an Expert
            </Link>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {isSignIn ? "Don't have an account? " : 'Already have an account? '}
              <Link 
                to={isSignIn ? '/signup' : '/login'} 
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                {isSignIn ? 'Sign up' : 'Sign in'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelector;
