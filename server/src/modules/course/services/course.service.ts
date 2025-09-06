import { CourseRepository } from '../repository'
import { ICourse } from '../types'
import mongoose from 'mongoose'

export class CourseService {
  private courseRepository: CourseRepository

  constructor() {
    this.courseRepository = new CourseRepository()
  }

  async createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
    // Validate instructor exists
    if (!courseData.instructor) {
      throw new Error('Instructor is required')
    }

    // Set default values
    const newCourseData = {
      ...courseData,
      enrolledCount: 0,
      rating: 0,
      totalRatings: 0,
      status: courseData.status || 'draft'
    }

    return await this.courseRepository.create(newCourseData)
  }

  async getCourseById(id: string): Promise<ICourse | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid course ID')
    }
    return await this.courseRepository.findById(id)
  }

  async getAllCourses(filters: any = {}): Promise<ICourse[]> {
    return await this.courseRepository.findAll(filters)
  }

  async updateCourse(id: string, updateData: Partial<ICourse>): Promise<ICourse | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid course ID')
    }

    // Don't allow updating enrolledCount directly
    const { enrolledCount, ...allowedUpdates } = updateData
    return await this.courseRepository.updateById(id, allowedUpdates)
  }

  async deleteCourse(id: string): Promise<ICourse | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid course ID')
    }
    return await this.courseRepository.deleteById(id)
  }

  async getCoursesByInstructor(instructorId: string): Promise<ICourse[]> {
    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      throw new Error('Invalid instructor ID')
    }
    return await this.courseRepository.findByInstructor(instructorId)
  }

  async getCoursesByCategory(category: string): Promise<ICourse[]> {
    return await this.courseRepository.findByCategory(category)
  }

  async getCoursesByDifficulty(difficulty: string): Promise<ICourse[]> {
    return await this.courseRepository.findByDifficulty(difficulty)
  }

  async searchCourses(query: string): Promise<ICourse[]> {
    if (!query || query.trim().length === 0) {
      return await this.courseRepository.findAll({ status: 'published' })
    }
    return await this.courseRepository.searchCourses(query.trim())
  }

  async enrollStudentInCourse(courseId: string, studentId: string): Promise<ICourse | null> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID')
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new Error('Invalid student ID')
    }

    // Check if course exists and is published
    const course = await this.courseRepository.findById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }
    if (course.status !== 'published') {
      throw new Error('Course is not available for enrollment')
    }

    return await this.courseRepository.enrollStudent(courseId, studentId)
  }

  async unenrollStudentFromCourse(courseId: string, studentId: string): Promise<ICourse | null> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID')
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new Error('Invalid student ID')
    }

    return await this.courseRepository.unenrollStudent(courseId, studentId)
  }

  async rateCourse(courseId: string, rating: number): Promise<ICourse | null> {
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error('Invalid course ID')
    }
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    return await this.courseRepository.updateRating(courseId, rating)
  }

  async publishCourse(id: string): Promise<ICourse | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid course ID')
    }

    const course = await this.courseRepository.findById(id)
    if (!course) {
      throw new Error('Course not found')
    }

    // Validate course has required fields for publishing
    if (!course.title || !course.description || !course.curriculum || course.curriculum.length === 0) {
      throw new Error('Course must have title, description, and curriculum to be published')
    }

    return await this.courseRepository.updateById(id, { status: 'published' })
  }

  async archiveCourse(id: string): Promise<ICourse | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid course ID')
    }

    return await this.courseRepository.updateById(id, { status: 'archived' })
  }
}
