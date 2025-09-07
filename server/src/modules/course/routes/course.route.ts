import { Router } from 'express'
import { CourseController } from '../controllers'
import { authenticate, authorize } from '../../../middlewares'
import { createS3UploadMiddleware } from '../../../middlewares/upload.middleware'

const router = Router()
const courseController = new CourseController()

// Create course (protected route - admin only)
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  createS3UploadMiddleware({
    singleField: 'courseImage',
    folder: 'course-images'
  }),
  courseController.createCourse
)

// Get all courses with pagination and filtering (protected route)
router.get(
  '/',
  courseController.getAllCourses
)

// Get course by ID (protected route)
router.get(
  '/:id',
  authenticate,
  courseController.getCourseById
)

// Update course (protected route - admin only)
router.put(
  '/:id',
  authenticate,
  authorize(['admin']),
  courseController.updateCourse
)

// Delete course (protected route - admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  courseController.deleteCourse
)

export default router
