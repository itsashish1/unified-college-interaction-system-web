import express from 'express';
import {
  getPlacements,
  getPlacementById,
  createPlacement,
  updatePlacement,
  deletePlacement,
  applyToPlacement
} from '../controllers/placement.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes - anyone can browse opportunities
router.get('/', getPlacements);
router.get('/:id', getPlacementById);

// Student routes - must be logged in to apply
router.post('/:id/apply', protect, applyToPlacement);

// Admin / Faculty routes
router.post('/', protect, authorize('admin', 'faculty'), createPlacement);
router.put('/:id', protect, authorize('admin', 'faculty'), updatePlacement);
router.delete('/:id', protect, authorize('admin', 'faculty'), deletePlacement);

export default router;
