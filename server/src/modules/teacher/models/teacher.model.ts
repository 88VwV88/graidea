import mongoose, { Document, Schema } from 'mongoose'
import { RoleType, Role } from '../../user/types'
import { IUser } from '../../user/models/user.model'

// Teacher status options
export const TeacherStatus = [
  'pending',
  'approved',
  'rejected',
  'suspended',
  'active'
] as const

export type TeacherStatusType = (typeof TeacherStatus)[number]

// Teacher interface
interface ITeacher extends IUser {
  
  // Teacher specific fields
  teacherId: string // Unique teacher identifier
  city: string
  experienceYears: number
  graduationDegree: string
  topSkills: string[]
  courses: mongoose.Types.ObjectId[] // Array of course IDs
  
  // Additional fields for course selling website
  bio?: string
  specialization: string[]
  availability: {
    timezone: string
    availableHours: {
      day: string
      startTime: string
      endTime: string
    }[]
  }
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
    website?: string
  }
  certifications?: {
    name: string
    issuer: string
    date: Date
    credentialId?: string
  }[]
  languages: string[]
  rating: number
  totalRatings: number
  totalStudents: number
  totalCourses: number
  status: TeacherStatusType
  isVerified: boolean
  bankDetails?: {
    accountNumber: string
    bankName: string
    accountHolderName: string
    ifscCode?: string
  }
  earnings: {
    totalEarnings: number
    pendingEarnings: number
    paidEarnings: number
  }
}

// Teacher schema
const teacherSchema: Schema = new Schema(
  {
    
    // Teacher specific fields
    teacherId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    experienceYears: {
      type: Number,
      required: true,
      min: 0,
      max: 50
    },
    graduationDegree: {
      type: String,
      required: true,
      trim: true
    },
    topSkills: [{
      type: String,
      trim: true,
      maxlength: 50
    }],
    courses: [{
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }],
    
    // Additional fields
    bio: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    specialization: [{
      type: String,
      trim: true
    }],
    availability: {
      timezone: {
        type: String,
        required: true,
        default: 'UTC'
      },
      availableHours: [{
        day: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
          required: true
        },
        startTime: {
          type: String,
          required: true
        },
        endTime: {
          type: String,
          required: true
        }
      }]
    },
    socialLinks: {
      linkedin: {
        type: String,
        trim: true
      },
      twitter: {
        type: String,
        trim: true
      },
      github: {
        type: String,
        trim: true
      },
      website: {
        type: String,
        trim: true
      }
    },
    certifications: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      issuer: {
        type: String,
        required: true,
        trim: true
      },
      date: {
        type: Date,
        required: true
      },
      credentialId: {
        type: String,
        trim: true
      }
    }],
    languages: [{
      type: String,
      trim: true
    }],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    totalStudents: {
      type: Number,
      default: 0
    },
    totalCourses: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: TeacherStatus,
      default: 'pending'
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    bankDetails: {
      accountNumber: {
        type: String,
        trim: true
      },
      bankName: {
        type: String,
        trim: true
      },
      accountHolderName: {
        type: String,
        trim: true
      },
      ifscCode: {
        type: String,
        trim: true
      }
    },
    earnings: {
      totalEarnings: {
        type: Number,
        default: 0,
        min: 0
      },
      pendingEarnings: {
        type: Number,
        default: 0,
        min: 0
      },
      paidEarnings: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  {
    timestamps: true,
  }
)

// Create indexes for better performance
teacherSchema.index({ email: 1 })
teacherSchema.index({ teacherId: 1 })
teacherSchema.index({ city: 1 })
teacherSchema.index({ specialization: 1 })
teacherSchema.index({ status: 1 })
teacherSchema.index({ rating: -1 })

// Create the Teacher model
const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema)

export default Teacher
export { ITeacher }
