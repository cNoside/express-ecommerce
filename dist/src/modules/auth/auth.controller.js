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
exports.authController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_1 = require("express");
const http_errors_1 = __importDefault(require("http-errors"));
const argon2_1 = __importDefault(require("argon2"));
const prisma_1 = require("common/config/prisma");
const validate_1 = require("middlewares/validate");
const auth_schema_1 = require("./auth.schema");
const jwt_service_1 = require("common/services/jwt.service");
const env_1 = require("common/config/env");
const passport_1 = __importDefault(require("passport"));
const protected_route_1 = require("common/middlewares/protected-route");
exports.authController = (0, express_1.Router)();
exports.authController.post('/signup', (0, validate_1.validate)(auth_schema_1.AuthSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { password } = _a, rest = __rest(_a, ["password"]);
    const user = yield prisma_1.prisma.user.create({
        data: Object.assign(Object.assign({}, rest), { password: yield argon2_1.default.hash(password) })
    });
    res.send({ user });
}));
exports.authController.post('/login', (0, validate_1.validate)(auth_schema_1.LoginSchema), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('local', (err, user, foo, bar) => {
        if (err) {
            return next(err);
        }
        else if (!user) {
            return next((0, http_errors_1.default)(401, 'Invalid email or password'));
        }
        else {
            res.send({
                token: jwt_service_1.jwtService.sign({ sub: user.id }, { expiresIn: env_1.env.jwt.expiresIn }),
                expiresIn: env_1.env.jwt.expiresIn
            });
        }
    })(req, res, next);
}));
exports.authController.get('/whoami', protected_route_1.protectedRoute, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id: req.user_.id }
    });
    Object.assign(user || {}, { password: undefined });
    res.send({ user });
}));
exports.authController.delete('/account', protected_route_1.protectedRoute, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.delete({
        where: { id: req.user_.id }
    });
    res.send({ user });
})));
//# sourceMappingURL=auth.controller.js.map