import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Clock, 
  Play, 
  CheckCircle, 
  ShoppingCart, 
  IndianRupee, 
  Users, 
  Calendar,
  ArrowLeft,
  FileText,
  Award,
  Target
} from 'lucide-react';
import StudentNavbar from './StudentNavbar';
import { coursesAPI, courseMetaAPI, handleApiError } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

interface Course {
  _id: string;
  title: string;
  description: string;
  imageLink: string;
  price: number;
  assignedTeachers: Array<{
    userId?: {
      name: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

interface SubTopic {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  link?: string;
  duration?: number;
  isCompleted?: boolean;
  order: number;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  assignmentUrl?: string;
  dueDate?: string;
  maxMarks?: number;
  isSubmitted?: boolean;
  submittedAt?: string;
  marksObtained?: number;
  feedback?: string;
  order: number;
}

interface Week {
  _id: string;
  weekNumber: number;
  title: string;
  description?: string;
  subTopics: SubTopic[];
  assignments: Assignment[];
  isCompleted?: boolean;
  completedAt?: string;
}

interface CourseMeta {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  totalWeeks: number;
  totalDuration?: number;
  weeks: Week[];
  isPublished: boolean;
  publishedAt?: string;
  createdBy: string;
  completionPercentage?: number;
  totalAssignments?: number;
  submittedAssignments?: number;
}

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [courseMeta, setCourseMeta] = useState<CourseMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch course details and course meta in parallel
      const [courseResponse, courseMetaResponse] = await Promise.all([
        coursesAPI.getCourseById(courseId!),
        courseMetaAPI.getCourseMetaByCourseId(courseId!)
      ]);

      if (courseResponse.success) {
        setCourse(courseResponse.data);
      } else {
        setError('Failed to fetch course details');
        return;
      }

      if (courseMetaResponse.success) {
        setCourseMeta(courseMetaResponse.data);
      } else {
        // Course meta might not exist yet, that's okay
        console.log('No course meta found for this course');
      }
    } catch (err) {
      const errorMessage = handleApiError(err, setError);
      console.error('Error fetching course details:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCourse = (courseId: string, courseTitle: string, price: number) => {
    // TODO: Implement buy course functionality
    alert(`Buy course: ${courseTitle} for ${price}`);
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h3>
            <p className="text-gray-600 mb-6">{error || 'The course you are looking for does not exist.'}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => navigate('/my-courses')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Back to Courses
              </button>
              <button 
                onClick={fetchCourseDetails}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/my-courses')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Courses
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img
              src={course.imageLink || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop"}
              alt={course.title}
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute top-4 right-4">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <div className="bg-green-500 text-white px-4 py-2 rounded-full text-lg font-medium">
                {course.price}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{course.description}</p>
                
                {/* Teachers */}
                {course.assignedTeachers && course.assignedTeachers.length > 0 && (
                  <div className="flex items-center mb-4">
                    <Users className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-600">
                      Instructors: {course.assignedTeachers.map((teacher: any) => teacher.userId?.name || 'Unknown').join(', ')}
                    </span>
                  </div>
                )}

                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <IndianRupee className="w-4 h-4 mr-2" />
                    <span>{course.price}</span>
                  </div>
                  {courseMeta && (
                    <>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{courseMeta.totalWeeks} weeks</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{formatDuration(courseMeta.totalDuration)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="lg:ml-8 lg:flex-shrink-0">
                <button 
                  onClick={() => handleBuyCourse(course._id, course.title, course.price)}
                  className="w-full lg:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-8 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center mb-4"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </button>
                <button className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  Preview Course
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Meta Information */}
        {courseMeta ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Progress */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
                
                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Target className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="text-2xl font-bold text-blue-600">{courseMeta.completionPercentage || 0}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Assignments</p>
                        <p className="text-2xl font-bold text-green-600">
                          {courseMeta.submittedAssignments || 0}/{courseMeta.totalAssignments || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Award className="w-8 h-8 text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Weeks</p>
                        <p className="text-2xl font-bold text-purple-600">{courseMeta.totalWeeks}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weeks */}
                <div className="space-y-4">
                  {courseMeta.weeks.map((week) => (
                    <div key={week._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Week {week.weekNumber}: {week.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {week.subTopics.reduce((total, subtopic) => total + (subtopic.duration || 0), 0)} min
                          </span>
                        </div>
                      </div>
                      
                      {week.description && (
                        <p className="text-gray-600 mb-3">{week.description}</p>
                      )}

                      {/* Sub Topics */}
                      <div className="space-y-2 mb-4">
                        {week.subTopics.map((subtopic) => (
                          <div key={subtopic._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center">
                              <Play className="w-4 h-4 text-blue-600 mr-2" />
                              <span className="text-sm text-gray-900">{subtopic.title}</span>
                              {subtopic.duration && (
                                <span className="text-xs text-gray-500 ml-2">({subtopic.duration}m)</span>
                              )}
                            </div>
                            <CheckCircle 
                              className={`w-4 h-4 ${subtopic.isCompleted ? 'text-green-500' : 'text-gray-300'}`} 
                            />
                          </div>
                        ))}
                      </div>

                      {/* Assignments */}
                      {week.assignments.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Assignments:</h4>
                          {week.assignments.map((assignment) => (
                            <div key={assignment._id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 text-yellow-600 mr-2" />
                                <span className="text-sm text-gray-900">{assignment.title}</span>
                                {assignment.maxMarks && (
                                  <span className="text-xs text-gray-500 ml-2">({assignment.maxMarks} marks)</span>
                                )}
                              </div>
                              <div className="flex items-center">
                                {assignment.isSubmitted ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                ) : (
                                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                                )}
                                <span className="text-xs text-gray-500">
                                  {assignment.isSubmitted ? 'Submitted' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Course Info Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{formatDuration(courseMeta.totalDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weeks:</span>
                    <span className="font-medium">{courseMeta.totalWeeks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">{course.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${courseMeta.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
                      {courseMeta.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  {courseMeta.publishedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Published:</span>
                      <span className="font-medium">{formatDate(courseMeta.publishedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Learn</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Comprehensive course curriculum</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Hands-on assignments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Expert instruction</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Progress tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Details Coming Soon</h3>
            <p className="text-gray-600 mb-6">
              The detailed curriculum and course structure are being prepared. Check back soon for more information.
            </p>
            <button 
              onClick={fetchCourseDetails}
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

export default CourseDetailPage;
