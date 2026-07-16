import express from 'express';
import loginController from '../../controllers/auth/login.js';
import registerController from '../../controllers/auth/register.js';
import adminLoginController from '../../controllers/auth/adminLogin.js';

const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/admin/login', adminLoginController);

export default router;
