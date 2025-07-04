import express from 'express'
import { upload, uploadFile } from '../controllers/uploadController.js'
import { auth } from '../../middleware/auth.js'

const router = express.Router()

router.post('/file', auth, upload.single('file'), uploadFile)

export default router
