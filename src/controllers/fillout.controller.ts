import { Request, Response } from 'express';
import axios from 'axios';
import { StatusCodes } from 'http-status-codes';
import { config } from '../config';
import { handleError } from '../utils';

const getFormMetadata = async (
  req: Request<{}, {}, { formId: string }>,
  res: Response
) => {
  try {
    const { data } = await axios({
      method: 'GET',
      url: `${config.apiBaseUrl}/v1/api/forms/${req.body.formId}`,
      headers: {
        Authorization: `Bearer ${config.filloutApiKey}`,
      },
    });

    return res.status(StatusCodes.OK).json({ data });
  } catch (err) {
    return handleError(res, err);
  }
};

const submissions = async (req: Request<{ formId: string }>, res: Response) => {
  try {
    const { data } = await axios({
      method: 'GET',
      url: `${config.apiBaseUrl}/v1/api/forms/${req.params.formId}/submissions`,
      headers: {
        Authorization: `Bearer ${config.filloutApiKey}`,
      },
    });

    return res.status(StatusCodes.OK).json({ data });
  } catch (err) {
    return handleError(res, err);
  }
};

export const FilloutController = {
  getFormMetadata,
  submissions,
};
