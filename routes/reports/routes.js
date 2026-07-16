import express from 'express';
import helper from '../../utilities/helper.js';
import { summary } from '../../controllers/reports/summary.js';

const router = express.Router();

router.get('/summary', helper.authenticateToken, summary);

export default router;
