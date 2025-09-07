import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseMetaAPI } from '../../services/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown, ChevronRight, Plus, Play, CheckCircle, Clock, BookOpen, FileText, Calendar, ArrowLeft, Settings, Eye, EyeOff, Users, IndianRupee } from 'lucide-react';
import LoadingSpinner from '../LoadingSpinner';

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
  courseId: string | any;
  title: string;
  description?: string;
  totalWeeks: number;
  totalDuration?: number;
  weeks: Week[];
  isPublished: boolean;
  publishedAt?: string;
  createdBy: string | any;
  completionPercentage?: number;
  totalAssignments?: number;
  submittedAssignments?: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  imageLink?: string;
  price: number;
  assignedTeachers: any[];
  createdAt: string;
  updatedAt: string;
}

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [courseMetas, setCourseMetas] = useState<CourseMeta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  // Handle automatic redirect when no course meta is found
  useEffect(() => {
    if (shouldRedirect && courseId && !isLoading) {
      // Small delay to show loading state before redirect
      const timer = setTimeout(() => {
        navigate(`/dashboard/courses/meta?courseId=${courseId}`);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, courseId, isLoading, navigate]);

  const fetchCourseDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch course details
      console.log('Fetching course details for ID:', courseId);
      const courseData = await courseMetaAPI.getCourseById(courseId!);
      console.log('Course data response:', courseData);
      setCourse(courseData.data);

      // Fetch course metas for this course
      console.log('Fetching course metas for course ID:', courseId);
      const courseMetasResponse = await courseMetaAPI.getCourseMetaByCourseId(courseId!);
      console.log('Course metas response:', courseMetasResponse);
      
      // Ensure courseMetas is always an array
      const metas = Array.isArray(courseMetasResponse.data) 
        ? courseMetasResponse.data 
        : Array.isArray(courseMetasResponse) 
          ? courseMetasResponse 
          : [];
      
      console.log('Processed course metas:', metas);
      setCourseMetas(metas);

      // If no course metas found, set redirect flag
      if (metas.length === 0) {
        setShouldRedirect(true);
      }

    } catch (err: any) {
      console.error('Error fetching course details:', err);
      setError(err.message || 'Failed to fetch course details');
      // Ensure courseMetas is always an array even on error
      setCourseMetas([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWeekExpansion = (weekId: string) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekId)) {
      newExpanded.delete(weekId);
    } else {
      newExpanded.add(weekId);
    }
    setExpandedWeeks(newExpanded);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Extract YouTube video ID from various URL formats
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle video play button click
  const handlePlayVideo = (videoUrl: string) => {
    const videoId = getYouTubeVideoId(videoUrl);
    if (videoId) {
      setPlayingVideoId(playingVideoId === videoId ? null : videoId);
    } else {
      // If it's not a YouTube URL, open in new tab
      window.open(videoUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" text="Loading course details..." />
      </div>
    );
  }

  if (shouldRedirect) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center max-w-md">
          <LoadingSpinner size="lg" text="No course content found. Redirecting to create content..." />
          <p className="text-sm text-gray-500 mt-4 mb-4">
            You will be redirected to create course content for this course.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setShouldRedirect(false)}
            className="text-sm"
          >
            Stay on this page
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
        <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/dashboard/courses/list')}>
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard/courses/list')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-600 mt-1">{course.description}</p>
        </div>
      </div>

      {/* Course Info Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{course.title}</CardTitle>
              <CardDescription className="text-base mt-2">{course.description}</CardDescription>
            </div>
            <div className="flex items-center text-2xl font-bold text-green-600">
              <IndianRupee className="h-6 w-6" />
              {course.price.toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Assigned Teachers</p>
                <p className="font-semibold">{course.assignedTeachers?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Course Metas</p>
                <p className="font-semibold">{courseMetas.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-semibold">{formatDate(course.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Assigned Teachers */}
          {course.assignedTeachers && course.assignedTeachers.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Assigned Teachers</h3>
              <div className="flex flex-wrap gap-3">
                {course.assignedTeachers.map((teacher) => (
                  <div
                    key={teacher._id}
                    className="flex items-center space-x-3 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg"
                  >
                    {teacher.userId.profileImageUrl ? (
                      <img
                        src={teacher.userId.profileImageUrl}
                        alt={teacher.userId.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{teacher.userId.name}</p>
                      <p className="text-sm text-blue-600">{teacher.degreeName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Metas Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Course Content</h2>
          <Badge variant="outline" className="text-sm">
            {Array.isArray(courseMetas) ? courseMetas.length : 0} Course Meta{Array.isArray(courseMetas) && courseMetas.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {!Array.isArray(courseMetas) || courseMetas.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="text-center py-12">
              <div className="max-w-md mx-auto">
                <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Course Content Found</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  This course doesn't have any structured content yet. Create course meta to add weeks, 
                  subtopics, assignments, and other learning materials.
                </p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate(`/dashboard/courses/meta?courseId=${courseId}`)}
                    className="w-full sm:w-auto"
                    size="lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Course Content
                  </Button>
                  <p className="text-sm text-gray-500">
                    You'll be able to select this course when creating content
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Array.isArray(courseMetas) && courseMetas.map((courseMeta) => (
              <Card key={courseMeta._id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{courseMeta.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {courseMeta.description || 'No description provided'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={courseMeta.isPublished ? 'default' : 'secondary'}>
                        {courseMeta.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/dashboard/courses/meta?courseId=${courseId}`)}
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Weeks</p>
                        <p className="font-semibold">{courseMeta.totalWeeks}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">
                          {courseMeta.totalDuration ? formatDuration(courseMeta.totalDuration) : 'Not set'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600">Assignments</p>
                        <p className="font-semibold">{courseMeta.totalAssignments || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <p className="font-semibold">{courseMeta.completionPercentage || 0}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Weeks List */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Weeks</h4>
                    {courseMeta.weeks.map((week) => (
                      <Card key={week._id} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <Collapsible>
                            <CollapsibleTrigger
                              className="flex items-center justify-between w-full"
                              onClick={() => toggleWeekExpansion(week._id)}
                            >
                              <div className="flex items-center gap-3">
                                {expandedWeeks.has(week._id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <div>
                                  <h5 className="font-semibold">Week {week.weekNumber}: {week.title}</h5>
                                  {week.description && (
                                    <p className="text-sm text-gray-600">{week.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {week.isCompleted && (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                )}
                                <Badge variant={week.isCompleted ? 'default' : 'secondary'}>
                                  {week.isCompleted ? 'Completed' : 'In Progress'}
                                </Badge>
                              </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-4">
                              <div className="space-y-4">
                                {/* Sub-topics */}
                                <div>
                                  <h6 className="font-medium mb-2">Sub-topics ({week.subTopics.length})</h6>
                                  <div className="space-y-2">
                                    {week.subTopics.map((subtopic) => (
                                      <div key={subtopic._id} className="flex items-center gap-3 p-2 border rounded">
                                        <Checkbox
                                          checked={subtopic.isCompleted || false}
                                          disabled
                                        />
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium">{subtopic.title}</span>
                                            {subtopic.duration && (
                                              <Badge variant="outline" className="text-xs">
                                                {formatDuration(subtopic.duration)}
                                              </Badge>
                                            )}
                                          </div>
                                          {subtopic.description && (
                                            <p className="text-sm text-gray-600">{subtopic.description}</p>
                                          )}
                                          {subtopic.link && (
                                            <a 
                                              href={subtopic.link} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="text-sm text-blue-600 hover:text-blue-800 underline"
                                            >
                                              📖 Additional Resources
                                            </a>
                                          )}
                                        </div>
                                        <div className="flex gap-2">
                                          {subtopic.videoUrl && (
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => handlePlayVideo(subtopic.videoUrl!)}
                                            >
                                              {playingVideoId === getYouTubeVideoId(subtopic.videoUrl!) ? (
                                                <span className="text-xs">Hide Video</span>
                                              ) : (
                                                <Play className="h-4 w-4" />
                                              )}
                                            </Button>
                                          )}
                                          {subtopic.link && (
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              onClick={() => window.open(subtopic.link, '_blank')}
                                            >
                                              <BookOpen className="h-4 w-4" />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {/* Video Player - appears beneath subtopics */}
                                  {playingVideoId && (
                                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                      <div className="flex justify-between items-center mb-3">
                                        <h5 className="font-medium text-lg">Video Player</h5>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setPlayingVideoId(null)}
                                          className="text-xs"
                                        >
                                          ✕ Close Video
                                        </Button>
                                      </div>
                                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                          src={`https://www.youtube.com/embed/${playingVideoId}?modestbranding=1&rel=0&showinfo=0&controls=1&disablekb=1`}
                                          title="Video Player"
                                          className="absolute top-0 left-0 w-full h-full rounded"
                                          frameBorder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Assignments */}
                                <div>
                                  <h6 className="font-medium mb-2">Assignments ({week.assignments.length})</h6>
                                  <div className="space-y-2">
                                    {week.assignments.map((assignment) => (
                                      <div key={assignment._id} className="flex items-center gap-3 p-2 border rounded">
                                        <Checkbox
                                          checked={assignment.isSubmitted || false}
                                          disabled
                                        />
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium">{assignment.title}</span>
                                            {assignment.maxMarks && (
                                              <Badge variant="outline" className="text-xs">
                                                {assignment.maxMarks} marks
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-600">{assignment.description}</p>
                                          {assignment.dueDate && (
                                            <p className="text-xs text-gray-500">
                                              Due: {formatDate(assignment.dueDate)}
                                            </p>
                                          )}
                                        </div>
                                        {assignment.assignmentUrl && (
                                          <Button size="sm" variant="outline">
                                            <FileText className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CourseDetail;
