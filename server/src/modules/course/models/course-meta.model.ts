import mongoose, { Document, Schema } from 'mongoose'

// Sub-topic interface
interface ISubTopic {
  _id: mongoose.Types.ObjectId
  title: string
  description?: string
  videoUrl?: string
  link?: string // External link for additional resources
  duration?: number // in minutes
  isCompleted?: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

// Assignment interface
interface IAssignment {
  _id: mongoose.Types.ObjectId
  title: string
  description: string
  assignmentUrl?: string
  dueDate?: Date
  maxMarks?: number
  isSubmitted?: boolean
  submittedAt?: Date
  marksObtained?: number
  feedback?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

// Week interface
interface IWeek {
  _id: mongoose.Types.ObjectId
  weekNumber: number
  title: string
  description?: string
  subTopics: ISubTopic[]
  assignments: IAssignment[]
  isCompleted?: boolean
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Course Meta interface
interface ICourseMeta extends Document {
  _id: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  title: string
  description?: string
  totalWeeks: number
  totalDuration?: number // in minutes
  weeks: IWeek[]
  isPublished: boolean
  publishedAt?: Date
  createdBy: mongoose.Types.ObjectId // Teacher/Admin who created this
  createdAt: Date
  updatedAt: Date
}

// Sub-topic schema
const subTopicSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    videoUrl: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          if (!v) return true; // Allow empty values
          return /^https?:\/\/.+/.test(v); // Must be a valid URL
        },
        message: 'Link must be a valid URL starting with http:// or https://'
      }
    },
    duration: {
      type: Number,
      min: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
)

// Assignment schema
const assignmentSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    assignmentUrl: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    maxMarks: {
      type: Number,
      min: 0,
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
    },
    marksObtained: {
      type: Number,
      min: 0,
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
)

// Week schema
const weekSchema: Schema = new Schema(
  {
    weekNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    subTopics: [subTopicSchema],
    assignments: [assignmentSchema],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Course Meta schema
const courseMetaSchema: Schema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    totalWeeks: {
      type: Number,
      required: true,
      min: 1,
    },
    totalDuration: {
      type: Number,
      min: 0,
    },
    weeks: [weekSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
courseMetaSchema.index({ courseId: 1 })
courseMetaSchema.index({ createdBy: 1 })
courseMetaSchema.index({ isPublished: 1 })
courseMetaSchema.index({ createdAt: -1 })

// Virtual for calculating completion percentage
courseMetaSchema.virtual('completionPercentage').get(function () {
  const doc = this as any
  if (!doc.weeks || doc.weeks.length === 0) return 0
  
  const totalSubTopics = doc.weeks.reduce((total: number, week: any) => total + week.subTopics.length, 0)
  const completedSubTopics = doc.weeks.reduce((total: number, week: any) => 
    total + week.subTopics.filter((subTopic: any) => subTopic.isCompleted).length, 0
  )
  
  return totalSubTopics > 0 ? Math.round((completedSubTopics / totalSubTopics) * 100) : 0
})

// Virtual for calculating total assignments
courseMetaSchema.virtual('totalAssignments').get(function () {
  const doc = this as any
  if (!doc.weeks) return 0
  return doc.weeks.reduce((total: number, week: any) => total + week.assignments.length, 0)
})

// Virtual for calculating submitted assignments
courseMetaSchema.virtual('submittedAssignments').get(function () {
  const doc = this as any
  if (!doc.weeks) return 0
  return doc.weeks.reduce((total: number, week: any) => 
    total + week.assignments.filter((assignment: any) => assignment.isSubmitted).length, 0
  )
})

// Ensure virtual fields are serialized
courseMetaSchema.set('toJSON', { virtuals: true })
courseMetaSchema.set('toObject', { virtuals: true })

const CourseMeta = mongoose.model<ICourseMeta>('CourseMeta', courseMetaSchema)

export default CourseMeta
export { ICourseMeta, IWeek, ISubTopic, IAssignment }
