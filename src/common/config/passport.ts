import passport from 'passport';
import { Strategy as LocalStrategy, IStrategyOptions } from 'passport-local';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions
} from 'passport-jwt';
import argon2 from 'argon2';

import { env } from './env';
import { prisma } from 'common/config/prisma';

const localStrategyOptions: IStrategyOptions = {
  usernameField: 'email',
  passwordField: 'password',
  session: false
};

const jwtStrategyOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt.secret
};

export const getPassport = () => {
  passport.use(
    new LocalStrategy(localStrategyOptions, async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email }
        });
        const isValid = user && argon2.verify(user.password, password);
        if (!user || !isValid) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.use(
    new JwtStrategy(jwtStrategyOptions, async (payload, done) => {
      const id = payload.sub;
      try {
        const user = await prisma.user.findUnique({
          where: { id }
        });
        if (!user) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error, false);
      }
    })
  );

  return passport;
};
