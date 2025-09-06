import { Router } from 'express'
import { TeacherController } from '../controllers/teacher.controller'
import { authenticate } from '../../../middlewares/auth.middleware'

const router = Router()
const teacherController = new TeacherController()

// Public routes
router.post('/signup', teacherController.signup.bind(teacherController))
router.post('/login', teacherController.login.bind(teacherController))

// Protected routes
router.get('/profile', authenticate, teacherController.getProfile.bind(teacherController))

export default router
