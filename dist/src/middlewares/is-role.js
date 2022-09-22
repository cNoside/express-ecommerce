"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRole = void 0;
const isRole = (req, res, next) => {
    req.isRole = (roles) => {
        if (req.user_ && roles.includes(req.user_.role)) {
            return true;
        }
        return false;
    };
    next();
};
exports.isRole = isRole;
//# sourceMappingURL=is-role.js.map