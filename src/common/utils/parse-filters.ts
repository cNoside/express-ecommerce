import { Request } from 'express';

export const parseFilters = <T = Record<string, unknown>>(
  req: Request,
  options?: {
    defaultKeys?: (keyof T)[];
  }
) => {
  const { q, k } = req.query;

  const query = typeof q === 'string' ? q.trim() : '';

  const keys =
    typeof k === 'string'
      ? [k.trim()]
      : k instanceof Array
      ? k
      : [options?.defaultKeys];

  return { query, keys };
};
