"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleGuard = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const roleGuard = (roles) => (req, res, next) => {
    if (req.user_ && roles.includes(req.user_.role)) {
        next();
    }
    else {
        next((0, http_errors_1.default)(401));
    }
};
exports.roleGuard = roleGuard;
//# sourceMappingURL=role-guard.js.map