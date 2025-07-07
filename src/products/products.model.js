import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const productsItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: () => uuidv4() },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id
      return ret
    }
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id
      return ret
    }
  }
})

export const ProductItem = mongoose.model('ProductItem', productsItemSchema)
