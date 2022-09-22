"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const authGuard = (req, res, next) => {
    if (req.user_) {
        next();
    }
    else {
        next((0, http_errors_1.default)(401));
    }
};
exports.authGuard = authGuard;
//# sourceMappingURL=auth-guard.js.map