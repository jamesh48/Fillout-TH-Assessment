import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
const healthcheckRouter = express.Router();

healthcheckRouter.get('/', async (_req: Request, res: Response) => {
  return res.status(StatusCodes.OK).send({ message: 'App Healthy!' });
});

export default healthcheckRouter;
