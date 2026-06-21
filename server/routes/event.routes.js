import express from 'express';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent, registerForEvent, unregisterFromEvent } from '../controllers/event.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate, createEventRules, mongoIdParam, paginationRules } from '../middleware/validate.middleware.js';

const router = express.Router();

router.get('/', paginationRules, validate, getEvents);
router.get('/:id', mongoIdParam, validate, getEvent);
router.post('/', protect, authorize('admin', 'club_admin', 'faculty'), createEventRules, validate, createEvent);
router.put('/:id', protect, authorize('admin', 'club_admin', 'faculty'), mongoIdParam, validate, updateEvent);
router.delete('/:id', protect, authorize('admin'), mongoIdParam, validate, deleteEvent);
router.post('/:id/register', protect, mongoIdParam, validate, registerForEvent);
router.post('/:id/unregister', protect, mongoIdParam, validate, unregisterFromEvent);

export default router;
