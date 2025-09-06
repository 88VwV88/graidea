import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { courseMetaAPI } from '../../services/api';
import api from '../../services/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { ChevronDown, ChevronRight, Plus, Play, CheckCircle, Clock, BookOpen, FileText, Calendar, Search, ArrowLeft, Settings, Eye, EyeOff } from 'lucide-react';

interface SubTopic {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  link?: string; // External link for additional resources
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
  price: number;
}

const CourseMetaManager: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [courseMetas, setCourseMetas] = useState<CourseMeta[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseMeta, setSelectedCourseMeta] = useState<CourseMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showWeekForm, setShowWeekForm] = useState(false);
  const [showSubtopicModal, setShowSubtopicModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedWeekForModal, setSelectedWeekForModal] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    courseId: '',
    title: '',
    description: '',
    totalWeeks: 1,
  });

  const [weekForm, setWeekForm] = useState({
    title: '',
    description: '',
  });

  const [subtopicForm, setSubtopicForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    link: '',
    duration: 0,
  });

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    assignmentUrl: '',
    dueDate: '',
    maxMarks: 100,
  });

  // Load course metas and courses on component mount
  useEffect(() => {
    loadCourseMetas();
    loadCourses();
  }, []);

  // Pre-select course if coming from course detail page
  useEffect(() => {
    const courseId = searchParams.get('courseId');
    if (courseId && courses.length > 0) {
      const course = courses.find(c => c._id === courseId);
      if (course) {
        setCreateForm(prev => ({ ...prev, courseId }));
        setShowCreateForm(true);
      }
    }
  }, [searchParams, courses]);

  const loadCourseMetas = async () => {
    try {
      setIsLoading(true);
      const response = await courseMetaAPI.getAllCourseMetas();
      setCourseMetas(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.data);
    } catch (err: any) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses. Please try again.');
    }
  };

  const handleCreateCourseMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await courseMetaAPI.createCourseMeta(createForm);
      setCourseMetas([...courseMetas, response.data]);
      setShowCreateForm(false);
      setCreateForm({ courseId: '', title: '', description: '', totalWeeks: 1 });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWeek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseMeta) return;

    try {
      setIsLoading(true);
      const response = await courseMetaAPI.addWeek(selectedCourseMeta._id, weekForm);
      setSelectedCourseMeta(response.data);
      setShowWeekForm(false);
      setWeekForm({ title: '', description: '' });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Modal handlers
  const openSubtopicModal = (weekId: string) => {
    setSelectedWeekForModal(weekId);
    setShowSubtopicModal(true);
  };

  const openAssignmentModal = (weekId: string) => {
    setSelectedWeekForModal(weekId);
    setShowAssignmentModal(true);
  };

  const closeModals = () => {
    setShowSubtopicModal(false);
    setShowAssignmentModal(false);
    setSelectedWeekForModal(null);
    setSubtopicForm({ title: '', description: '', videoUrl: '', link: '', duration: 0 });
    setAssignmentForm({ title: '', description: '', assignmentUrl: '', dueDate: '', maxMarks: 100 });
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

  const handleAddSubtopic = async (weekId: string, title?: string, link?: string) => {
    if (!selectedCourseMeta) return;

    try {
      setIsLoading(true);
      const week = selectedCourseMeta.weeks.find(w => w._id === weekId);
      if (!week) return;

      const newSubtopic = {
        title: title || subtopicForm.title,
        description: subtopicForm.description,
        videoUrl: subtopicForm.videoUrl,
        link: link || subtopicForm.link,
        duration: subtopicForm.duration,
        order: week.subTopics.length + 1,
        isCompleted: false,
      };

      // Validate that title is not empty
      if (!newSubtopic.title.trim()) {
        setError('Subtopic title is required');
        return;
      }

      // Validate link format if provided
      if (newSubtopic.link && !/^https?:\/\/.+/.test(newSubtopic.link)) {
        setError('Link must be a valid URL starting with http:// or https://');
        return;
      }

      const updatedWeek = {
        ...week,
        subTopics: [...week.subTopics, newSubtopic],
      };

      const response = await courseMetaAPI.updateWeek(selectedCourseMeta._id, weekId, updatedWeek);
      setSelectedCourseMeta(response.data);
      setSubtopicForm({ title: '', description: '', videoUrl: '', link: '', duration: 0 });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAssignment = async (weekId: string, title?: string, description?: string) => {
    if (!selectedCourseMeta) return;

    try {
      setIsLoading(true);
      const week = selectedCourseMeta.weeks.find(w => w._id === weekId);
      if (!week) return;

      const newAssignment = {
        title: title || assignmentForm.title,
        description: description || assignmentForm.description,
        assignmentUrl: assignmentForm.assignmentUrl,
        dueDate: assignmentForm.dueDate,
        maxMarks: assignmentForm.maxMarks,
        order: week.assignments.length + 1,
        isSubmitted: false,
      };

      // Validate that title and description are not empty
      if (!newAssignment.title.trim()) {
        setError('Assignment title is required');
        return;
      }
      if (!newAssignment.description.trim()) {
        setError('Assignment description is required');
        return;
      }

      const updatedWeek = {
        ...week,
        assignments: [...week.assignments, newAssignment],
      };

      const response = await courseMetaAPI.updateWeek(selectedCourseMeta._id, weekId, updatedWeek);
      setSelectedCourseMeta(response.data);
      setAssignmentForm({ title: '', description: '', assignmentUrl: '', dueDate: '', maxMarks: 100 });
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSubtopic = async (weekId: string, subtopicId: string, isCompleted: boolean) => {
    if (!selectedCourseMeta) return;

    try {
      const response = await courseMetaAPI.markSubtopicCompleted(
        selectedCourseMeta._id,
        weekId,
        subtopicId,
        isCompleted
      );
      setSelectedCourseMeta(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleAssignment = async (weekId: string, assignmentId: string, isSubmitted: boolean) => {
    if (!selectedCourseMeta) return;

    try {
      const response = await courseMetaAPI.submitAssignment(
        selectedCourseMeta._id,
        weekId,
        assignmentId,
        isSubmitted
      );
      setSelectedCourseMeta(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handlePublishCourseMeta = async (courseMetaId: string) => {
    try {
      setIsLoading(true);
      const response = await courseMetaAPI.publishCourseMeta(courseMetaId);
      setCourseMetas(courseMetas.map(cm => cm._id === courseMetaId ? response.data : cm));
      if (selectedCourseMeta?._id === courseMetaId) {
        setSelectedCourseMeta(response.data);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message);
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

  // Filter and search functionality
  const filteredCourseMetas = courseMetas.filter((courseMeta) => {
    const matchesSearch = courseMeta.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (courseMeta.description && courseMeta.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && courseMeta.isPublished) ||
                         (filterStatus === 'draft' && !courseMeta.isPublished);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading && courseMetas.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {selectedCourseMeta && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCourseMeta(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Courses
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">
              {selectedCourseMeta ? 'Course Details' : 'Course Management'}
            </h1>
            {selectedCourseMeta && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedCourseMeta.title} • {selectedCourseMeta.totalWeeks} weeks
              </p>
            )}
          </div>
        </div>
        {!selectedCourseMeta && (
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Course Meta
          </Button>
        )}
      </div>

      {/* Search and Filter Bar */}
      {!selectedCourseMeta && (
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'published' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('published')}
            >
              <Eye className="h-4 w-4 mr-1" />
              Published
            </Button>
            <Button
              variant={filterStatus === 'draft' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('draft')}
            >
              <EyeOff className="h-4 w-4 mr-1" />
              Draft
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Create Course Meta Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Course Meta</CardTitle>
            <CardDescription>
              {searchParams.get('courseId') 
                ? `Add structured content to the selected course with weeks, subtopics, and assignments.`
                : 'Create a new course structure with weeks and content'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCourseMeta} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Course</label>
                <select
                  value={createForm.courseId}
                  onChange={(e) => setCreateForm({ ...createForm, courseId: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                {searchParams.get('courseId') && (
                  <p className="text-sm text-blue-600 mt-1">
                    ✓ Course pre-selected from course detail page
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  placeholder="Enter course meta title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Enter course meta description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Total Weeks</label>
                <Input
                  type="number"
                  value={createForm.totalWeeks}
                  onChange={(e) => setCreateForm({ ...createForm, totalWeeks: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Course Meta'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      {!selectedCourseMeta && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div className='flex items-center justify-center gap-3'>
                  <p className="text-2xl font-bold">{courseMetas.length}</p>
                  <p className="text-sm text-gray-600">Total Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-500" />
                <div className='flex items-center justify-center gap-3'>
                  <p className="text-2xl font-bold">{courseMetas.filter(c => c.isPublished).length}</p>
                  <p className="text-sm text-gray-600">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-orange-500" />
                <div className='flex items-center justify-center gap-3'>
                  <p className="text-2xl font-bold">{courseMetas.filter(c => !c.isPublished).length}</p>
                  <p className="text-sm text-gray-600">Drafts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <div className='flex items-center justify-center gap-3'>
                  <p className="text-2xl font-bold">
                    {courseMetas.reduce((acc, c) => acc + c.totalWeeks, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Total Weeks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Course Metas List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourseMetas.map((courseMeta) => (
          <Card key={courseMeta._id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{courseMeta.title}</CardTitle>
                  <CardDescription>
                    {typeof courseMeta.courseId === 'object' ? courseMeta.courseId.title : 'Course'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={courseMeta.isPublished ? 'default' : 'secondary'}>
                    {courseMeta.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="h-4 w-4" />
                  {courseMeta.totalWeeks} weeks
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {courseMeta.totalDuration ? formatDuration(courseMeta.totalDuration) : 'No duration set'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  {courseMeta.totalAssignments || 0} assignments
                </div>
                {courseMeta.completionPercentage !== undefined && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4" />
                    {courseMeta.completionPercentage}% complete
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  onClick={() => setSelectedCourseMeta(courseMeta)}
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
                {!courseMeta.isPublished ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePublishCourseMeta(courseMeta._id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Publish
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePublishCourseMeta(courseMeta._id)}
                  >
                    <EyeOff className="h-4 w-4 mr-1" />
                    Unpublish
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Meta Detail View */}
      {selectedCourseMeta && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{selectedCourseMeta.title}</CardTitle>
                <CardDescription>
                  {selectedCourseMeta.description || 'No description provided'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowWeekForm(true)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCourseMeta(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add Week Form */}
            {showWeekForm && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-3">Add New Week</h3>
                <form onSubmit={handleAddWeek} className="space-y-3">
                  <Input
                    value={weekForm.title}
                    onChange={(e) => setWeekForm({ ...weekForm, title: e.target.value })}
                    placeholder="Week title"
                    required
                  />
                  <textarea
                    value={weekForm.description}
                    onChange={(e) => setWeekForm({ ...weekForm, description: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    rows={2}
                    placeholder="Week description"
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={isLoading}>
                      {isLoading ? 'Adding...' : 'Add Week'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowWeekForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Weeks List */}
            <div className="space-y-4">
              {selectedCourseMeta.weeks.map((week) => (
                <Card key={week._id}>
                  <CardHeader>
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
                            <h3 className="font-semibold">Week {week.weekNumber}: {week.title}</h3>
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
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">Sub-topics</h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openSubtopicModal(week._id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {week.subTopics.map((subtopic) => (
                                <div key={subtopic._id} className="flex items-center gap-3 p-2 border rounded">
                                  <Checkbox
                                    checked={subtopic.isCompleted || false}
                                    onCheckedChange={(checked) =>
                                      handleToggleSubtopic(week._id, subtopic._id, checked as boolean)
                                    }
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
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">Assignments</h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openAssignmentModal(week._id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {week.assignments.map((assignment) => (
                                <div key={assignment._id} className="flex items-center gap-3 p-2 border rounded">
                                  <Checkbox
                                    checked={assignment.isSubmitted || false}
                                    onCheckedChange={(checked) =>
                                      handleToggleAssignment(week._id, assignment._id, checked as boolean)
                                    }
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{assignment.title}</span>
                                      {assignment.maxMarks && (
                                        <Badge variant="outline" className="text-xs">
                                          {assignment.maxMarks} marks
                                        </Badge>
                                      )}
                                      {assignment.dueDate && (
                                        <Badge variant="outline" className="text-xs">
                                          <Calendar className="h-3 w-3 mr-1" />
                                          {formatDate(assignment.dueDate)}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">{assignment.description}</p>
                                    {assignment.isSubmitted && assignment.submittedAt && (
                                      <p className="text-xs text-green-600">
                                        Submitted on {formatDate(assignment.submittedAt)}
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
      )}

      {/* Subtopic Modal */}
      {showSubtopicModal && selectedWeekForModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add New Subtopic</CardTitle>
              <CardDescription>Add a new subtopic to this week</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddSubtopic(selectedWeekForModal, subtopicForm.title, subtopicForm.link);
                closeModals();
              }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={subtopicForm.title}
                    onChange={(e) => setSubtopicForm({ ...subtopicForm, title: e.target.value })}
                    placeholder="Enter subtopic title"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={subtopicForm.description}
                    onChange={(e) => setSubtopicForm({ ...subtopicForm, description: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Enter subtopic description"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Resource Link</label>
                  <Input
                    value={subtopicForm.link}
                    onChange={(e) => setSubtopicForm({ ...subtopicForm, link: e.target.value })}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Video URL</label>
                  <Input
                    value={subtopicForm.videoUrl}
                    onChange={(e) => setSubtopicForm({ ...subtopicForm, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    type="url"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={subtopicForm.duration}
                    onChange={(e) => setSubtopicForm({ ...subtopicForm, duration: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Adding...' : 'Add Subtopic'}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeModals}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && selectedWeekForModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add New Assignment</CardTitle>
              <CardDescription>Add a new assignment to this week</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddAssignment(selectedWeekForModal, assignmentForm.title, assignmentForm.description);
                closeModals();
              }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                    placeholder="Enter assignment title"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description *</label>
                  <textarea
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    placeholder="Enter assignment description"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Assignment URL</label>
                  <Input
                    value={assignmentForm.assignmentUrl}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, assignmentUrl: e.target.value })}
                    placeholder="https://example.com/assignment"
                    type="url"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Marks</label>
                  <Input
                    type="number"
                    value={assignmentForm.maxMarks}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, maxMarks: parseInt(e.target.value) || 100 })}
                    placeholder="100"
                    min="0"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Adding...' : 'Add Assignment'}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeModals}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
};

export default CourseMetaManager;
