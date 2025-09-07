import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, Play, ArrowRight } from 'lucide-react';
import { coursesAPI, handleApiError } from '../../services/api';
import LoadingSpinner from '../LoadingSpinner';

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
  createdAt: string;
  updatedAt: string;
}

const CoursesPreview: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular courses and start your learning journey today.
            </p>
          </div>
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner size="lg" text="Loading courses..." />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular courses and start your learning journey today.
            </p>
          </div>
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Popular Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular courses and start your learning journey today.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <p className="text-gray-600 text-lg mb-4">No courses available at the moment.</p>
              <p className="text-gray-500">Check back later for new courses!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {courses.slice(0, 4).map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={course.imageLink || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"}
                      alt={course.title || 'Course image'}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Course
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <span className="text-sm text-gray-500">All Levels</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {course.title || 'Untitled Course'}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      by {course.assignedTeachers?.[0]?.userId?.name || 'Expert Instructor'}
                    </p>

                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900 ml-1">
                          4.5
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        (New Course)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Self-paced
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Enroll Now
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-green-600">
                          ₹{(course.price || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                View All Courses
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CoursesPreview;
