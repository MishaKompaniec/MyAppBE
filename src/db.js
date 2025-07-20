import mongoose from 'mongoose'

export async function connectToDB() {
  try {
    const isProduction = process.env.NODE_ENV === 'production'
    const mongoUri = isProduction
      ? process.env.MONGODB_URI
      : process.env.MONGODB_URI_LOCAL

    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  }
}
