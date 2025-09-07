import { Request, Response } from 'express'
import { CourseMeta, Course } from '../models'
import mongoose from 'mongoose'
import { AuthenticatedRequest } from '../../../types'
import { idText } from 'typescript'

export class CourseMetaController {
  // Create a new course meta
  createCourseMeta = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { courseId, title, description, totalWeeks, weeks } = req.body
      const createdBy = req.currentUser
      console.log(createdBy)

      if (!createdBy) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        })
        return
      }

      // Validate courseId
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course ID',
        })
        return
      }

      // Check if course exists
      const course = await Course.findById(courseId)
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found',
        })
        return
      }

      // Check if course meta already exists for this course
      const existingCourseMeta = await CourseMeta.findOne({ courseId })
      if (existingCourseMeta) {
        res.status(400).json({
          success: false,
          message: 'Course meta already exists for this course',
        })
        return
      }

      // Calculate total duration if weeks are provided
      let totalDuration = 0
      if (weeks && Array.isArray(weeks)) {
        totalDuration = weeks.reduce((total: number, week: any) => {
          const weekDuration = week.subTopics?.reduce((subTotal: number, subTopic: any) => 
            subTotal + (subTopic.duration || 0), 0) || 0
          return total + weekDuration
        }, 0)
      }

      const courseMeta = new CourseMeta({
        courseId,
        title,
        description,
        totalWeeks: totalWeeks || (weeks ? weeks.length : 0),
        totalDuration,
        weeks: weeks || [],
        createdBy,
      })

      const savedCourseMeta = await courseMeta.save()

      // Populate the course and createdBy fields
      const populatedCourseMeta = await CourseMeta.findById(savedCourseMeta._id)
        .populate('courseId', 'title description price')
        .populate('createdBy', 'name email')

      res.status(201).json({
        success: true,
        message: 'Course meta created successfully',
        data: populatedCourseMeta,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create course meta',
      })
    }
  }

  // Get all course metas
  getAllCourseMetas = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseMetas = await CourseMeta.find()
        .populate('courseId', 'title description price imageLink')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })

      res.status(200).json({
        success: true,
        message: 'Course metas retrieved successfully',
        data: courseMetas,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve course metas',
      })
    }
  }

  // Get course meta by ID
  getCourseMetaById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course meta ID',
        })
        return
      }

      const courseMeta = await CourseMeta.findById(id)
        .populate('courseId', 'title description price imageLink')
        .populate('createdBy', 'name email')

      if (!courseMeta) {
        res.status(404).json({
          success: false,
          message: 'Course meta not found',
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course meta retrieved successfully',
        data: courseMeta,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve course meta',
      })
    }
  }

  // Get course meta by course ID
  getCourseMetaByCourseId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId } = req.params

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course ID',
        })
        return
      }

      const courseMeta = await CourseMeta.findOne({ courseId })
        .populate('courseId', 'title description price imageLink')
        .populate('createdBy', 'name email')

      if (!courseMeta) {
        res.status(404).json({
          success: false,
          message: 'Course meta not found for this course',
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course meta retrieved successfully',
        data: courseMeta,
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve course meta',
      })
    }
  }

  // Update course meta
  updateCourseMeta = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const updateData = req.body

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course meta ID',
        })
        return
      }

      // Recalculate total duration if weeks are being updated
      if (updateData.weeks && Array.isArray(updateData.weeks)) {
        updateData.totalDuration = updateData.weeks.reduce((total: number, week: any) => {
          const weekDuration = week.subTopics?.reduce((subTotal: number, subTopic: any) => 
            subTotal + (subTopic.duration || 0), 0) || 0
          return total + weekDuration
        }, 0)
      }

      const courseMeta = await CourseMeta.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )
        .populate('courseId', 'title description price imageLink')
        .populate('createdBy', 'name email')

      if (!courseMeta) {
        res.status(404).json({
          success: false,
          message: 'Course meta not found',
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course meta updated successfully',
        data: courseMeta,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update course meta',
      })
    }
  }

  // Add week to course meta
  addWeek = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { weekData } = req.body

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course meta ID',
        })
        return
      }

      const courseMeta = await CourseMeta.findById(id)
      if (!courseMeta) {
        res.status(404).json({
          success: false,
          message: 'Course meta not found',
        })
        return
      }

      // Set week number automatically
      const weekNumber = courseMeta.weeks.length + 1
      weekData.weekNumber = weekNumber

      courseMeta.weeks.push(weekData)
      courseMeta.totalWeeks = courseMeta.weeks.length

      // Recalculate total duration
      courseMeta.totalDuration = courseMeta.weeks.reduce((total, week) => {
        const weekDuration = week.subTopics?.reduce((subTotal, subTopic) => 
          subTotal + (subTopic.duration || 0), 0) || 0
        return total + weekDuration
      }, 0)

      const updatedCourseMeta = await courseMeta.save()

      res.status(200).json({
        success: true,
        message: 'Week added successfully',
        data: updatedCourseMeta,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to add week',
      })
    }
  }

  // Update week in course meta
  updateWeek = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, weekId } = req.params
      const { weekData } = req.body

      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(weekId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course meta ID or week ID',
        })
        return
      }

      const courseMeta = await CourseMeta.findById(id)
      if (!courseMeta) {
        res.status(404).json({
          success: false,
          message: 'Course meta not found',
        })
        return
      }

      const weekIndex = courseMeta.weeks.findIndex(week => week._id.toString() === weekId)
      if (weekIndex === -1) {
        res.status(404).json({
          success: false,
          message: 'Week not found',
        })
        return
      }

      // Update the week
      Object.assign(courseMeta.weeks[weekIndex], weekData)

      // Recalculate total duration
      courseMeta.totalDuration = courseMeta.weeks.reduce((total, week) => {
        const weekDuration = week.subTopics?.reduce((subTotal, subTopic) => 
          subTotal + (subTopic.duration || 0), 0) || 0
        return total + weekDuration
      }, 0)

      const updatedCourseMeta = await courseMeta.save()

      res.status(200).json({
        success: true,
        message: 'Week updated successfully',
        data: updatedCourseMeta,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update week',
      })
    }
  }

  // Delete week from course meta
  deleteWeek = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, weekId } = req.params

      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(weekId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course meta ID or week ID',
        })
        return
      }

      const courseMeta = await CourseMeta.findById(id)
      if (!courseMeta) {
        res.status(404).json({
          success: false,
          message: 'Course meta not found',
        })
        return
      }

      courseMeta.weeks = courseMeta.weeks.filter(week => week._id.toString() !== weekId)
      courseMeta.totalWeeks = courseMeta.weeks.length

      // Recalculate total duration
      courseMeta.totalDuration = courseMeta.weeks.reduce((total, week) => {
        const weekDuration = week.subTopics?.reduce((subTotal, subTopic) => 
          subTotal + (subTopic.duration || 0), 0) || 0
        return total + weekDuration
      }, 0)

      const updatedCourseMeta = await courseMeta.save()

      res.status(200).json({
        success: true,
        message: 'Week deleted successfully',
        data: updatedCourseMeta,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete week',
      })
    }
  }

  // Mark subtopic as completed
  markSubtopicCompleted = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, weekId, subtopicId } = req.params
      const { isCompleted } = req.body

      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(weekId) || !mongoose.Types.ObjectId.isValid(subtopicId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid IDs provided',
        })
        return
      }

      const courseMeta = await CourseMeta.findById(id)
      if (!courseMeta) {
        res.status(404).json({
          success: false,
          message: 'Course meta not found',
        })
        return
      }

      const week = courseMeta.weeks.find(w => w._id.toString() === weekId)
      if (!week) {
        res.status(404).json({
          success: false,
          message: 'Week not found',
        })
        return
      }

      const subtopic = week.subTopics.find(st => st._id.toString() === subtopicId)
      if (!subtopic) {
        res.status(404).json({
          success: false,
          message: 'Sub-topic not found',
        })
        return
      }

      subtopic.isCompleted = isCompleted

      // Check if all subtopics in the week are completed
      const allSubtopicsCompleted = week.subTopics.every(st => st.isCompleted)
      week.isCompleted = allSubtopicsCompleted
      if (allSubtopicsCompleted) {
        week.completedAt = new Date()
      }

      const updatedCourseMeta = await courseMeta.save()

      res.status(200).json({
        success: true,
        message: 'Sub-topic status updated successfully',
        data: updatedCourseMeta,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update sub-topic status',
      })
    }
  }

  // Submit assignment
  submitAssignment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, weekId, assignmentId } = req.params
      const { isSubmitted, submittedAt } = req.body

      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(weekId) || !mongoose.Types.ObjectId.isValid(assignmentId)) {
        res.status(400).json({
          success: false,
          message: 'Invalid IDs provided',
        })
        return
      }

      const courseMeta = await CourseMeta.findById(id)
      if (!courseMeta) {
        res.status(404).json({
          success: false,
          message: 'Course meta not found',
        })
        return
      }

      const week = courseMeta.weeks.find(w => w._id.toString() === weekId)
      if (!week) {
        res.status(404).json({
          success: false,
          message: 'Week not found',
        })
        return
      }

      const assignment = week.assignments.find(a => a._id.toString() === assignmentId)
      if (!assignment) {
        res.status(404).json({
          success: false,
          message: 'Assignment not found',
        })
        return
      }

      assignment.isSubmitted = isSubmitted
      if (isSubmitted) {
        assignment.submittedAt = submittedAt || new Date()
      }

      const updatedCourseMeta = await courseMeta.save()

      res.status(200).json({
        success: true,
        message: 'Assignment submission updated successfully',
        data: updatedCourseMeta,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update assignment submission',
      })
    }
  }

  // Publish course meta
  publishCourseMeta = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course meta ID',
        })
        return
      }

      const courseMeta = await CourseMeta.findByIdAndUpdate(
        id,
        { 
          $set: { 
            isPublished: true, 
            publishedAt: new Date() 
          } 
        },
        { new: true, runValidators: true }
      )
        .populate('courseId', 'title description price imageLink')
        .populate('createdBy', 'name email')

      if (!courseMeta) {
        res.status(404).json({
          success: false,
          message: 'Course meta not found',
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course meta published successfully',
        data: courseMeta,
      })
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to publish course meta',
      })
    }
  }

  // Delete course meta
  deleteCourseMeta = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: 'Invalid course meta ID',
        })
        return
      }

      const courseMeta = await CourseMeta.findByIdAndDelete(id)

      if (!courseMeta) {
        res.status(404).json({
          success: false,
          message: 'Course meta not found',
        })
        return
      }

      res.status(200).json({
        success: true,
        message: 'Course meta deleted successfully',
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete course meta',
      })
    }
  }
}
