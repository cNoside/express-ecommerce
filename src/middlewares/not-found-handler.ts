import createError from 'http-errors';

export const notFoundHandler = () => {
  throw createError(404, 'Endpoint not found');
};
