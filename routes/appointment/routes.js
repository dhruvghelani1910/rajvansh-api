import express from 'express';
import { create } from '../../controllers/appointment/create.js';
import { availableslots } from '../../controllers/appointment/availableslots.js';
import { list } from '../../controllers/appointment/list.js';
import { updatestatus } from '../../controllers/appointment/updatestatus.js';
import { getdailyslots } from '../../controllers/appointment/getdailyslots.js';
import { setdailyslots } from '../../controllers/appointment/setdailyslots.js';

const router = express.Router();

router.post('/create', create);
router.get('/available-slots', availableslots);
router.get('/get', list); // Admin
router.post('/update-status', updatestatus); // Admin
router.get('/daily-slots', getdailyslots); // Admin
router.post('/daily-slots', setdailyslots); // Admin

export default router;
