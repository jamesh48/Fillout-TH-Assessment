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

const submissions = async (
  req: Request<
    { formId: string },
    {},
    {},
    {
      filters: string;
      limit: number;
      afterDate: string;
      beforeDate: string;
      offset: number;
      sort: 'asc' | 'desc';
      status: 'in_progress' | 'finished';
      includeEditLink: true;
    }
  >,
  res: Response
) => {
  try {
    let { filters, limit, offset, ...params } = req.query;

    limit = Number(limit);
    offset = Number(offset);
    if (isNaN(limit)) {
      limit = 150;
    }

    if (isNaN(offset)) {
      offset = 0;
    }

    if (filters) {
      if (limit > 150 || limit < 0) {
        return res.status(400).send({ error: 'Invalid Limit' });
      }

      if (offset > 150 || offset < 0) {
        return res.status(400).send({ error: 'Invalid Offset' });
      }
    }
    const { data } = await axios<{
      totalResponses: number;
      pageCount: number;
      responses: { questions: Question[] }[];
    }>({
      method: 'GET',
      url: `${config.apiBaseUrl}/v1/api/forms/${req.params.formId}/submissions`,
      params: {
        ...params,
        // If Filters are defined, this proxy server assumes control of pagination, otherwise it just proxies the existing query
        ...(() => {
          if (filters) {
            return {};
          }

          return { offset, limit };
        })(),
      },
      headers: {
        Authorization: `Bearer ${config.filloutApiKey}`,
      },
    });

    if (filters) {
      const conditions = JSON.parse(filters as string) as Filter[];

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

      data.totalResponses = result.length;

      data.pageCount = (() => {
        if (limit) {
          return Math.ceil(result.length / limit);
        }
        return Math.ceil(result.length / 150);
      })();

      data.responses = (() => {
        if (offset && limit) {
          return result.slice(offset, offset + limit);
        }

        if (offset) {
          return result.slice(offset);
        }

        if (limit) {
          return result.slice(0, limit);
        }
        return result;
      })();
      // Current Page would also conceivably be possible
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
