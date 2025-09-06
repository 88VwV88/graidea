import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import axios from 'axios';
import Notification from '../Notification';
import LoadingSpinner from '../LoadingSpinner';
import { BookOpen, X, CheckCircle, AlertCircle, Users, Camera } from 'lucide-react';

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

interface CourseFormData {
  title: string;
  description: string;
  price: number;
  courseImage: File | undefined;
  assignedTeachers: string[];
}

const AddCourse: React.FC = () => {
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    price: 0,
    courseImage: undefined,
    assignedTeachers: [],
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState<string>('');

  // Fetch teachers on component mount
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoadingTeachers(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/teachers`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setTeachers(response.data.data);
      } catch (error: unknown) {
        console.error('Error fetching teachers:', error);
        setNotification({
          type: 'error',
          message: 'Failed to load teachers. Please refresh the page.',
        });
      } finally {
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = (fieldName: string) => {
    setFocusedField(null);
    validateField(fieldName);
  };

  const validateField = (fieldName: string) => {
    const value = formData[fieldName as keyof CourseFormData];
    let error = '';

    switch (fieldName) {
      case 'title': {
        if (!value || (value as string).trim().length < 2) {
          error = 'Course title must be at least 2 characters';
        } else if ((value as string).length > 200) {
          error = 'Course title must be less than 200 characters';
        }
        break;
      }
      case 'description': {
        if (!value || (value as string).trim().length < 10) {
          error = 'Course description must be at least 10 characters';
        } else if ((value as string).length > 1000) {
          error = 'Course description must be less than 1000 characters';
        }
        break;
      }
      case 'price': {
        if (typeof value === 'number' && value < 0) {
          error = 'Price cannot be negative';
        } else if (typeof value === 'number' && value === 0) {
          error = 'Price must be greater than 0';
        }
        break;
      }
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleTeacherToggle = (teacherId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTeachers: prev.assignedTeachers.includes(teacherId)
        ? prev.assignedTeachers.filter(id => id !== teacherId)
        : [...prev.assignedTeachers, teacherId]
    }));
  };

  const removeTeacher = (teacherId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTeachers: prev.assignedTeachers.filter(id => id !== teacherId)
    }));
  };

  const getSelectedTeachers = () => {
    return teachers.filter(teacher => formData.assignedTeachers.includes(teacher._id));
  };

  const getFilteredTeachers = () => {
    if (!teacherSearchTerm.trim()) {
      return teachers;
    }

    const searchTerm = teacherSearchTerm.toLowerCase().trim();
    return teachers.filter(teacher => {
      const nameMatch = teacher.userId.name.toLowerCase().includes(searchTerm);
      const skillsMatch = teacher.skills.some(skill => 
        skill.toLowerCase().includes(searchTerm)
      );
      const degreeMatch = teacher.degreeName.toLowerCase().includes(searchTerm);
      
      return nameMatch || skillsMatch || degreeMatch;
    });
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setNotification({
          type: 'error',
          message: 'Please select a valid image file',
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setNotification({
          type: 'error',
          message: 'Image size must be less than 5MB',
        });
        return;
      }

      setFormData(prev => ({ ...prev, courseImage: file }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, courseImage: undefined }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);
    setErrors({});

    try {
      // Validate all fields
      const fieldNames = ['title', 'description', 'price'];
      fieldNames.forEach(fieldName => validateField(fieldName));

      // Check if there are any errors
      const hasErrors = fieldNames.some(fieldName => {
        const value = formData[fieldName as keyof CourseFormData];
        let error = '';
        
        switch (fieldName) {
          case 'title': {
            if (!value || (value as string).trim().length < 2) error = 'Course title must be at least 2 characters';
            else if ((value as string).length > 200) error = 'Course title must be less than 200 characters';
            break;
          }
          case 'description': {
            if (!value || (value as string).trim().length < 10) error = 'Course description must be at least 10 characters';
            else if ((value as string).length > 1000) error = 'Course description must be less than 1000 characters';
            break;
          }
          case 'price': {
            if (typeof value === 'number' && value < 0) error = 'Price cannot be negative';
            else if (typeof value === 'number' && value === 0) error = 'Price must be greater than 0';
            break;
          }
        }
        return error;
      });

      if (hasErrors) {
        throw new Error('Please fix the errors below');
      }

      // Create FormData for API call
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());
      
      // Append each teacher ID individually
      formData.assignedTeachers.forEach((teacherId, index) => {
        formDataToSend.append(`assignedTeachers[${index}]`, teacherId);
      });
      
      if (formData.courseImage) {
        formDataToSend.append('courseImage', formData.courseImage);
      }

      // Call the API
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/courses`,
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setNotification({
        type: 'success',
        message: response.data.message,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: 0,
        courseImage: undefined,
        assignedTeachers: [],
      });
      setImagePreview(null);

    } catch (error: unknown) {
      console.error('Error creating course:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 
                          (error as Error)?.message || 
                          'Failed to create course';
      setNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        

        <div className="bg-white/80 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Course Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-slate-900">Course Information</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                    Course Title *
                  </label>
                  <div className="relative">
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('title')}
                      onBlur={() => handleBlur('title')}
                      required
                      placeholder="Enter course title"
                      className={`w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 ${
                        focusedField === 'title' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : errors.title 
                            ? 'border-red-500' 
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {formData.title && !errors.title && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                    {errors.title && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {errors.title && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                    Course Description *
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('description')}
                      onBlur={() => handleBlur('description')}
                      required
                      placeholder="Enter detailed course description"
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 resize-none ${
                        focusedField === 'description' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : errors.description 
                            ? 'border-red-500' 
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {formData.description && !errors.description && (
                      <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                    )}
                    {errors.description && (
                      <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>Minimum 10 characters</span>
                    <span>{formData.description.length}/1000</span>
                  </div>
                  {errors.description && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="price" className="block text-sm font-medium text-slate-700">
                    Course Price *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                      ₹
                    </div>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('price')}
                      onBlur={() => handleBlur('price')}
                      required
                      placeholder="0.00"
                      className={`w-full h-12 pl-8 pr-12 rounded-xl border-2 transition-all duration-200 ${
                        focusedField === 'price' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : errors.price 
                            ? 'border-red-500' 
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {formData.price > 0 && !errors.price && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                    {errors.price && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="courseImage" className="block text-sm font-medium text-slate-700">
                    Course Image (Optional)
                  </label>
                  <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <label
                          htmlFor="courseImage"
                          className="flex items-center px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-all duration-200 group"
                        >
                          <Camera className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                          Choose Image
                        </label>
                        <input
                          id="courseImage"
                          name="courseImage"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        {imagePreview && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={removeImage}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-slate-500">
                        Recommended: Square image, at least 400x400px, max 5MB
                      </p>
                    </div>

                    {imagePreview && (
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Course preview"
                            className="h-24 w-24 object-cover rounded-2xl border-2 border-slate-200 shadow-lg"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Teacher Assignment */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-slate-900">Assign Teachers</h3>
              </div>

              {loadingTeachers ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="md" text="Loading teachers..." />
                </div>
              ) : teachers.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                  <Users className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                  <p className="text-yellow-700 font-medium">No Teachers Available</p>
                  <p className="text-yellow-600 text-sm">Please add teachers first before creating courses.</p>
                </div>
              ) : (
                <>
                  {/* Selected Teachers */}
                  {formData.assignedTeachers.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-slate-700">Selected Teachers ({formData.assignedTeachers.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {getSelectedTeachers().map((teacher) => (
                          <div
                            key={teacher._id}
                            className="flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3 py-2 rounded-lg text-sm font-medium"
                          >
                            <span>{teacher.userId.name}</span>
                            <button
                              type="button"
                              onClick={() => removeTeacher(teacher._id)}
                              className="text-emerald-600 hover:text-emerald-800 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Teacher Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-slate-700">
                        Available Teachers ({getFilteredTeachers().length})
                      </h4>
                      {teacherSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setTeacherSearchTerm('')}
                          className="text-xs text-slate-500 hover:text-slate-700 underline"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                    
                    {/* Search Input */}
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search by name, skills, or degree..."
                        value={teacherSearchTerm}
                        onChange={(e) => setTeacherSearchTerm(e.target.value)}
                        className="w-full h-10 px-4 pr-10 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-4">
                      {getFilteredTeachers().length === 0 ? (
                        <div className="col-span-2 flex flex-col items-center justify-center py-8 text-center">
                          <Users className="h-12 w-12 text-slate-300 mb-3" />
                          <p className="text-slate-500 font-medium mb-1">No teachers found</p>
                          <p className="text-slate-400 text-sm">
                            {teacherSearchTerm 
                              ? `No teachers match "${teacherSearchTerm}"` 
                              : 'No teachers available'
                            }
                          </p>
                          {teacherSearchTerm && (
                            <button
                              type="button"
                              onClick={() => setTeacherSearchTerm('')}
                              className="mt-2 text-blue-500 hover:text-blue-600 text-sm underline"
                            >
                              Clear search
                            </button>
                          )}
                        </div>
                      ) : (
                        getFilteredTeachers().map((teacher) => (
                        <div
                          key={teacher._id}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            formData.assignedTeachers.includes(teacher._id)
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                          onClick={() => handleTeacherToggle(teacher._id)}
                        >
                          <div className="flex-shrink-0">
                            {teacher.userId.profileImageUrl ? (
                              <img
                                src={teacher.userId.profileImageUrl}
                                alt={teacher.userId.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                <Users className="h-5 w-5 text-slate-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {highlightText(teacher.userId.name, teacherSearchTerm)}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {highlightText(teacher.degreeName, teacherSearchTerm)} • {teacher.yearOfExperience} years exp
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {teacher.skills.slice(0, 2).map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                                >
                                  {highlightText(skill, teacherSearchTerm)}
                                </span>
                              ))}
                              {teacher.skills.length > 2 && (
                                <span className="text-xs text-slate-400">
                                  +{teacher.skills.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                          {formData.assignedTeachers.includes(teacher._id) && (
                            <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    title: '',
                    description: '',
                    price: 0,
                    courseImage: undefined,
                    assignedTeachers: [],
                  });
                  setImagePreview(null);
                  setErrors({});
                  setFocusedField(null);
                }}
                disabled={isLoading}
                className="h-12 px-8 rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                disabled={isLoading || loadingTeachers}
                className="h-12 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="mr-3">
                      <LoadingSpinner size="sm" />
                    </div>
                    Creating Course...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Create Course
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            type={notification.type}
            message={notification.message}
            isVisible={true}
            onClose={closeNotification}
          />
        </div>
      )}
    </div>
  );
};

export default AddCourse;