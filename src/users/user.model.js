import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  fullName: {
    type: String,
    default: '',
    maxlength: [50, 'Full Name cannot be longer than 50 characters']
  },
  phoneNumber: { type: String, default: '' }
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)
