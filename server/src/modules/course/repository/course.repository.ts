import { Course } from '../models'
import { ICourse } from '../types'
import mongoose from 'mongoose'

export class CourseRepository {
  async create(courseData: Partial<ICourse>): Promise<ICourse> {
    const course = new Course(courseData)
    return await course.save()
  }

  async findById(id: string): Promise<ICourse | null> {
    return await Course.findById(id)
      .populate('instructor', 'name email profileImageUrl')
      .populate('students', 'name email city learningField')
  }

  async findAll(filters: any = {}): Promise<ICourse[]> {
    return await Course.find(filters)
      .populate('instructor', 'name email profileImageUrl')
      .populate('students', 'name email city learningField')
      .sort({ createdAt: -1 })
  }

  async updateById(id: string, updateData: Partial<ICourse>): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(id, updateData, { new: true })
      .populate('instructor', 'name email profileImageUrl')
      .populate('students', 'name email city learningField')
  }

  async deleteById(id: string): Promise<ICourse | null> {
    return await Course.findByIdAndDelete(id)
  }

  async findByInstructor(instructorId: string): Promise<ICourse[]> {
    return await Course.find({ instructor: instructorId })
      .populate('instructor', 'name email profileImageUrl')
      .populate('students', 'name email city learningField')
      .sort({ createdAt: -1 })
  }

  async findByCategory(category: string): Promise<ICourse[]> {
    return await Course.find({ category, status: 'published' })
      .populate('instructor', 'name email profileImageUrl')
      .sort({ createdAt: -1 })
  }

  async findByDifficulty(difficulty: string): Promise<ICourse[]> {
    return await Course.find({ difficulty, status: 'published' })
      .populate('instructor', 'name email profileImageUrl')
      .sort({ createdAt: -1 })
  }

  async searchCourses(query: string): Promise<ICourse[]> {
    return await Course.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ],
      status: 'published'
    })
      .populate('instructor', 'name email profileImageUrl')
      .sort({ createdAt: -1 })
  }

  async enrollStudent(courseId: string, studentId: string): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(
      courseId,
      { 
        $addToSet: { students: studentId },
        $inc: { enrolledCount: 1 }
      },
      { new: true }
    )
  }

  async unenrollStudent(courseId: string, studentId: string): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(
      courseId,
      { 
        $pull: { students: studentId },
        $inc: { enrolledCount: -1 }
      },
      { new: true }
    )
  }

  async updateRating(courseId: string, rating: number): Promise<ICourse | null> {
    const course = await Course.findById(courseId)
    if (!course) return null

    const newTotalRatings = (course.totalRatings || 0) + 1
    const newRating = ((course.rating || 0) * (course.totalRatings || 0) + rating) / newTotalRatings

    return await Course.findByIdAndUpdate(
      courseId,
      { 
        rating: Math.round(newRating * 10) / 10,
        totalRatings: newTotalRatings
      },
      { new: true }
    )
  }
}
