"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganWinstonStream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const loggingLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    access: 4,
    verbose: 5,
    debug: 6,
    silly: 7
};
const { timestamp, prettyPrint, metadata } = winston_1.default.format;
exports.logger = winston_1.default.createLogger({
    level: 'info',
    levels: loggingLevels,
    format: winston_1.default.format.combine(timestamp({ format: 'DD/MMM/YYYY:hh:mm:ss ZZ' }), prettyPrint()),
    transports: [
        new winston_1.default.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        new winston_1.default.transports.File({
            filename: 'logs/access.log',
            level: 'access'
        })
    ]
});
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
    }));
}
exports.morganWinstonStream = {
    write: (message) => {
        exports.logger.log('access', message);
    }
};
//# sourceMappingURL=index.js.map