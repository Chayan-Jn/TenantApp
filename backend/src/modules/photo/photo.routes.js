import { Router } from 'express';
import multer from 'multer';
import { protect } from '../auth/auth.middleware.js';
import * as photoController from './photo.controller.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

router.use(protect);

router.get('/:unitId/photos', photoController.getPhotos);
router.post('/:unitId/photos', upload.single('photo'), photoController.uploadPhoto);
router.delete('/:unitId/photos/:photoId', photoController.deletePhoto);

export default router;
