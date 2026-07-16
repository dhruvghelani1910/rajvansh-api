import express from 'express';
import { getall } from '../../controllers/users/getall.js';
import { sync } from '../../controllers/users/sync.js';
import { getone } from '../../controllers/users/getone.js';
import { update } from '../../controllers/users/update.js';
import { orders } from '../../controllers/users/orders.js';
import helper from '../../utilities/helper.js';

const router = express.Router();

router.post('/getall', helper.authenticateToken, getall);
router.post('/sync', helper.authenticateToken, sync);
router.post('/getone', helper.authenticateToken, getone);
router.post('/update', helper.authenticateToken, update);
router.post('/orders', helper.authenticateToken, orders);

export default router;
