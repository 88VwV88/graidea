import { body, param, query } from 'express-validator'
import { CourseCategory, CourseDifficulty, CourseStatus } from '../types'

export const createCourseValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters')
    .trim(),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters')
    .trim(),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(CourseCategory)
    .withMessage('Invalid category'),
  
  body('difficulty')
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(CourseDifficulty)
    .withMessage('Invalid difficulty level'),
  
  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isNumeric()
    .withMessage('Duration must be a number')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 hour'),
  
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be non-negative'),
  
  body('instructor')
    .notEmpty()
    .withMessage('Instructor is required')
    .isMongoId()
    .withMessage('Invalid instructor ID'),
  
  body('thumbnail')
    .optional()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  
  body('status')
    .optional()
    .isIn(CourseStatus)
    .withMessage('Invalid status'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each tag must be a string'),
  
  body('prerequisites')
    .optional()
    .isArray()
    .withMessage('Prerequisites must be an array'),
  
  body('prerequisites.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each prerequisite must be a string'),
  
  body('learningObjectives')
    .optional()
    .isArray()
    .withMessage('Learning objectives must be an array'),
  
  body('learningObjectives.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each learning objective must be a string'),
  
  body('curriculum')
    .optional()
    .isArray()
    .withMessage('Curriculum must be an array'),
  
  body('curriculum.*.module')
    .optional()
    .isString()
    .trim()
    .withMessage('Module name must be a string'),
  
  body('curriculum.*.lessons')
    .optional()
    .isArray()
    .withMessage('Lessons must be an array'),
  
  body('curriculum.*.lessons.*.title')
    .optional()
    .isString()
    .trim()
    .withMessage('Lesson title must be a string'),
  
  body('curriculum.*.lessons.*.duration')
    .optional()
    .isNumeric()
    .withMessage('Lesson duration must be a number')
    .isInt({ min: 1 })
    .withMessage('Lesson duration must be at least 1 minute'),
  
  body('curriculum.*.lessons.*.type')
    .optional()
    .isIn(['video', 'text', 'quiz', 'assignment'])
    .withMessage('Invalid lesson type')
]

export const updateCourseValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),
  
  body('title')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters')
    .trim(),
  
  body('category')
    .optional()
    .isIn(CourseCategory)
    .withMessage('Invalid category'),
  
  body('difficulty')
    .optional()
    .isIn(CourseDifficulty)
    .withMessage('Invalid difficulty level'),
  
  body('duration')
    .optional()
    .isNumeric()
    .withMessage('Duration must be a number')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 hour'),
  
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be non-negative'),
  
  body('thumbnail')
    .optional()
    .isURL()
    .withMessage('Thumbnail must be a valid URL'),
  
  body('status')
    .optional()
    .isIn(CourseStatus)
    .withMessage('Invalid status'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each tag must be a string'),
  
  body('prerequisites')
    .optional()
    .isArray()
    .withMessage('Prerequisites must be an array'),
  
  body('prerequisites.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each prerequisite must be a string'),
  
  body('learningObjectives')
    .optional()
    .isArray()
    .withMessage('Learning objectives must be an array'),
  
  body('learningObjectives.*')
    .optional()
    .isString()
    .trim()
    .withMessage('Each learning objective must be a string')
]

export const courseIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID')
]

export const instructorIdValidation = [
  param('instructorId')
    .isMongoId()
    .withMessage('Invalid instructor ID')
]

export const categoryValidation = [
  param('category')
    .isIn(CourseCategory)
    .withMessage('Invalid category')
]

export const difficultyValidation = [
  param('difficulty')
    .isIn(CourseDifficulty)
    .withMessage('Invalid difficulty level')
]

export const searchValidation = [
  query('q')
    .optional()
    .isString()
    .trim()
    .withMessage('Search query must be a string')
]

export const enrollmentValidation = [
  param('courseId')
    .isMongoId()
    .withMessage('Invalid course ID'),
  
  param('studentId')
    .isMongoId()
    .withMessage('Invalid student ID')
]

export const ratingValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),
  
  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isNumeric()
    .withMessage('Rating must be a number')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5')
]
