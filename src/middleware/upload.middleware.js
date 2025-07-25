import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

function createS3Uploader(bucketName, keyPrefix = '') {
  return multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      key: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        const userPrefix = req.user?.userId ? `${req.user.userId}-` : ''
        const filename = keyPrefix + userPrefix + Date.now() + '.' + ext
        cb(null, filename)
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed'))
      }
      cb(null, true)
    },
  })
}

export const upload = createS3Uploader('flower-product-images')
export const uploadAvatar = createS3Uploader('flower-user-avatars', 'avatars/')

export function multerErrorHandler(uploadMiddleware) {
  return (req, res, next) => {
    uploadMiddleware(req, res, err => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'Image size exceeds the 2MB limit' })
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ error: 'Only image files are allowed' })
        }
        console.error('❌ Multer error:', err)
        return res.status(400).json({ error: err.message })
      }
      if (err) {
        console.error('❌ Unexpected upload error:', err)
        return res.status(500).json({ error: 'Unexpected upload error' })
      }
      next()
    })
  }
}
