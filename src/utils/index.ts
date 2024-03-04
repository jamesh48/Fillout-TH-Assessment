import { Response } from 'express';
import { AxiosError } from 'axios';

export const handleError = (res: Response, err: any) => {
  const typedErr = err as AxiosError<{
    statusCode: number;
    error: string;
    message: string;
  }>;
  return res.status(typedErr.response?.data.statusCode || 500).json({
    error: typedErr.response?.data.message || 'Internal Server Error',
  });
};
