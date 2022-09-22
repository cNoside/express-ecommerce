"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const http_errors_1 = require("http-errors");
const logger_1 = require("common/config/logger");
const http_errors_2 = require("constants/http-errors");
const errorHandler = (err, req, res, next) => {
    if (err instanceof http_errors_1.HttpError && err.expose) {
        res.status(err.statusCode).send({
            statusCode: err.statusCode,
            message: err.message
        });
        return;
    }
    if (err instanceof SyntaxError) {
        res.status(400).send({
            statusCode: 400,
            message: http_errors_2.HTTP_ERRORS[400],
            error: 'There was a syntax error in the request.'
        });
        return;
    }
    res.status(500).send({
        statusCode: 500,
        message: http_errors_2.HTTP_ERRORS[500]
    });
    logger_1.logger.error(err.message, {
        request: Object.assign({ method: req.method, url: req.url, remoteAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress }, (req.body && { body: req.body }))
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map