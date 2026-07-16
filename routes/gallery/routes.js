import express from 'express';
import multer from 'multer';
import helper from '../../utilities/helper.js';

import { create } from '../../controllers/gallery/create.js';
import { getone } from '../../controllers/gallery/getone.js';
import { list } from '../../controllers/gallery/list.js';
import { woplist } from '../../controllers/gallery/woplist.js';
import { remove } from '../../controllers/gallery/delete.js';
import { changestatus } from '../../controllers/gallery/changestatus.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// For product, allow multiple uploads. For others, single.
const uploadMiddleware = ('gallery' === 'product') 
  ? upload.fields([{ name: 'main_image', maxCount: 1 }, { name: 'productimage', maxCount: 10 }])
  : upload.single('image');

router.get('/', woplist); // Public fetch
router.post('/', list); // Admin paginated
router.post('/create', uploadMiddleware, create); // Create/Update
router.post('/getone', getone);
router.post('/delete', remove);
router.post('/changestatus', changestatus);

export default router;
