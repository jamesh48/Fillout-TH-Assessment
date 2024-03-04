import { Router } from 'express';

import filloutRouter from './fillout.router';
import healthcheckRouter from './healthcheck.router';

const router = Router();

router.use('/healthcheck', healthcheckRouter);
router.use('/', filloutRouter);

export default router;
