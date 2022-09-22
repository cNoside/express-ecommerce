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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersController = void 0;
const express_1 = require("express");
const http_errors_1 = __importDefault(require("http-errors"));
const users_schema_1 = require("./users.schema");
const prisma_1 = require("common/config/prisma");
const validate_1 = require("middlewares/validate");
const utils_1 = require("common/utils");
const argon2_1 = __importDefault(require("argon2"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const middlewares_1 = require("common/middlewares");
const middlewares_2 = require("common/middlewares");
exports.usersController = (0, express_1.Router)();
exports.usersController.use((0, middlewares_2.roleGuard)(['admin']));
exports.usersController.get('/', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { skip, take } = (0, utils_1.parseQueries)(req);
    const users = yield prisma_1.prisma.user.findMany({
        include: {
            profile: true
        },
        skip,
        take
    });
    users.forEach((user) => {
        Object.assign(user, { password: undefined });
    });
    res.send({ users });
})));
exports.usersController.get('/:id', (0, middlewares_1.validateParamInt)('id'), (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id: Number(id) }
    });
    if (!user) {
        throw (0, http_errors_1.default)(404, 'User not found');
    }
    Object.assign(user, { password: undefined });
    res.send({ user });
})));
exports.usersController.post('/', (0, validate_1.validate)(users_schema_1.CreateUserSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
    const users = yield prisma_1.prisma.user.create({
        data: Object.assign(Object.assign({}, rest), { password: yield argon2_1.default.hash(password) })
    });
    res.send({ users });
}));
exports.usersController.delete('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return next((0, http_errors_1.default)(400, 'Invalid id'));
    }
    const existingUser = yield prisma_1.prisma.user.findUnique({
        where: { id }
    });
    if (!existingUser) {
        return next((0, http_errors_1.default)(404, 'User not found'));
    }
    const user = yield prisma_1.prisma.user.delete({
        where: { id: existingUser.id }
    });
    res.send({ user });
}));
//# sourceMappingURL=users.controller.js.map