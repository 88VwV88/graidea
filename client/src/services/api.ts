import axios from 'axios';
import type { AuthResponse, LoginCredentials, SignupCredentials, TeachersResponse } from '../types/auth-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 errors for authentication endpoints, not for all API calls
    if (error.response?.status === 401 && 
        (error.config?.url?.includes('/users/login') || 
         error.config?.url?.includes('/users/signup'))) {
      // Only clear auth data for auth-related endpoints
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    // For other 401 errors, just pass the error to be handled by the calling component
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/users/login', credentials);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    try {
      const formData = new FormData();
      formData.append('name', credentials.name);
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);
      
      if (credentials.phone) {
        formData.append('phone', credentials.phone);
      }
      
      if (credentials.roles) {
        formData.append('roles', JSON.stringify(credentials.roles));
      }
      
      if (credentials.profileImage) {
        formData.append('profileImage', credentials.profileImage);
      }

      const response = await api.post('/users/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Signup failed. Please try again.');
      }
    }
  },
};

export const teachersAPI = {
  getAllTeachers: async (): Promise<TeachersResponse> => {
    try {
      const response = await api.get('/teachers');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch teachers. Please try again.');
      }
    }
  },
};

export const coursesAPI = {
  // Get all courses
  getAllCourses: async () => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch courses. Please try again.');
      }
    }
  },

  // Get course by ID
  getCourseById: async (courseId: string) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch course details. Please try again.');
      }
    }
  },
};

export const courseMetaAPI = {
  // Create course meta
  createCourseMeta: async (courseMetaData: any) => {
    try {
      const response = await api.post('/course-meta', courseMetaData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to create course meta. Please try again.');
      }
    }
  },

  // Get all course metas
  getAllCourseMetas: async () => {
    try {
      const response = await api.get('/course-meta');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch course metas. Please try again.');
      }
    }
  },

  // Get course meta by ID
  getCourseMetaById: async (id: string) => {
    try {
      const response = await api.get(`/course-meta/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch course meta. Please try again.');
      }
    }
  },

  // Get course meta by course ID
  getCourseMetaByCourseId: async (courseId: string) => {
    try {
      const response = await api.get(`/course-meta/course/${courseId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch course meta. Please try again.');
      }
    }
  },

  // Get course details by ID
  getCourseById: async (courseId: string) => {
    try {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to fetch course details. Please try again.');
      }
    }
  },

  // Update course meta
  updateCourseMeta: async (id: string, updateData: any) => {
    try {
      const response = await api.put(`/course-meta/${id}`, updateData);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to update course meta. Please try again.');
      }
    }
  },

  // Add week to course meta
  addWeek: async (id: string, weekData: any) => {
    try {
      const response = await api.post(`/course-meta/${id}/weeks`, { weekData });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to add week. Please try again.');
      }
    }
  },

  // Update week
  updateWeek: async (id: string, weekId: string, weekData: any) => {
    try {
      const response = await api.put(`/course-meta/${id}/weeks/${weekId}`, { weekData });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to update week. Please try again.');
      }
    }
  },

  // Delete week
  deleteWeek: async (id: string, weekId: string) => {
    try {
      const response = await api.delete(`/course-meta/${id}/weeks/${weekId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to delete week. Please try again.');
      }
    }
  },

  // Mark subtopic as completed
  markSubtopicCompleted: async (id: string, weekId: string, subtopicId: string, isCompleted: boolean) => {
    try {
      const response = await api.patch(`/course-meta/${id}/weeks/${weekId}/subtopics/${subtopicId}/complete`, { isCompleted });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to update subtopic status. Please try again.');
      }
    }
  },

  // Submit assignment
  submitAssignment: async (id: string, weekId: string, assignmentId: string, isSubmitted: boolean) => {
    try {
      const response = await api.patch(`/course-meta/${id}/weeks/${weekId}/assignments/${assignmentId}/submit`, { 
        isSubmitted,
        submittedAt: isSubmitted ? new Date().toISOString() : undefined
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to submit assignment. Please try again.');
      }
    }
  },

  // Publish course meta
  publishCourseMeta: async (id: string) => {
    try {
      const response = await api.patch(`/course-meta/${id}/publish`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to publish course meta. Please try again.');
      }
    }
  },

  // Delete course meta
  deleteCourseMeta: async (id: string) => {
    try {
      const response = await api.delete(`/course-meta/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to delete course meta. Please try again.');
      }
    }
  },
};


// Helper function to handle API errors gracefully
export const handleApiError = (error: any, setError?: (error: string) => void) => {
  if (error.response?.status === 401) {
    // For 401 errors, show a specific message instead of auto-logout
    const message = 'You are not authorized to perform this action. Please check your permissions.';
    if (setError) {
      setError(message);
    }
    return message;
  } else if (error.response?.data?.message) {
    const message = error.response.data.message;
    if (setError) {
      setError(message);
    }
    return message;
  } else if (error.message) {
    if (setError) {
      setError(error.message);
    }
    return error.message;
  } else {
    const message = 'An unexpected error occurred. Please try again.';
    if (setError) {
      setError(message);
    }
    return message;
  }
};

export default api;
