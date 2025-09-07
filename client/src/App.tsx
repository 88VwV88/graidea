
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AriaProvider } from './contexts/AriaContext';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner'; 
import Dashboard from './components/dashboard/Dashboard';
import LandingPage from './components/landing/LandingPage';
import MyCourses from './components/MyCourses';
import CourseDetailPage from './components/CourseDetailPage';
import Wishlist from './components/Wishlist';
import Layout from './components/dashboard/Layout';
import AddTeacher from './components/dashboard/AddTeacher';
import TeachersList from './components/dashboard/TeachersList';
import AddCourse from './components/dashboard/AddCourse';
import CoursesList from './components/dashboard/CoursesList';
import CourseMetaManager from './components/dashboard/CourseMetaManager';
import CourseDetail from './components/dashboard/CourseDetail';
const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  const getDashboardRoute = () => {
    if (user?.roles?.includes('admin')) {
      return '/dashboard';
    } else if (user?.roles?.includes('teacher')) {
      return '/dashboard';
    } else {
      return '/my-courses';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading application..." />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to={getDashboardRoute()} replace /> : <Signup />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />  
      <Route
        path="/my-courses"
        element={
          <ProtectedRoute>
            <MyCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/course/:courseId"
        element={
          <ProtectedRoute>
            <CourseDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/teachers/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AddTeacher />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/teachers/list"
        element={
          <ProtectedRoute>
            <Layout>
              <TeachersList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/courses/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AddCourse />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/courses/list"
        element={
          <ProtectedRoute>
            <Layout>
              <CoursesList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/courses/meta"
        element={
          <ProtectedRoute>
            <Layout>
              <CourseMetaManager />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/courses/:courseId"
        element={
          <ProtectedRoute>
            <Layout>
              <CourseDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={<LandingPage />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AriaProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AriaProvider>
    </AuthProvider>
  );
}

export default App;
