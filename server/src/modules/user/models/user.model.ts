import mongoose, { Document, Schema } from 'mongoose'
import { RoleType, Role } from '../types'


interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  profileImageUrl: string
  name: string
  email: string
  phone: string
  password: string
  roles: RoleType[]
  deletedAt: string
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: Role,
      required: true,
    },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model<IUser>('User', userSchema)

export default User
export { IUser }


