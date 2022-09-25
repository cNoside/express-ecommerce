import jwt, { SignOptions } from 'jsonwebtoken';

import { env } from 'common/config/env';

export const jwtService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sign: (payload: any, options?: SignOptions) => {
    return jwt.sign(payload, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn,
      ...options
    });
  }
};
