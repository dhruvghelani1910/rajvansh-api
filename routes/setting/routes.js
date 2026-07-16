import express from 'express';
import { getSettings } from '../../controllers/setting/get.js';
import { updateSettings } from '../../controllers/setting/update.js';
import helper from '../../utilities/helper.js';

const router = express.Router();

router.get('/get', getSettings);
router.post('/update', helper.authenticateToken, updateSettings);

export default router;
