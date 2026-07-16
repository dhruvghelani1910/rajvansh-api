import express from 'express';
import helper from '../../utilities/helper.js';

import { create } from '../../controllers/instagram/create.js';
import { list, clientList } from '../../controllers/instagram/list.js';
import { remove } from '../../controllers/instagram/delete.js';
import { changestatus } from '../../controllers/instagram/changestatus.js';

const router = express.Router();

router.get('/', clientList); // Public fetch
router.post('/', helper.authenticateToken, list); // Admin fetch
router.post('/create', helper.authenticateToken, create);
router.post('/delete', helper.authenticateToken, remove);
router.post('/changestatus', helper.authenticateToken, changestatus);

export default router;
