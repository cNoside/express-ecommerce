"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueries = void 0;
const MAX_LIMIT = 1000000;
const parseQueries = (req) => {
    const { page, p, limit, l } = req.query;
    const page_ = Number(page || p);
    const pageNumber = isNaN(page_) ? 1 : page_ > 0 ? page_ : 1;
    const limit_ = limit || l;
    const limitNumber = limit_ === 'none' ? MAX_LIMIT : isNaN(Number(limit_)) ? 10 : Number(limit_);
    return {
        page: pageNumber,
        limit: limitNumber,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber
    };
};
exports.parseQueries = parseQueries;
//# sourceMappingURL=parse-queries.js.map