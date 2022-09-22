import { Request } from 'express';

const MAX_LIMIT = 1_000_000;

export const parseQueries = (req: Request) => {
  const { page, p, limit, l } = req.query;
  const page_ = Number(page || p);
  const pageNumber: number = isNaN(page_) ? 1 : page_ > 0 ? page_ : 1;

  const limit_ = limit || l;
  const limitNumber: number =
    limit_ === 'none' ? MAX_LIMIT : isNaN(Number(limit_)) ? 10 : Number(limit_);

  return {
    page: pageNumber,
    limit: limitNumber,
    skip: (pageNumber - 1) * limitNumber,
    take: limitNumber
  };
};
