import { Router } from 'express'
import { TeacherController } from '../controllers/teacher.controller'
import { createS3UploadMiddleware } from '../../../middlewares/upload.middleware'
import { authenticate, authorize } from '../../../middlewares'

const router = Router()

const teacherController = new TeacherController()

// Teacher signup route with S3 upload for profile image
router.post(
  '/signup',
  createS3UploadMiddleware({
    singleField: 'profileImage',
    folder: 'teacher-profiles'
  }),
  teacherController.signup
)

// Get teacher profile by userId (protected route)
router.get(
  '/profile/:userId',
  authenticate,
  teacherController.getProfile
)

// Update teacher profile (protected route)
router.put(
  '/profile/:userId',
  authenticate,
  createS3UploadMiddleware({
    singleField: 'profileImage',
    folder: 'teacher-profiles'
  }),
  teacherController.updateProfile
)

// Get all teachers with filtering and pagination (protected route)
router.get(
  '/',
  authenticate,
  teacherController.getAllTeachers
)

export default router
