import express, { NextFunction, Request, Response } from 'express';
import { config } from '../config';
import { FilloutController } from '../controllers/fillout.controller';
const filloutRouter = express.Router();

filloutRouter.use('*', (req: Request, _res: Response, next: NextFunction) => {
  req.body.formId = config.demoFormId;
  next();
});

filloutRouter.get('/formMetadata', FilloutController.getFormMetadata);

filloutRouter.get('/:formId/filteredResponses', FilloutController.submissions);

export default filloutRouter;
