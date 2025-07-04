import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Create uploads directory if not exists
const uploadPath = path.join('uploads')
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath)
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, uniqueName)
  }
})

// File filter (only images/videos allowed)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, MP4, and WEBM allowed.'))
  }
}

export const upload = multer({ storage, fileFilter })

// Upload handler
export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  const fileUrl = `/uploads/${req.file.filename}` // For static serving
  res.status(200).json({ message: 'Upload successful', fileUrl })
}
