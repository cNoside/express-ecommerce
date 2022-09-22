import { Router } from 'express';

import { authController } from '@modules/auth';
import { cartsController } from '@modules/carts';
import { usersController } from '@modules/users';
import { productsController } from '@modules/products';
import { profilesController } from '@modules/profiles';

const BASE_URL = '/api';

const v1 = Router()
  .use('/auth', authController)
  .use('/users', usersController)
  .use('/carts', cartsController)
  .use('/products', productsController)
  .use('/profiles', profilesController);

export const routes = Router().use(`${BASE_URL}/v1`, v1);
