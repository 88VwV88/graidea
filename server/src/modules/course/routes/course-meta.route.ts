import { Router } from 'express'
import { CourseMetaController } from '../controllers'
import { authenticate, authorize } from '../../../middlewares'

const router = Router()
const courseMetaController = new CourseMetaController()

// Create course meta (protected route - admin/teacher only)
router.post(
  '/',
  authenticate,
  courseMetaController.createCourseMeta
)

// Get all course metas (protected route)
router.get(
  '/',
  authenticate,
  courseMetaController.getAllCourseMetas
)

// Get course meta by ID (protected route)
router.get(
  '/:id',
  authenticate,
  courseMetaController.getCourseMetaById
)

// Get course meta by course ID (protected route)
router.get(
  '/course/:courseId',
  authenticate,
  courseMetaController.getCourseMetaByCourseId
)

// Update course meta (protected route - admin/teacher only)
router.put(
  '/:id',
  authenticate,
  authorize(['admin', 'teacher']),
  courseMetaController.updateCourseMeta
)

// Add week to course meta (protected route - admin/teacher only)
router.post(
  '/:id/weeks',
  authenticate,
  authorize(['admin', 'teacher']),
  courseMetaController.addWeek
)

// Update week in course meta (protected route - admin/teacher only)
router.put(
  '/:id/weeks/:weekId',
  authenticate,
  authorize(['admin', 'teacher']),
  courseMetaController.updateWeek
)

// Delete week from course meta (protected route - admin/teacher only)
router.delete(
  '/:id/weeks/:weekId',
  authenticate,
  authorize(['admin', 'teacher']),
  courseMetaController.deleteWeek
)

// Mark subtopic as completed (protected route - student/teacher/admin)
router.patch(
  '/:id/weeks/:weekId/subtopics/:subtopicId/complete',
  authenticate,
  courseMetaController.markSubtopicCompleted
)

// Submit assignment (protected route - student/teacher/admin)
router.patch(
  '/:id/weeks/:weekId/assignments/:assignmentId/submit',
  authenticate,
  courseMetaController.submitAssignment
)

// Publish course meta (protected route - admin/teacher only)
router.patch(
  '/:id/publish',
  authenticate,
  authorize(['admin', 'teacher']),
  courseMetaController.publishCourseMeta
)

// Delete course meta (protected route - admin only)
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  courseMetaController.deleteCourseMeta
)

export default router
