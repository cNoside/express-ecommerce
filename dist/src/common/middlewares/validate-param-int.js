"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParamInt = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const validateParamInt = (paramKey) => (req, res, next) => {
    const { [paramKey]: param } = req.params;
    if (isNaN(Number(param))) {
        return next((0, http_errors_1.default)(400, `Id must be a number`));
    }
    next();
};
exports.validateParamInt = validateParamInt;
//# sourceMappingURL=validate-param-int.js.map