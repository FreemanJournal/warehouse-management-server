import express from 'express';
import { createItem, getItems } from '../controllers/Items.js';

const router = express.Router();
router.get('/', getItems)
router.post('/', createItem);
export default router;