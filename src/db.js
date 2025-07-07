import mongoose from 'mongoose'

export async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  }
}
