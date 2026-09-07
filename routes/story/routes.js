import express from 'express';
import multer from 'multer';

import { create } from '../../controllers/story/create.js';
import { getone } from '../../controllers/story/getone.js';
import { list } from '../../controllers/story/list.js';
import { woplist } from '../../controllers/story/woplist.js';
import { remove } from '../../controllers/story/delete.js';
import { changestatus } from '../../controllers/story/changestatus.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = upload.single('image');

router.get('/', woplist);
router.post('/', list);
router.post('/create', uploadMiddleware, create);
router.post('/getone', getone);
router.post('/delete', remove);
router.post('/changestatus', changestatus);

export default router;
