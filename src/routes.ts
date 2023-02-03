import { Router } from 'express';
import { incomingMessageController } from './controllers/incomingMessage';
import { messageStatusController } from './controllers/messageStatus';
import { sendApprovalMessageController } from './controllers/sendApprovalMessage';

// create express router
const router = Router();

/** Health check route */
router.get('/health-check', (req, res) => res.send('OK'));

router.post('/sendApprovalMessage', sendApprovalMessageController);

router.post('/messageStatus', messageStatusController);
router.post('/incomingMessage', incomingMessageController);

export default router;
