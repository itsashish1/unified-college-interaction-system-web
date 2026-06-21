import express from 'express';
import { register, login, getMe, microsoftLogin } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, registerRules, loginRules, microsoftRules } from '../middleware/validate.middleware.js';

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/microsoft', microsoftRules, validate, microsoftLogin);
router.get('/me', protect, getMe);

export default router;
