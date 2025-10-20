import express from 'express';
import { registerUser, loginUser, getMe} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);

export default router;
