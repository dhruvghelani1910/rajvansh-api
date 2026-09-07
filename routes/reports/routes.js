import express from 'express';
import helper from '../../utilities/helper.js';
import { summary } from '../../controllers/reports/summary.js';
import { exportReport } from '../../controllers/reports/export.js';

const router = express.Router();

router.get('/summary', helper.authenticateToken, summary);
router.get('/export', helper.authenticateToken, exportReport);

export default router;
