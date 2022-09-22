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
exports.main = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = require("routes");
const env_1 = require("common/config/env");
const is_role_1 = require("middlewares/is-role");
const prisma_1 = require("common/config/prisma");
const error_handler_1 = require("middlewares/error-handler");
const logger_1 = require("common/config/logger");
const passport_1 = require("common/config/passport");
const jwt_auth_1 = require("middlewares/jwt-auth");
const MORGAN_FORMAT = ':remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]';
dotenv_1.default.config();
const app = (0, express_1.default)();
const passport = (0, passport_1.getPassport)();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma_1.prisma.$connect();
        app.use((0, morgan_1.default)(MORGAN_FORMAT, { stream: logger_1.morganWinstonStream }));
        app.use(express_1.default.json());
        app.use(passport.initialize());
        app.use(jwt_auth_1.jwtAuth);
        app.use(is_role_1.isRole);
        if (process.env.NODE_ENV !== 'production') {
            app.use((0, morgan_1.default)('dev'));
        }
        app.use(routes_1.routes);
        app.use(error_handler_1.errorHandler);
        return app.listen(env_1.env.server.port, () => {
            console.clear();
            console.log(`Server is running on port ${env_1.env.server.port}`);
        });
    });
}
exports.main = main;
//# sourceMappingURL=app.js.map