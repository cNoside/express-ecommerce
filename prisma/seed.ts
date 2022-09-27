import { PrismaClient, Role } from '@prisma/client';
import argon2 from 'argon2';

import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

const USERS_AMOUNT = 10;
const PRODUCTS_AMOUNT = 10;

async function main() {
  const rootUser = await prisma.user.create({
    data: {
      username: 'root',
      email: 'root@internal.com',
      password: await argon2.hash('1q!Q1q!Q'),
      role: 'admin'
    }
  });
  const testUser = await prisma.user.create({
    data: {
      username: 'user',
      email: 'user@internal.com',
      password: await argon2.hash('1q!Q1q!Q'),
      role: 'user'
    }
  });
  const users = prisma.user.createMany({
    data: await Promise.all(
      Array.from({ length: USERS_AMOUNT }, async () => ({
        email: faker.unique(faker.internet.email),
        username: faker.internet.userName(),
        password: await argon2.hash('1q!Q1q!Q'),
        role: faker.helpers.arrayElement(Object.values(Role))
      }))
    )
  });

  const usersLength = await prisma.user.count();
  const profiles = prisma.profile.createMany({
    data: Array.from({ length: usersLength }, (_, i) => ({
      userId: i + 1,
      bio: faker.lorem.sentences(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      imageUrl: faker.image.avatar()
    }))
  });

  const products = prisma.product.createMany({
    data: Array.from({ length: PRODUCTS_AMOUNT }, () => ({
      name: faker.commerce.productName(),
      description: faker.lorem.sentences(),
      imageUrl: faker.image.cats(),
      price: Number(faker.commerce.price()),
      quantity: faker.datatype.number({ min: 50, max: 100 })
    }))
  });

  await Promise.all([rootUser, testUser, users, profiles, products]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
