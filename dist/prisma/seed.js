"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield Promise.all(Array.from({ length: 10000 }, () => __awaiter(this, void 0, void 0, function* () {
            return ({
                email: faker_1.faker.unique(faker_1.faker.internet.email),
                username: faker_1.faker.internet.userName(),
                password: yield argon2_1.default.hash('1q!Q1q!Q')
            });
        })));
        yield prisma.user.createMany({
            data: users
        });
        yield prisma.user.create({
            data: {
                username: 'root',
                email: 'root@internal.com',
                password: yield argon2_1.default.hash('1q!Q1q!Q'),
                role: 'admin'
            }
        });
        yield prisma.user.create({
            data: {
                username: 'user',
                email: 'user@internal.com',
                password: yield argon2_1.default.hash('1q!Q1q!Q'),
                role: 'user'
            }
        });
        yield prisma.user.create({
            data: {
                username: 'test',
                email: 'test@internal.com',
                password: yield argon2_1.default.hash('1q!Q1q!Q'),
                role: 'admin'
            }
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
//# sourceMappingURL=seed.js.map