import { Request, Response } from 'express'
import Teacher from '../models/teacher.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export class TeacherController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        password,
        phone,
        city,
        experienceYears,
        graduationDegree,
        topSkills,
        specialization,
        bio,
        languages
      } = req.body

      // Check if teacher already exists
      const existingTeacher = await Teacher.findOne({ email })
      if (existingTeacher) {
        res.status(400).json({
          success: false,
          message: 'Teacher already exists with this email'
        })
        return
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Generate unique teacher ID
      const teacherId = `TCH${Date.now()}${Math.random().toString(36).substr(2, 5)}`

      // Create new teacher
      const teacher = new Teacher({
        name,
        email,
        password: hashedPassword,
        phone,
        roles: ['teacher'],
        teacherId,
        city,
        experienceYears,
        graduationDegree,
        topSkills: topSkills || [],
        specialization: specialization || [],
        bio,
        languages: languages || [],
        availability: {
          timezone: 'UTC',
          availableHours: []
        },
        earnings: {
          totalEarnings: 0,
          pendingEarnings: 0,
          paidEarnings: 0
        }
      })

      await teacher.save()

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: teacher._id, 
          email: teacher.email, 
          roles: teacher.roles 
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      )

      res.status(201).json({
        success: true,
        message: 'Teacher registered successfully',
        data: {
          teacher: {
            _id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            teacherId: teacher.teacherId,
            city: teacher.city,
            experienceYears: teacher.experienceYears,
            graduationDegree: teacher.graduationDegree,
            topSkills: teacher.topSkills,
            specialization: teacher.specialization,
            bio: teacher.bio,
            languages: teacher.languages,
            status: teacher.status,
            isVerified: teacher.isVerified,
            rating: teacher.rating,
            totalStudents: teacher.totalStudents,
            totalCourses: teacher.totalCourses
          },
          token
        }
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to register teacher'
      })
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body

      // Find teacher by email
      const teacher = await Teacher.findOne({ email })
      if (!teacher) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
        return
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, teacher.password)
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        })
        return
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: teacher._id, 
          email: teacher.email, 
          roles: teacher.roles 
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      )

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          teacher: {
            _id: teacher._id,
            name: teacher.name,
            email: teacher.email,
            teacherId: teacher.teacherId,
            city: teacher.city,
            experienceYears: teacher.experienceYears,
            graduationDegree: teacher.graduationDegree,
            topSkills: teacher.topSkills,
            specialization: teacher.specialization,
            bio: teacher.bio,
            languages: teacher.languages,
            status: teacher.status,
            isVerified: teacher.isVerified,
            rating: teacher.rating,
            totalStudents: teacher.totalStudents,
            totalCourses: teacher.totalCourses
          },
          token
        }
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to login'
      })
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const teacherId = (req as any).user?.id
      
      const teacher = await Teacher.findById(teacherId)
      if (!teacher) {
        res.status(404).json({
          success: false,
          message: 'Teacher not found'
        })
        return
      }

      res.status(200).json({
        success: true,
        data: {
          _id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          teacherId: teacher.teacherId,
          city: teacher.city,
          experienceYears: teacher.experienceYears,
          graduationDegree: teacher.graduationDegree,
          topSkills: teacher.topSkills,
          specialization: teacher.specialization,
          bio: teacher.bio,
          languages: teacher.languages,
          status: teacher.status,
          isVerified: teacher.isVerified,
          rating: teacher.rating,
          totalStudents: teacher.totalStudents,
          totalCourses: teacher.totalCourses,
          availability: teacher.availability,
          socialLinks: teacher.socialLinks,
          certifications: teacher.certifications,
          earnings: teacher.earnings
        }
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get profile'
      })
    }
  }
}
