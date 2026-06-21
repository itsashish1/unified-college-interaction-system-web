import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { body } from 'express-validator';
import { uploadResource, getResources, downloadResource, deleteResource } from '../controllers/resource.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';

// Ensure directory exists on startup
const uploadDir = process.env.VERCEL === '1' ? '/tmp/uploads/resources' : 'uploads/resources';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `resource-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Multer Upload Configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDFs, Word, PPTs, and Images are allowed.'));
    }
  }
});

const router = express.Router();

const uploadResourceRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 100 }),
  body('department').trim().notEmpty().withMessage('Department is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 1000 })
];

// Router Mappings
router.get('/', getResources);
router.get('/:id/download', downloadResource);

// Protected routes
router.post(
  '/', 
  protect, 
  upload.single('file'), 
  (err, req, res, next) => {
    // Multer error handler
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  },
  uploadResourceRules, 
  validate, 
  uploadResource
);

router.delete('/:id', protect, deleteResource);

export default router;
