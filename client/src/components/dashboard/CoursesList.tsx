import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner';
import { BookOpen, Users, IndianRupee, Calendar, Image as ImageIcon, AlertCircle, ArrowRight } from 'lucide-react';

interface Teacher {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileImageUrl?: string;
  };
  yearOfExperience: number;
  degreeName: string;
  skills: string[];
  salary: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  imageLink?: string;
  price: number;
  assignedTeachers: Teacher[];
  createdAt: string;
  updatedAt: string;
}

const CoursesList: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/courses`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        // Debug: Log the response to see the actual data structure
        console.log('Courses API Response:', response.data);
        
        setCourses(response.data.data || []);
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching courses:', err);
        const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                            (err as Error)?.message || 
                            'Failed to fetch courses';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading courses..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <div className="text-red-600 font-medium mb-2">Error Loading Courses</div>
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <div className="text-gray-600 font-medium mb-2">No Courses Found</div>
        <div className="text-gray-500">There are no courses available yet.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-gray-600 mt-1">View and manage all available courses</p>
        </div>
      </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div 
              key={course._id} 
              className="bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-200 cursor-pointer group"
              onClick={() => navigate(`/dashboard/courses/${course._id}`)}
            >
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                {course.imageLink ? (
                  <img
                    src={course.imageLink}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No Image</p>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">{course.title || 'Untitled Course'}</h2>
                  <div className="flex items-center text-lg font-bold text-green-600 ml-2">
                    <IndianRupee className="h-5 w-5" />
                    {(course.price || 0).toLocaleString()}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description || 'No description available'}</p>

                {/* Assigned Teachers */}
                {course.assignedTeachers && course.assignedTeachers.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Assigned Teachers ({course.assignedTeachers.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {course.assignedTeachers.slice(0, 3).map((teacher) => (
                        <div
                          key={teacher._id}
                          className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs"
                        >
                          {teacher.userId.profileImageUrl ? (
                            <img
                              src={teacher.userId.profileImageUrl}
                              alt={teacher.userId.name}
                              className="w-4 h-4 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center">
                              <Users className="h-2 w-2 text-blue-600" />
                            </div>
                          )}
                          <span className="font-medium">{teacher.userId.name}</span>
                        </div>
                      ))}
                      {course.assignedTeachers.length > 3 && (
                        <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs">
                          +{course.assignedTeachers.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Course Skills */}
                {course.assignedTeachers && course.assignedTeachers.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">Skills Covered</div>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(
                        new Set(
                          course.assignedTeachers.flatMap(teacher => teacher.skills)
                        )
                      ).slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {Array.from(
                        new Set(
                          course.assignedTeachers.flatMap(teacher => teacher.skills)
                        )
                      ).length > 4 && (
                        <span className="text-xs text-gray-400">
                          +{Array.from(
                            new Set(
                              course.assignedTeachers.flatMap(teacher => teacher.skills)
                            )
                          ).length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Course Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'Unknown date'}
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Course
                    <ArrowRight className="h-3 w-3 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default CoursesList;
