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
exports.getPassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const argon2_1 = __importDefault(require("argon2"));
const env_1 = require("./env");
const prisma_1 = require("common/config/prisma");
const localStrategyOptions = {
    usernameField: 'email',
    passwordField: 'password',
    session: false
};
const jwtStrategyOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env_1.env.jwt.secret
};
const getPassport = () => {
    passport_1.default.use(new passport_local_1.Strategy(localStrategyOptions, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield prisma_1.prisma.user.findUnique({
                where: { email }
            });
            const isValid = user && argon2_1.default.verify(user.password, password);
            if (!user || !isValid) {
                return done(null, false);
            }
            else {
                return done(null, user);
            }
        }
        catch (error) {
            return done(error);
        }
    })));
    passport_1.default.use(new passport_jwt_1.Strategy(jwtStrategyOptions, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        const id = payload.sub;
        try {
            const user = yield prisma_1.prisma.user.findUnique({
                where: { id }
            });
            if (!user) {
                return done(null, false);
            }
            else {
                return done(null, user);
            }
        }
        catch (error) {
            return done(error, false);
        }
    })));
    return passport_1.default;
};
exports.getPassport = getPassport;
//# sourceMappingURL=passport.js.map