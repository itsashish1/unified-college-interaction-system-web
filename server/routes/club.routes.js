import express from 'express';
import { getClubs, getClub, createClub, updateClub, deleteClub, joinClub, leaveClub } from '../controllers/club.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate, createClubRules, mongoIdParam, paginationRules } from '../middleware/validate.middleware.js';

const router = express.Router();

router.get('/', paginationRules, validate, getClubs);
router.get('/:id', mongoIdParam, validate, getClub);
router.post('/', protect, authorize('admin', 'club_admin'), createClubRules, validate, createClub);
router.put('/:id', protect, authorize('admin', 'club_admin'), mongoIdParam, validate, updateClub);
router.delete('/:id', protect, authorize('admin'), mongoIdParam, validate, deleteClub);
router.post('/:id/join', protect, mongoIdParam, validate, joinClub);
router.post('/:id/leave', protect, mongoIdParam, validate, leaveClub);

export default router;
