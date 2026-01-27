// ============================================
// src/routes/intentionRoutes.ts
// ============================================

import { Router } from 'express';
import { IntentionController } from '../controllers/intentionController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/', IntentionController.create);
router.get('/', IntentionController.getAll);
router.get('/dashboard', IntentionController.getDashboard);

router.patch('/:id', IntentionController.update);
router.post('/:id/accept', IntentionController.accept);
router.delete('/:id', IntentionController.delete);

export default router;
