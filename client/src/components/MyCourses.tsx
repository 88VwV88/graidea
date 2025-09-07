import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, CheckCircle, ShoppingCart, IndianRupee } from 'lucide-react';
import StudentNavbar from './StudentNavbar';
import { coursesAPI, handleApiError } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

interface Course {
  _id: string;
  title: string;
  description: string;
  imageLink?: string;
  price: number;
  assignedTeachers?: Array<{
    userId?: {
      name: string;
    };
  }>;
}

const MyCourses: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await coursesAPI.getAllCourses();
      if (response.success) {
        setCourses(response.data || []);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      const errorMessage = handleApiError(err, setError);
      console.error('Error fetching courses:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleBuyCourse = (courseTitle: string, price: number) => {
    // TODO: Implement buy course functionality
    alert(`Buy course: ${courseTitle} for ${price}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavbar />
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading courses</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={fetchCourses}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Courses</h1>
          <p className="text-gray-600">Discover and enroll in courses to start your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div 
              key={course._id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => handleCourseClick(course._id)}
            >
              <div className="relative">
                <img
                  src={course.imageLink || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Rs {course.price}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {course.description}
                </p>
                
                {/* Teachers */}
                {course.assignedTeachers && course.assignedTeachers.length > 0 && (
                  <p className="text-sm text-gray-600 mb-4">
                    by {course.assignedTeachers.map((teacher) => teacher.userId?.name || 'Unknown').join(', ')}
                  </p>
                )}

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-1" />
                    {course.price}
                  </div>
                </div>

                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => handleBuyCourse(course.title, course.price)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </button>
                  <button 
                    onClick={() => handleCourseClick(course._id)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-600 mb-6">Check back later for new courses</p>
            <button 
              onClick={fetchCourses}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
