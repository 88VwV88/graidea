import { Router } from 'express'
import { CourseController } from '../controllers'

const router = Router()
const courseController = new CourseController()

// Course CRUD routes
router.post('/', courseController.createCourse.bind(courseController))
router.get('/', courseController.getAllCourses.bind(courseController))
router.get('/search', courseController.searchCourses.bind(courseController))
router.get('/category/:category', courseController.getCoursesByCategory.bind(courseController))
router.get('/difficulty/:difficulty', courseController.getCoursesByDifficulty.bind(courseController))
router.get('/instructor/:instructorId', courseController.getCoursesByInstructor.bind(courseController))
router.get('/:id', courseController.getCourseById.bind(courseController))
router.put('/:id', courseController.updateCourse.bind(courseController))
router.delete('/:id', courseController.deleteCourse.bind(courseController))

// Course management routes
router.patch('/:id/publish', courseController.publishCourse.bind(courseController))
router.patch('/:id/archive', courseController.archiveCourse.bind(courseController))

// Student enrollment routes
router.post('/:courseId/enroll/:studentId', courseController.enrollStudent.bind(courseController))
router.delete('/:courseId/unenroll/:studentId', courseController.unenrollStudent.bind(courseController))

// Course rating route
router.post('/:id/rate', courseController.rateCourse.bind(courseController))

export default router
