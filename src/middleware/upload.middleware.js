import AWS from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'

export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'flower-product-images',
    key: (req, file, cb) => {
      const ext = file.originalname.split('.').pop()
      cb(null, Date.now().toString() + '.' + ext)
    },
  }),
})
