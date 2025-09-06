import mongoose, { Document, Schema } from 'mongoose'
import { IUser } from '../../user/models/user.model'

// Learning field options
export const LearningField = [
  'software development',
  'data analytics',
  'cybersecurity',
  'artificial intelligence',
  'machine learning',
  'web development',
  'mobile development',
  'devops',
  'cloud computing',
  'database administration'
] as const



export type LearningFieldType = (typeof LearningField)[number]

// Social media links interface
interface ISocialMediaLinks {
  linkedin?: string
  github?: string
}

// Student interface extending IUser
interface IStudent extends IUser {
  city: string
  learningField: LearningFieldType
  socialMediaLinks: ISocialMediaLinks
  bio?: string
  skills?: string[]
  experience?: string
  education?: string
  availability?: 'available' | 'busy' | 'looking for opportunities'
  courses?: mongoose.Types.ObjectId[]
}

// Social media links schema
const socialMediaLinksSchema = new Schema({
  linkedin: { type: String },
  github: { type: String },
}, { _id: false })

// Student schema
const studentSchema: Schema = new Schema(
  {
    // All IUser fields are inherited through the base user schema
    city: {
      type: String,
      required: true,
      trim: true
    },
    learningField: {
      type: String,
      enum: LearningField,
      required: true
    },
    socialMediaLinks: {
      type: socialMediaLinksSchema,
      default: {}
    },
    bio: {
      type: String,
      maxlength: 500,
      trim: true
    },
    skills: [{
      type: String,
      trim: true
    }],
    experience: {
      type: String,
      trim: true
    },
    education: {
      type: String,
      trim: true
    },
    availability: {
      type: String,
      enum: ['available', 'busy', 'looking for opportunities'],
      default: 'available'
    },
    courses: [{
      type: Schema.Types.ObjectId,
      ref: 'Course'
    }]
  },
  {
    timestamps: true,
  }
)

// Create the Student model
const Student = mongoose.model<IStudent>('Student', studentSchema)

export default Student
export { IStudent, ISocialMediaLinks }
