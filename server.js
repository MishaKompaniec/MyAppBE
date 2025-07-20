import dotenv from 'dotenv'
import { createApp } from './src/app.js'
import { connectToDB } from './src/db.js'

dotenv.config()

const PORT = process.env.PORT || 4200
const app = createApp()

app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to DB:', err)
    process.exit(1)
  })
