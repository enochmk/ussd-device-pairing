import express from 'express';

import controller from './controllers/ussd.controller';

const router = express.Router();

router.use('/devicePairingUssd', controller);

export default router;
