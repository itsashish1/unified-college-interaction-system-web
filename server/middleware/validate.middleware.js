import { validationResult, body, param, query } from 'express-validator';

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Auth Validators ───────────────────────────────────────────
export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name too long'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['student', 'club_admin', 'faculty', 'admin']).withMessage('Invalid role'),
  body('department').optional().trim().isLength({ max: 100 }),
  body('year').optional().trim(),
  body('enrollmentNo').optional().trim(),
];

export const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const microsoftRules = [
  body('code').notEmpty().withMessage('Authorization code is required'),
];

// ─── Club Validators ───────────────────────────────────────────
export const createClubRules = [
  body('name').trim().notEmpty().withMessage('Club name is required').isLength({ max: 150 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2000 }),
  body('category').isIn(['technical', 'cultural', 'social', 'sports']).withMessage('Invalid category'),
];

// ─── Event Validators ──────────────────────────────────────────
export const createEventRules = [
  body('title').trim().notEmpty().withMessage('Event title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['workshop', 'seminar', 'competition', 'cultural', 'sports']).withMessage('Invalid category'),
  body('venue').trim().notEmpty().withMessage('Venue is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
];

// ─── Forum Validators ──────────────────────────────────────────
export const createPostRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 300 }),
  body('content').trim().notEmpty().withMessage('Content is required').isLength({ max: 10000 }),
  body('category').optional().isIn(['general', 'academic', 'events', 'complaints']).withMessage('Invalid category'),
  body('tags').optional().isArray({ max: 10 }).withMessage('Max 10 tags allowed'),
];

export const replyRules = [
  body('content').trim().notEmpty().withMessage('Reply content is required').isLength({ max: 5000 }),
];

// ─── Announcement Validators ───────────────────────────────────
export const createAnnouncementRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 300 }),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category').optional().isIn(['academic', 'exam', 'holiday', 'placement', 'general']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
];

// ─── Support Validators ────────────────────────────────────────
export const createTicketRules = [
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 5000 }),
  body('category').isIn(['technical', 'academic', 'registration', 'account', 'other']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
];

export const ticketReplyRules = [
  body('message').trim().notEmpty().withMessage('Reply message is required').isLength({ max: 5000 }),
];

export const updateTicketStatusRules = [
  body('status').isIn(['open', 'in_progress', 'resolved', 'closed']).withMessage('Invalid status'),
];

// ─── Faculty Validators ────────────────────────────────────────
export const createFacultyRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('designation').trim().notEmpty().withMessage('Designation is required'),
];

// ─── Common Validators ─────────────────────────────────────────
export const mongoIdParam = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];

export const paginationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100').toInt(),
];
