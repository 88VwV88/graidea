import mongoose, { Document, Schema } from 'mongoose'

interface ITeacher extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  yearOfExperience: number
  degreeName: string
  photoUrl: string
  skills: string[]
  salary: number
  coursesEnrolled: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const teacherSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    yearOfExperience: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },
    degreeName: {
      type: String,
      required: true,
      trim: true,
    },
    photoUrl: {
      type: String,
      required: false,
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
      default: [],
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    coursesEnrolled: {
      type: [Schema.Types.ObjectId],
      ref: 'Course',
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
teacherSchema.index({ userId: 1 })
teacherSchema.index({ skills: 1 })
teacherSchema.index({ yearOfExperience: 1 })

const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema)

export default Teacher
export { ITeacher }
