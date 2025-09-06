import React, { useState, useEffect } from 'react';
import { teachersAPI } from '../../services/api';
import type { Teacher } from '../../types/auth-types';
import LoadingSpinner from '../LoadingSpinner';
import { Mail, Phone, GraduationCap, Star, IndianRupee, Calendar } from 'lucide-react';

// SF Pro font for global style (add to CSS)
const sfProStyles = {
  fontFamily: '"SF Pro Text", "SF Pro Display", Arial, sans-serif'
};

const TeachersList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await teachersAPI.getAllTeachers();
        setTeachers(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch teachers');
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // Apple-style loading overlay: blurred background, soft shadow, centered
  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-lg"
        style={sfProStyles}
      >
        <LoadingSpinner size="lg" text="Loading teachers..." />
      </div>
    );
  }

  // Subtle Apple-style error sheet: rounded, soft red accents
  if (error) {
    return (
      <div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl border border-red-100 shadow-lg p-6 text-center"
        style={sfProStyles}
      >
        <div className="font-semibold text-red-600 mb-2">Error Loading Teachers</div>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Neutral, polite empty state
  if (teachers.length === 0) {
    return (
      <div
        className="mx-auto my-20 max-w-md bg-white rounded-2xl border border-gray-100 shadow p-10 text-center"
        style={sfProStyles}
      >
        <p className="text-[17px] font-medium text-gray-700 mb-3">
          No Teachers Found
        </p>
        <p className="text-gray-500 text-base">There are no teachers registered yet.</p>
      </div>
    );
  }

  // MAIN UI - Apple System Design
  return (
    <div className="bg-white min-h-screen" style={sfProStyles}>
      <div className="max-w-5xl mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-gradient-to-b from-white to-gray-50 border border-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-200"
            >
              <div className="flex items-center px-6 pt-6 pb-2 gap-5">
                <img
                  src={teacher.userId.profileImageUrl || teacher.photoUrl}
                  alt={teacher.userId.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200 shadow"
                />
                <div>
                  <h2 className="text-[19px] font-semibold text-gray-900">{teacher.userId.name}</h2>
                  <p className="text-xs text-gray-500">{teacher.degreeName}</p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center text-[15px] text-gray-600">
                  <Mail className="h-4 w-4 mr-2 stroke-[2.3]" />
                  {teacher.userId.email}
                </div>
                {teacher.userId.phone && (
                  <div className="flex items-center text-[15px] text-gray-600">
                    <Phone className="h-4 w-4 mr-2 stroke-[2.3]" />
                    {teacher.userId.phone}
                  </div>
                )}
                <div className="flex items-center text-[15px] text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 stroke-[2.3]" />
                  {teacher.yearOfExperience} years
                </div>
                <div className="flex items-center text-[15px] text-gray-600">
                  <IndianRupee className="h-4 w-4 mr-2 stroke-[2.3]" />
                  {teacher.salary} lacs
                </div>
                <div>
                  <div className="flex items-center text-[15px] text-gray-600 mb-1">
                    <Star className="h-4 w-4 mr-2 stroke-[2.3]" />
                    Skills
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {teacher.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-[9px] py-[5px] rounded-full text-[13px] font-medium bg-blue-50 text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {teacher.coursesEnrolled && teacher.coursesEnrolled.length > 0 && (
                  <div>
                    <div className="flex items-center text-[15px] text-gray-600 mb-1">
                      <GraduationCap className="h-4 w-4 mr-2 stroke-[2.3]" />
                      Courses ({teacher.coursesEnrolled.length})
                    </div>
                    <div className="text-xs text-gray-500">
                      {teacher.coursesEnrolled.map(course => course.title).join(', ')}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 text-right select-none">
                Joined {new Date(teacher.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeachersList;
  