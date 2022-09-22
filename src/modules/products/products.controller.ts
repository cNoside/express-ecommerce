import createError from 'http-errors';
import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { prisma } from '@prisma';
import { parseQueries } from 'common/utils';
import { CreateProductSchema, UpdateProductSchema } from './product.schema';
import { validateParamInt, validateSchema } from 'common/middlewares';

export const productsController = Router();

productsController.get(
  '/',
  asyncHandler(async (req, res) => {
    const { skip, take } = parseQueries(req);
    const products = await prisma.product.findMany({
      skip,
      take
    });
    res.send({ products });
  })
);

productsController.get(
  '/:id',
  validateParamInt('id'),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: Number(id) }
    });
    if (!product) {
      throw createError(404, 'Product not found');
    }
    res.send({ product });
  })
);

productsController.post(
  '/',
  validateSchema(CreateProductSchema),
  asyncHandler(async (req, res) => {
    const product = await prisma.product.create({
      data: req.body
    });
    res.send({ message: 'Created product', product });
  })
);

productsController.put(
  '/:id',
  validateParamInt('id'),
  validateSchema(CreateProductSchema),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const product = await prisma.product.upsert({
      where: { id },
      create: {
        ...req.body,
        id
      },
      update: req.body
    });
    res.send({ message: 'Upserted product', product });
  })
);

productsController.patch(
  '/:id',
  validateParamInt('id'),
  validateSchema(UpdateProductSchema),
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });
    if (!existingProduct) {
      throw createError(404, 'Product not found');
    }
    const product = await prisma.product.update({
      where: { id },
      data: req.body
    });
    res.send({ message: 'Updated product', product });
  })
);

productsController.delete(
  '/:id',
  validateParamInt('id'),
  async (req, res, next) => {
    const id = Number(req.params.id);
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return next(createError(404, 'Product not found'));
    }

    const product = await prisma.product.delete({
      where: { id: existingProduct.id }
    });
    res.send({ message: 'Deleted product', product });
  }
);
