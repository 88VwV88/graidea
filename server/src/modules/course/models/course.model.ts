import mongoose, { Document, Schema } from 'mongoose'

interface ICourse extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  description: string
  imageLink: string
  price: number
  assignedTeachers: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const courseSchema: Schema = new Schema(
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
    imageLink: {
      type: String,
      required: false,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    assignedTeachers: {
      type: [Schema.Types.ObjectId],
      ref: 'Teacher',
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
courseSchema.index({ title: 1 })
courseSchema.index({ price: 1 })
courseSchema.index({ assignedTeachers: 1 })
courseSchema.index({ createdAt: -1 })

const Course = mongoose.model<ICourse>('Course', courseSchema)

export default Course
export { ICourse }
