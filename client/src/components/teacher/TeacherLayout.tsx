import React from 'react';
import TeacherNavbar from './TeacherNavbar';

interface TeacherLayoutProps {
  children: React.ReactNode;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default TeacherLayout;
