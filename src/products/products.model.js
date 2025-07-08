import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const productsItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, default: () => uuidv4() },

  title: {
    type: String,
    required: true,
    maxlength: [30, 'Title must be at most 30 characters'],
  },

  price: {
    type: Number,
    required: true,
    max: [100000, 'Price must be at most 100000'],
  },

  description: {
    type: String,
    maxlength: [50, 'Description must be at most 50 characters'],
  },

  category: {
    type: String,
    enum: {
      values: ['bouquets', 'plants', 'fruitBouquets'],
      message: 'Category must be one of: bouquets, plants, fruitBouquets'
    },
  },
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
