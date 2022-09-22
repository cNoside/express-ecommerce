"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const auth_1 = require("@modules/auth");
const users_1 = require("@modules/users");
const BASE_URL = '/api';
const v1 = (0, express_1.Router)().use('/auth', auth_1.authController).use('/users', users_1.usersController);
exports.routes = (0, express_1.Router)().use(`${BASE_URL}/v1`, v1);
//# sourceMappingURL=index.js.map