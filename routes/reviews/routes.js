import express from 'express';
const router = express.Router();
import { create } from '../../controllers/reviews/create.js';
import { list } from '../../controllers/reviews/list.js';
import { deleteReview } from '../../controllers/reviews/delete.js';

router.post("/create", create);
router.post("/list", list);
router.post("/delete", deleteReview);

export default router;
