import { Request, Response } from 'express'
import { CourseService } from '../services'
import { ICourse } from '../types'

export class CourseController {
  private courseService: CourseService

  constructor() {
    this.courseService = new CourseService()
  }

  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseData: Partial<ICourse> = req.body
      const course = await this.courseService.createCourse(courseData)
      
      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: course
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create course'
      })
    }
  }

  async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const course = await this.courseService.getCourseById(id)
      
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: course
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get course'
      })
    }
  }

  async getAllCourses(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query
      const courses = await this.courseService.getAllCourses(filters)
      
      res.status(200).json({
        success: true,
        data: courses,
        count: courses.length
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get courses'
      })
    }
  }

  async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updateData: Partial<ICourse> = req.body
      const course = await this.courseService.updateCourse(id, updateData)
      
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: course
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update course'
      })
    }
  }

  async deleteCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const course = await this.courseService.deleteCourse(id)
      
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete course'
      })
    }
  }

  async getCoursesByInstructor(req: Request, res: Response): Promise<void> {
    try {
      const { instructorId } = req.params
      const courses = await this.courseService.getCoursesByInstructor(instructorId)
      
      res.status(200).json({
        success: true,
        data: courses,
        count: courses.length
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get instructor courses'
      })
    }
  }

  async getCoursesByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params
      const courses = await this.courseService.getCoursesByCategory(category)
      
      res.status(200).json({
        success: true,
        data: courses,
        count: courses.length
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get courses by category'
      })
    }
  }

  async getCoursesByDifficulty(req: Request, res: Response): Promise<void> {
    try {
      const { difficulty } = req.params
      const courses = await this.courseService.getCoursesByDifficulty(difficulty)
      
      res.status(200).json({
        success: true,
        data: courses,
        count: courses.length
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get courses by difficulty'
      })
    }
  }

  async searchCourses(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query
      const query = q as string
      const courses = await this.courseService.searchCourses(query)
      
      res.status(200).json({
        success: true,
        data: courses,
        count: courses.length
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to search courses'
      })
    }
  }

  async enrollStudent(req: Request, res: Response): Promise<void> {
    try {
      const { courseId, studentId } = req.params
      const course = await this.courseService.enrollStudentInCourse(courseId, studentId)
      
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Student enrolled successfully',
        data: course
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to enroll student'
      })
    }
  }

  async unenrollStudent(req: Request, res: Response): Promise<void> {
    try {
      const { courseId, studentId } = req.params
      const course = await this.courseService.unenrollStudentFromCourse(courseId, studentId)
      
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Student unenrolled successfully',
        data: course
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to unenroll student'
      })
    }
  }

  async rateCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const { rating } = req.body
      const course = await this.courseService.rateCourse(id, rating)
      
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course rated successfully',
        data: course
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to rate course'
      })
    }
  }

  async publishCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const course = await this.courseService.publishCourse(id)
      
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course published successfully',
        data: course
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to publish course'
      })
    }
  }

  async archiveCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const course = await this.courseService.archiveCourse(id)
      
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course archived successfully',
        data: course
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to archive course'
      })
    }
  }
}
