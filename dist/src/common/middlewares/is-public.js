"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPublic = void 0;
const isPublic = (req, res, next) => {
    req.isPublic = true;
    next();
};
exports.isPublic = isPublic;
//# sourceMappingURL=is-public.js.map