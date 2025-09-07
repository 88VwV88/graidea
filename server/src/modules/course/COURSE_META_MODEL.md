# Course Meta Model Documentation

## Overview
The Course Meta model is designed to create a comprehensive course structure similar to Udemy courses, with weeks, subtopics, assignments, and completion tracking. This model points to a specific course ID and allows teachers/admins to create dynamic course content.

## Model Structure

### ICourseMeta (Main Model)
- **courseId**: Reference to the main Course model
- **title**: Course meta title
- **description**: Optional description
- **totalWeeks**: Number of weeks in the course
- **totalDuration**: Total course duration in minutes
- **weeks**: Array of week objects
- **isPublished**: Whether the course meta is published
- **publishedAt**: Publication timestamp
- **createdBy**: Reference to the User who created this course meta

### IWeek (Week Structure)
- **weekNumber**: Sequential week number (1, 2, 3, etc.)
- **title**: Week title
- **description**: Optional week description
- **subTopics**: Array of subtopic objects
- **assignments**: Array of assignment objects
- **isCompleted**: Whether the week is completed
- **completedAt**: Completion timestamp

### ISubTopic (Sub-topic Structure)
- **title**: Sub-topic title
- **description**: Optional description
- **videoUrl**: Optional video URL
- **duration**: Duration in minutes
- **isCompleted**: Completion status
- **order**: Order within the week

### IAssignment (Assignment Structure)
- **title**: Assignment title
- **description**: Assignment description
- **assignmentUrl**: Optional assignment URL
- **dueDate**: Optional due date
- **maxMarks**: Maximum marks for the assignment
- **isSubmitted**: Submission status
- **submittedAt**: Submission timestamp
- **marksObtained**: Marks received
- **feedback**: Teacher feedback
- **order**: Order within the week

## Virtual Fields

### completionPercentage
Calculates the percentage of completed subtopics across all weeks.

### totalAssignments
Returns the total number of assignments across all weeks.

### submittedAssignments
Returns the number of submitted assignments across all weeks.

## Usage Examples

### Creating a Course Meta
```typescript
const courseMeta = new CourseMeta({
  courseId: courseId,
  title: "Complete Web Development Course",
  description: "Learn full-stack web development",
  totalWeeks: 12,
  createdBy: teacherId,
  weeks: [
    {
      weekNumber: 1,
      title: "Introduction to Web Development",
      subTopics: [
        {
          title: "What is Web Development?",
          description: "Introduction to web development concepts",
          duration: 30,
          order: 1
        }
      ],
      assignments: [
        {
          title: "Setup Development Environment",
          description: "Install and configure your development tools",
          maxMarks: 100,
          order: 1
        }
      ]
    }
  ]
});
```

### Marking a Sub-topic as Complete
```typescript
await CourseMeta.findOneAndUpdate(
  { courseId: courseId, 'weeks.subTopics._id': subtopicId },
  { $set: { 'weeks.$[].subTopics.$[subtopic].isCompleted': true } },
  { arrayFilters: [{ 'subtopic._id': subtopicId }] }
);
```

### Adding an Assignment Submission
```typescript
await CourseMeta.findOneAndUpdate(
  { courseId: courseId, 'weeks.assignments._id': assignmentId },
  { 
    $set: { 
      'weeks.$[].assignments.$[assignment].isSubmitted': true,
      'weeks.$[].assignments.$[assignment].submittedAt': new Date()
    } 
  },
  { arrayFilters: [{ 'assignment._id': assignmentId }] }
);
```

## Indexes
- `courseId`: For fast course lookups
- `createdBy`: For teacher-specific queries
- `isPublished`: For published course filtering
- `createdAt`: For chronological sorting

## Relationships
- **Course**: One-to-one relationship with Course model
- **User**: Many-to-one relationship with User model (createdBy)
- **Teacher**: Can be referenced through User model

## Features
1. **Dynamic Structure**: Teachers can create any number of weeks, subtopics, and assignments
2. **Progress Tracking**: Built-in completion tracking for subtopics and assignments
3. **Ordering**: All items have order fields for proper sequencing
4. **Flexible Content**: Support for videos, assignments, and various content types
5. **Grading System**: Built-in assignment grading and feedback system
6. **Publishing Control**: Course meta can be published/unpublished
7. **Analytics**: Virtual fields provide completion statistics
