import express from 'express';
import { getFacultyList, getFaculty, createFaculty, updateFaculty, deleteFaculty } from '../controllers/faculty.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate, createFacultyRules, mongoIdParam, paginationRules } from '../middleware/validate.middleware.js';

const router = express.Router();

router.get('/', paginationRules, validate, getFacultyList);
router.get('/:id', mongoIdParam, validate, getFaculty);
router.post('/', protect, authorize('admin'), createFacultyRules, validate, createFaculty);
router.put('/:id', protect, authorize('admin'), mongoIdParam, validate, updateFaculty);
router.delete('/:id', protect, authorize('admin'), mongoIdParam, validate, deleteFaculty);

export default router;
