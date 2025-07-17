import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    title: { type: String, required: true }
  }],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
})

orderSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v

    if (Array.isArray(ret.products)) {
      ret.products = ret.products.map(({ _id, ...product }) => product)
    }

    return ret
  }
})

export const Order = mongoose.model('Order', orderSchema)
