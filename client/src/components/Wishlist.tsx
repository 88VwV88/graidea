import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Star, Clock, Users, Trash2 } from 'lucide-react';
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
  createdAt: string;
  updatedAt: string;
}

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlistCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await coursesAPI.getAllCourses();
        if (response.success) {
          // For now, we'll show all courses as wishlist items
          // In a real implementation, you'd have a separate wishlist API
          setWishlistItems(response.data || []);
        } else {
          setError('Failed to fetch wishlist courses');
        }
      } catch (err) {
        const errorMessage = handleApiError(err, setError);
        console.error('Error fetching wishlist courses:', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistCourses();
  }, []);

  const handleRemoveFromWishlist = (courseId: string) => {
    // TODO: Implement remove from wishlist functionality
    console.log('Remove from wishlist:', courseId);
    // For now, just remove from local state
    setWishlistItems(prev => prev.filter(item => item._id !== courseId));
  };

  const handleAddToCart = (courseId: string) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', courseId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner size="lg" text="Loading wishlist..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentNavbar />
        <div className="container mx-auto px-4 py-8">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Courses you've saved for later</p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((course) => (
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
                  <button
                    onClick={() => handleRemoveFromWishlist(course._id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors duration-200"
                  >
                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                  </button>
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

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        ₹{(course.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(course._id)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(course._id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Start adding courses you're interested in</p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
