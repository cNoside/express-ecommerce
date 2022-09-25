import { Router } from 'express';

import { authController } from '@modules/auth';
import { usersController } from '@modules/users';
import { productsController } from '@modules/products';
import { profilesController } from '@modules/profiles';
import { cartItemsController } from '@modules/cartItems';

const BASE_URL = '/api';

const v1 = Router()
  .use('/auth', authController)
  .use('/users', usersController)
  .use('/products', productsController)
  .use('/profiles', profilesController)
  .use('/cart', cartItemsController);

export const routes = Router().use(`${BASE_URL}/v1`, v1);
