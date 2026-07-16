import express from 'express';
import multer from 'multer';
import helper from '../../utilities/helper.js';

import { create } from '../../controllers/order/create.js';
import { getone } from '../../controllers/order/getone.js';
import { createRazorpayOrder } from '../../controllers/order/razorpay.js';
import { verifyPayment } from '../../controllers/order/verify.js';
import { list } from '../../controllers/order/list.js';
import { woplist } from '../../controllers/order/woplist.js';
import { remove } from '../../controllers/order/delete.js';
import { changestatus } from '../../controllers/order/changestatus.js';

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// For product, allow multiple uploads. For others, single.
const uploadMiddleware = ('order' === 'product') 
  ? upload.fields([{ name: 'main_image', maxCount: 1 }, { name: 'productimage', maxCount: 10 }])
  : upload.single('image');

router.get('/', woplist); // Public fetch
router.post('/', list); // Admin paginated
router.post('/create', uploadMiddleware, create); // Create/Update
router.post('/create-razorpay-order', helper.authenticateToken, createRazorpayOrder);
router.post('/verify-payment', helper.authenticateToken, verifyPayment);
router.post('/getone', getone);
router.post('/delete', remove);
router.post('/changestatus', changestatus);

export default router;
