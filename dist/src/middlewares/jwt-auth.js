"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtAuth = void 0;
const passport_1 = __importDefault(require("passport"));
const jwtAuth = (req, res, next) => {
    passport_1.default.authenticate('jwt', (err, user) => {
        if (err) {
            return next(err);
        }
        req.user_ = user;
        next();
    })(req, res, next);
};
exports.jwtAuth = jwtAuth;
//# sourceMappingURL=jwt-auth.js.map