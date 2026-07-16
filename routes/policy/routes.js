import express from 'express';
import { getpolicy } from '../../controllers/policy/getpolicy.js';
import { updatepolicy } from '../../controllers/policy/updatepolicy.js';
import helper from '../../utilities/helper.js';

const router = express.Router();

// Public route to fetch policy
router.post('/get', getpolicy);

// Protected route to update policy
router.post('/update', helper.authenticateToken, updatepolicy);

export default router;
