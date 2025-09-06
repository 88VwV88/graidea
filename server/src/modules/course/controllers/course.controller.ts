import { Request, Response } from 'express'
import { Course } from '../models'
import mongoose from 'mongoose'

export class CourseController {
  // Create a new course
  createCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, price } = req.body
      
      // Debug: Log the request body to understand the structure
      console.log('Request body:', req.body)
      console.log('assignedTeachers type:', typeof req.body.assignedTeachers)
      console.log('assignedTeachers value:', req.body.assignedTeachers)
      
      // Handle assignedTeachers array from FormData
      let assignedTeachers: string[] = []
      if (req.body.assignedTeachers) {
        // If it's already an array, use it directly
        if (Array.isArray(req.body.assignedTeachers)) {
          assignedTeachers = req.body.assignedTeachers
        } else {
          // If it's an object with indexed keys, convert to array
          assignedTeachers = Object.values(req.body.assignedTeachers) as string[]
        }
      }
      
      console.log('Processed assignedTeachers:', assignedTeachers)

      // Get image URL from uploaded file
      let imageLink: string | undefined;
      if (req.file) {
        imageLink = (req.file as any).location; // S3 file location
      }

      // Validate assignedTeachers if provided
      if (assignedTeachers && assignedTeachers.length > 0) {
        const validTeacherIds = assignedTeachers.filter((id: string) => 
          mongoose.Types.ObjectId.isValid(id)
        )
        
        if (validTeacherIds.length !== assignedTeachers.length) {
          res.status(400).json({
            success: false,
            message: 'Invalid teacher IDs provided',
          })
          return
        }
      }

      const course = new Course({
        title,
        description,
        imageLink,
        price: Number(price),
        assignedTeachers: assignedTeachers || [],
      })

      const savedCourse = await course.save()

      // Populate assigned teachers for response
      const populatedCourse = await Course.findById(savedCourse._id)
        .populate('assignedTeachers', 'userId yearOfExperience degreeName skills salary')
        .populate({
          path: 'assignedTeachers',
          populate: {
            path: 'userId',
            select: 'name email phone profileImageUrl'
          }
        })

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: populatedCourse,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create course',
      })
    }
  }

  // Get all courses
  getAllCourses = async (req: Request, res: Response): Promise<void> => {
    try {
      const courses = await Course.find()
        .populate('assignedTeachers', 'userId yearOfExperience degreeName skills salary')
        .populate({
          path: 'assignedTeachers',
          populate: {
            path: 'userId',
            select: 'name email phone profileImageUrl'
          }
        })
        .sort({ createdAt: -1 })

      res.status(200).json({
        success: true,
        message: 'Courses retrieved successfully',
        data: courses,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve courses',
      })
    }
  }

  // Get course by ID
  getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course ID',
        })
        return
      }

      const course = await Course.findById(id)
        .populate('assignedTeachers', 'userId yearOfExperience degreeName skills salary')
        .populate({
          path: 'assignedTeachers',
          populate: {
            path: 'userId',
            select: 'name email phone profileImageUrl'
          }
        })

      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found',
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course retrieved successfully',
        data: course,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve course',
      })
    }
  }

  // Update course
  updateCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const updateData = req.body

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course ID',
        })
        return
      }

      // Validate assignedTeachers if provided
      if (updateData.assignedTeachers && updateData.assignedTeachers.length > 0) {
        const validTeacherIds = updateData.assignedTeachers.filter((id: string) => 
          mongoose.Types.ObjectId.isValid(id)
        )
        
        if (validTeacherIds.length !== updateData.assignedTeachers.length) {
          res.status(400).json({
            success: false,
            message: 'Invalid teacher IDs provided',
          })
          return
        }
      }

      const course = await Course.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .populate('assignedTeachers', 'userId yearOfExperience degreeName skills salary')
        .populate({
          path: 'assignedTeachers',
          populate: {
            path: 'userId',
            select: 'name email phone profileImageUrl'
          }
        })

      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found',
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: course,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update course',
      })
    }
  }

  // Delete course
  deleteCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course ID',
        })
        return
      }

      const course = await Course.findByIdAndDelete(id)

      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found',
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course deleted successfully',
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete course',
      })
    }
  }
}
