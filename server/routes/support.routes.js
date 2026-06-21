import express from 'express';
import { getTickets, getTicket, createTicket, replyToTicket, updateTicketStatus } from '../controllers/support.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validate, createTicketRules, ticketReplyRules, updateTicketStatusRules, mongoIdParam, paginationRules } from '../middleware/validate.middleware.js';

const router = express.Router();

router.get('/', protect, paginationRules, validate, getTickets);
router.get('/:id', protect, mongoIdParam, validate, getTicket);
router.post('/', protect, createTicketRules, validate, createTicket);
router.post('/:id/reply', protect, mongoIdParam, ticketReplyRules, validate, replyToTicket);
router.put('/:id/status', protect, authorize('admin'), mongoIdParam, updateTicketStatusRules, validate, updateTicketStatus);

export default router;
