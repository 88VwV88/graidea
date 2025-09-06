import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, Search } from "lucide-react";

const Header: React.FC = () => {
  const { user } = useAuth();
  console.log("User in header:", user);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Courses"
              className="w-80 bg-[#F7F4FC] border-gray-300 rounded-md pl-10 pr-4 py-2"
            />
          </div>

          <div className="flex items-center space-x-5">
            <Bell className="h-5 w-5 text-gray-500 cursor-pointer" />

            <div className=" flex items-center space-x-5 mr-6">
              <img
                src={user?.profileImageUrl}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />

              <div className="flex flex-col">
                <span className="text-sm text-gray-700 font-bold">
                  {user?.name}
                </span>
                <span className="text-sm text-gray-700">{user?.roles[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
