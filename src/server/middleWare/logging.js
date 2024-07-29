import {logger} from '../utils/logger.js';

export const LoggingMiddleWare = (request, response, next) => {
    logRequest(request, response);
    response.once('finish', () => {logRequest(request, response);});
    next();
}

const logRequest = async (request, response) => {
    const { method, originalUrl, body, params, query, headers } = request;
    const { statusCode } = response;
    const time = new Date().toISOString();
    //replace the original response.json method 
    const og = response.json;
    //with something that will wait for the response values 
    response.json = async (value) => {
        const data = await Promise.resolve(value);
        response.locals.data = data;
        return og.call(response, data)
    }
    const context = {
        time,
        req: {
            body, params, query, headers
        },
        res: { 
            statusCode,
            body: response.locals.data
        }
    };
    if (response.headersSent) {
        logger.info(`${time} Response: ${method} ${originalUrl}`, context);
    } else {
        logger.info(`${time} Request: ${method} ${originalUrl}`, context);
    }
    
}