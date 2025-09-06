
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner'; 
import Layout from './components/dashboard/Layout';
import Dashboard from './components/dashboard/Dashboard';
import AddTeacher from './components/dashboard/AddTeacher';
import TeachersList from './components/dashboard/TeachersList';
import AddCourse from './components/dashboard/AddCourse';
import CoursesList from './components/dashboard/CoursesList';
import CourseMetaManager from './components/dashboard/CourseMetaManager';
import CourseDetail from './components/dashboard/CourseDetail';
const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

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
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
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
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
