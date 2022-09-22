"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFilters = void 0;
const parseFilters = (req, options) => {
    const { q, k } = req.query;
    const query = typeof q === 'string' ? q.trim() : '';
    const keys = typeof k === 'string'
        ? [k.trim()]
        : k instanceof Array
            ? k
            : [options === null || options === void 0 ? void 0 : options.defaultKeys];
    return { query, keys };
};
exports.parseFilters = parseFilters;
//# sourceMappingURL=parse-filters.js.map