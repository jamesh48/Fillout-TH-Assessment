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

interface Filter {
  id: string;
  condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
  value: string;
}

interface Question {
  id: string;
  name: string;
  type: string;
  value: string;
}

const submissions = async (req: Request<{ formId: string }>, res: Response) => {
  try {
    const { data } = await axios<{ responses: { questions: Question[] }[] }>({
      method: 'GET',
      url: `${config.apiBaseUrl}/v1/api/forms/${req.params.formId}/submissions`,
      headers: {
        Authorization: `Bearer ${config.filloutApiKey}`,
      },
    });
    if (req.query.filters) {
      const conditions = JSON.parse(req.query.filters as string) as Filter[];

      const result = data.responses.filter((response) => {
        return conditions.every((condition) => {
          const question = response.questions.find(
            (question) => question.id === condition.id
          );
          if (!question) {
            return false;
          }
          if (condition.condition === 'equals') {
            return question.value === condition.value;
          } else if (condition.condition === 'does_not_equal') {
            return question.value !== condition.value;
          } else if (condition.condition === 'greater_than') {
            return new Date(question.value) > new Date(condition.value);
          } else if (condition.condition === 'less_than') {
            return new Date(question.value) < new Date(condition.value);
          } else {
            return false;
          }
        });
      });

      data.responses = result;
    }
    return res.status(StatusCodes.OK).json({ data });
  } catch (err) {
    return handleError(res, err);
  }
};

export const FilloutController = {
  getFormMetadata,
  submissions,
};
