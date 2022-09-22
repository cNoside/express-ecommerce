"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("common/config/env");
exports.jwtService = {
    sign: (payload, options) => {
        return jsonwebtoken_1.default.sign(payload, env_1.env.jwt.secret, Object.assign({ expiresIn: env_1.env.jwt.expiresIn }, options));
    }
};
//# sourceMappingURL=jwt.service.js.map