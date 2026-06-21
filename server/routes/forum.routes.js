import express from 'express';
import { getPosts, getPost, createPost, addReply, upvotePost, deletePost } from '../controllers/forum.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, createPostRules, replyRules, mongoIdParam, paginationRules } from '../middleware/validate.middleware.js';

const router = express.Router();

router.get('/', paginationRules, validate, getPosts);
router.get('/:id', mongoIdParam, validate, getPost);
router.post('/', protect, createPostRules, validate, createPost);
router.post('/:id/reply', protect, mongoIdParam, replyRules, validate, addReply);
router.post('/:id/upvote', protect, mongoIdParam, validate, upvotePost);
router.delete('/:id', protect, mongoIdParam, validate, deletePost);

export default router;
