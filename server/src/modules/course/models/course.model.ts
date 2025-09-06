import mongoose, { Document, Schema } from 'mongoose'

// Course category options
export const CourseCategory = [
  'programming',
  'web development',
  'mobile development',
  'data science',
  'artificial intelligence',
  'machine learning',
  'cybersecurity',
  'devops',
  'cloud computing',
  'database',
  'design',
  'business',
  'marketing'
] as const

export type CourseCategoryType = (typeof CourseCategory)[number]

// Course difficulty levels
export const CourseDifficulty = [
  'beginner',
  'intermediate',
  'advanced'
] as const

export type CourseDifficultyType = (typeof CourseDifficulty)[number]

// Course status
export const CourseStatus = [
  'draft',
  'published',
  'archived'
] as const

export type CourseStatusType = (typeof CourseStatus)[number]

// Course interface
interface ICourse extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  description: string
  category: CourseCategoryType
  difficulty: CourseDifficultyType
  duration: number // in hours
  price: number
  instructor: mongoose.Types.ObjectId
  students: mongoose.Types.ObjectId[]
  thumbnail?: string
  status: CourseStatusType
  tags?: string[]
  prerequisites?: string[]
  learningObjectives?: string[]
  curriculum?: {
    module: string
    lessons: {
      title: string
      duration: number
      type: 'video' | 'text' | 'quiz' | 'assignment'
    }[]
  }[]
  rating?: number
  totalRatings?: number
  enrolledCount: number
}

// Course schema
const courseSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    category: {
      type: String,
      enum: CourseCategory,
      required: true
    },
    difficulty: {
      type: String,
      enum: CourseDifficulty,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    students: [{
      type: Schema.Types.ObjectId,
      ref: 'Student'
    }],
    thumbnail: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: CourseStatus,
      default: 'draft'
    },
    tags: [{
      type: String,
      trim: true
    }],
    prerequisites: [{
      type: String,
      trim: true
    }],
    learningObjectives: [{
      type: String,
      trim: true
    }],
    curriculum: [{
      module: {
        type: String,
        required: true,
        trim: true
      },
      lessons: [{
        title: {
          type: String,
          required: true,
          trim: true
        },
        duration: {
          type: Number,
          required: true,
          min: 1
        },
        type: {
          type: String,
          enum: ['video', 'text', 'quiz', 'assignment'],
          required: true
        }
      }]
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
    enrolledCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
)

// Create the Course model
const Course = mongoose.model<ICourse>('Course', courseSchema)

export default Course
export { ICourse }
