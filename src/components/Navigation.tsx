
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, BarChart3, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavigationProps {
  isLoggedIn: boolean;
  user?: {
    name: string;
    username: string;
    followers: number;
    profileImage: string;
  };
  onLogin: () => void;
  onLogout: () => void;
}

const Navigation = ({ isLoggedIn, user, onLogin, onLogout }: NavigationProps) => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-12">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                XTesting
              </h1>
            </div>
            
            {isLoggedIn && (
              <div className="flex space-x-1">
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
                    location.pathname === '/' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Prediction</span>
                </Link>
                <Link
                  to="/history"
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
                    location.pathname === '/history' 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span>History</span>
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <Button 
                onClick={onLogin} 
                className="bg-black hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded-full"
              >
                <User className="w-4 h-4 mr-2" />
                Login with X
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.followers?.toLocaleString()} followers</p>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onLogout}
                  className="text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400 rounded-full"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
