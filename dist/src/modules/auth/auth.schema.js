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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
const prisma_1 = require("common/config/prisma");
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string()
});
exports.AuthSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email()
        .trim()
        .refine((email) => __awaiter(void 0, void 0, void 0, function* () {
        const existingUser = yield prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return false;
        }
        return true;
    }), 'Already exists'),
    username: zod_1.z.string().trim(),
    password: zod_1.z
        .string()
        .regex(/(?=.*[a-z]).*/, '1 lowercase')
        .regex(/(?=.*[A-Z]).*/, '1 uppercase')
        .regex(/(?=.*[0-9]).*/, '1 number')
        .regex(/(?=.*[!@#$%^&*]).*/, '1 special character')
        .min(8)
        .trim()
});
//# sourceMappingURL=auth.schema.js.map