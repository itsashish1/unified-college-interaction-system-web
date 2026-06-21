import express from 'express';
import { getAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcement.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate, createAnnouncementRules, mongoIdParam, paginationRules } from '../middleware/validate.middleware.js';

const router = express.Router();

router.get('/', paginationRules, validate, getAnnouncements);
router.get('/:id', mongoIdParam, validate, getAnnouncement);
router.post('/', protect, authorize('admin', 'faculty'), createAnnouncementRules, validate, createAnnouncement);
router.put('/:id', protect, authorize('admin', 'faculty'), mongoIdParam, validate, updateAnnouncement);
router.delete('/:id', protect, authorize('admin'), mongoIdParam, validate, deleteAnnouncement);

export default router;
