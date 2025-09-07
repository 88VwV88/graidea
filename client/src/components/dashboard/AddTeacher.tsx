import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import api from '../../services/api';
import Notification from '../Notification';
import LoadingSpinner from '../LoadingSpinner';
import { UserPlus, X, Camera, CheckCircle, AlertCircle } from 'lucide-react';

const AddTeacher: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    yearOfExperience: 0,
    degreeName: '',
    skills: '',
    salary: 0,
    profileImage: undefined as File | undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
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
    const value = formData[fieldName as keyof typeof formData];
    let error = '';

    switch (fieldName) {
      case 'name': {
        if (!value || (value as string).trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;
      }
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value as string)) {
          error = 'Please enter a valid email address';
        }
        break;
      }
      case 'phone': {
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
        if (!value || !phoneRegex.test((value as string).replace(/\s/g, ''))) {
          error = 'Please enter a valid phone number';
        }
        break;
      }
      case 'yearOfExperience': {
        if (typeof value === 'number' && value < 0) {
          error = 'Experience cannot be negative';
        }
        break;
      }
      case 'salary': {
        if (typeof value === 'number' && value < 0) {
          error = 'Salary cannot be negative';
        }
        break;
      }
      case 'degreeName': {
        if (!value || (value as string).trim().length < 2) {
          error = 'Please enter a valid degree/qualification';
        }
        break;
      }
      case 'skills': {
        if (!value || (value as string).trim().length < 2) {
          error = 'Please enter at least one skill';
        }
        break;
      }
    }

    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profileImage: undefined }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);
    setErrors({});

    try {
      // Validate all fields
      const fieldNames = ['name', 'email', 'phone', 'degreeName', 'skills', 'yearOfExperience', 'salary'];
      fieldNames.forEach(fieldName => validateField(fieldName));

      // Check if there are any errors
      const hasErrors = fieldNames.some(fieldName => {
        const value = formData[fieldName as keyof typeof formData];
        let error = '';
        
        switch (fieldName) {
          case 'name': {
            if (!value || (value as string).trim().length < 2) error = 'Name must be at least 2 characters';
            break;
          }
          case 'email': {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value || !emailRegex.test(value as string)) error = 'Please enter a valid email address';
            break;
          }
          case 'phone': {
            const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
            if (!value || !phoneRegex.test((value as string).replace(/\s/g, ''))) error = 'Please enter a valid phone number';
            break;
          }
          case 'yearOfExperience': {
            if (typeof value === 'number' && value < 0) error = 'Experience cannot be negative';
            break;
          }
          case 'salary': {
            if (typeof value === 'number' && value < 0) error = 'Salary cannot be negative';
            break;
          }
          case 'degreeName': {
            if (!value || (value as string).trim().length < 2) error = 'Please enter a valid degree/qualification';
            break;
          }
          case 'skills': {
            if (!value || (value as string).trim().length < 2) error = 'Please enter at least one skill';
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
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('yearOfExperience', formData.yearOfExperience.toString());
      formDataToSend.append('degreeName', formData.degreeName);
      formDataToSend.append('skills', formData.skills);
      formDataToSend.append('salary', formData.salary.toString());
      
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      // Call the API directly
      const response = await api.post('/teachers/signup', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setNotification({
        type: 'success',
        message: response.data.message,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        yearOfExperience: 0,
        degreeName: '',
        skills: '',
        salary: 0,
        profileImage: undefined,
      });
      setImagePreview(null);

    } catch (error: unknown) {
      setNotification({
        type: 'error',
        message: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || (error as Error)?.message || 'Failed to create teacher account',
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

        <div className="bg-white/80  rounded-3xl borderoverflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-slate-900">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                    Full Name *
                  </label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('name')}
                      onBlur={() => handleBlur('name')}
                      required
                      placeholder="Enter full name"
                      className={`w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 ${
                        focusedField === 'name' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : errors.name 
                            ? 'border-red-500' 
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {formData.name && !errors.name && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                    {errors.name && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('email')}
                      onBlur={() => handleBlur('email')}
                      required
                      placeholder="Enter email address"
                      className={`w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 ${
                        focusedField === 'email' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : errors.email 
                            ? 'border-red-500' 
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {formData.email && !errors.email && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                    {errors.email && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('phone')}
                      onBlur={() => handleBlur('phone')}
                      required
                      placeholder="Enter phone number"
                      className={`w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 ${
                        focusedField === 'phone' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : errors.phone 
                            ? 'border-red-500' 
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {formData.phone && !errors.phone && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                    {errors.phone && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="degreeName" className="block text-sm font-medium text-slate-700">
                    Degree/Qualification *
                  </label>
                  <div className="relative">
                    <Input
                      id="degreeName"
                      name="degreeName"
                      type="text"
                      value={formData.degreeName}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('degreeName')}
                      onBlur={() => handleBlur('degreeName')}
                      required
                      placeholder="e.g., B.Tech, M.Sc, Ph.D"
                      className={`w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 ${
                        focusedField === 'degreeName' 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                          : errors.degreeName 
                            ? 'border-red-500' 
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {formData.degreeName && !errors.degreeName && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                    {errors.degreeName && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {errors.degreeName && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.degreeName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-slate-900">Professional Information</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="yearOfExperience" className="block text-sm font-medium text-slate-700">
                    Years of Experience *
                  </label>
                  <div className="relative">
                    <Input
                      id="yearOfExperience"
                      name="yearOfExperience"
                      type="number"
                      min="0"
                      value={formData.yearOfExperience}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('yearOfExperience')}
                      onBlur={() => handleBlur('yearOfExperience')}
                      required
                      placeholder="0"
                      className={`w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 ${
                        focusedField === 'yearOfExperience' 
                          ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' 
                          : errors.yearOfExperience 
                            ? 'border-red-500' 
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {formData.yearOfExperience >= 0 && !errors.yearOfExperience && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                    {errors.yearOfExperience && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {errors.yearOfExperience && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.yearOfExperience}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="salary" className="block text-sm font-medium text-slate-700">
                    Salary in Lacs *
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                      ₹
                    </div>
                    <Input
                      id="salary"
                      name="salary"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.salary}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus('salary')}
                      onBlur={() => handleBlur('salary')}
                      required
                      placeholder="0.00"
                      className={`w-full h-12 pl-8 pr-12 rounded-xl border-2 transition-all duration-200 ${
                        focusedField === 'salary' 
                          ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' 
                          : errors.salary 
                            ? 'border-red-500' 
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                    />
                    {formData.salary >= 0 && !errors.salary && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                    {errors.salary && (
                      <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                    )}
                  </div>
                  {errors.salary && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.salary}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="skills" className="block text-sm font-medium text-slate-700">
                  Skills *
                </label>
                <div className="relative">
                  <Input
                    id="skills"
                    name="skills"
                    type="text"
                    value={formData.skills}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('skills')}
                    onBlur={() => handleBlur('skills')}
                    required
                    placeholder="e.g., JavaScript, React, Node.js, Python (comma-separated)"
                    className={`w-full h-12 px-4 rounded-xl border-2 transition-all duration-200 ${
                      focusedField === 'skills' 
                        ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' 
                        : errors.skills 
                          ? 'border-red-500' 
                          : 'border-slate-200 hover:border-slate-300'
                    }`}
                  />
                  {formData.skills && !errors.skills && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                  {errors.skills && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500" />
                  )}
                </div>
                <p className="text-sm text-slate-500 flex items-center">
                  <span className="w-1 h-1 bg-slate-400 rounded-full mr-2"></span>
                  Separate multiple skills with commas
                </p>
                {errors.skills && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.skills}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Image */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                <h3 className="text-xl font-semibold text-slate-900">Profile Image</h3>
              </div>
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                <div className="flex-1">
                  <label htmlFor="profileImage" className="block text-sm font-medium text-slate-700 mb-3">
                    Profile Photo (Optional)
                  </label>
                  <div className="flex items-center space-x-3">
                    <label
                      htmlFor="profileImage"
                      className="flex items-center px-6 py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-all duration-200 group"
                    >
                      <Camera className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                      Choose Photo
                    </label>
                    <input
                      id="profileImage"
                      name="profileImage"
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
                    Recommended: Square image, at least 400x400px
                  </p>
                </div>

                {imagePreview && (
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
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

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    yearOfExperience: 0,
                    degreeName: '',
                    skills: '',
                    salary: 0,
                    profileImage: undefined,
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
                disabled={isLoading}
                className="h-12 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="mr-3">
                      <LoadingSpinner size="sm" />
                    </div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Teacher Account
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

export default AddTeacher;
