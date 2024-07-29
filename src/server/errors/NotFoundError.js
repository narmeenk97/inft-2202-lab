export class NotFoundError extends Error {
    details; 
    statusCode = 404;
    constructor(message, details) {
        super(message, details);
        this.details = details;
    }
};