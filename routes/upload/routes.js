import express from 'express';
import protect from '../../middleware/auth.js';
import upload from '../../utilities/multer.js';
import uploadImageController from '../../controllers/upload/image.js';

const router = express.Router();

router.post('/image', protect, upload.single('image'), uploadImageController);

export default router;
