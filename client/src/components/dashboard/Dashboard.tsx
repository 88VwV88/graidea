import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  UserPlus, 
  Plus,
  BarChart3
} from 'lucide-react';

// Use Apple system font for a native look
const appleFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for dashboard
  const stats = [
    {
      title: 'Total Students',
      value: '12,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Teachers',
      value: '156',
      change: '+8.2%',
      changeType: 'positive',
      icon: UserPlus,
      color: 'green'
    },
    {
      title: 'Total Courses',
      value: '234',
      change: '+15.3%',
      changeType: 'positive',
      icon: BookOpen,
      color: 'purple'
    },
    {
      title: 'Monthly Revenue',
      value: '₹33,750',
      change: '+23.1%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'orange'
    }
  ];

  // Helper for icon background color
  const getBgColor = (color) => (
    color === 'blue' ? 'bg-blue-100' :
    color === 'green' ? 'bg-green-100' :
    color === 'purple' ? 'bg-purple-100' :
    'bg-orange-100'
  );

  // Helper for icon color
  const getIconColor = (color) => (
    color === 'blue' ? 'text-blue-600' :
    color === 'green' ? 'text-green-600' :
    color === 'purple' ? 'text-purple-600' :
    'text-orange-600'
  );

  // Main UI
  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 pb-12 text-nowrap "
      style={{ fontFamily: appleFont }}
    >
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight" style={{ fontFamily: appleFont }}>
          Dashboard
        </h1>
        <p className="text-lg text-gray-500" style={{ fontFamily: appleFont }}>
          Welcome back{user?.name ? `, ${user.name}` : ""}! Here’s the latest on your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="rounded-3xl shadow-lg bg-white/70 backdrop-blur-md hover:shadow-2xl transition-shadow duration-200 flex flex-col justify-between p-7 border border-gray-100"
            style={{ minHeight: 160, fontFamily: appleFont }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-sm mt-2 font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} <span className="text-gray-400 font-normal">from last month</span>
                </p>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${getBgColor(stat.color)}`}>
                <stat.icon className={`w-7 h-7 ${getIconColor(stat.color)}`} strokeWidth={1.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100 p-8 mt-2">
        <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: appleFont }}>
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button 
            className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all shadow border border-blue-100 focus:outline-none"
            style={{ fontFamily: appleFont, minHeight: 92 }}
          >
            <UserPlus className="w-7 h-7 text-blue-600" strokeWidth={1.5} />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Add Teacher</div>
              <div className="text-sm text-gray-500">Invite a new teacher</div>
            </div>
          </button>
          <button 
            className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all shadow border border-green-100 focus:outline-none"
            style={{ fontFamily: appleFont, minHeight: 92 }}
          >
            <Plus className="w-7 h-7 text-green-700" strokeWidth={1.5} />
            <div className="text-left">
              <div className="font-semibold text-gray-900">Create Course</div>
              <div className="text-sm text-gray-500">Start a new course</div>
            </div>
          </button>
          <button 
            className="flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all shadow border border-purple-100 focus:outline-none"
            style={{ fontFamily: appleFont, minHeight: 92 }}
          >
            <BarChart3 className="w-7 h-7 text-purple-600" strokeWidth={1.5} />
            <div className="text-left">
              <div className="font-semibold text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-500">Check platform stats</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
