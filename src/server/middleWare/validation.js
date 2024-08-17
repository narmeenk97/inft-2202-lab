import { validationResult } from 'express-validator';
import { ConflictError } from '../errors/ConflictError.js';

function doValidation (request, response, next) {
    const result = validationResult(request);
    if (result.isEmpty()) {
        return next();
    }
    console.log('Validation Errors:', result.array());
    // response.status(409).json({errors: result.array() });
    const errObj = { erros: result.array() }
    next(new ConflictError('Input Validation Failed', errObj))
}

export function CheckValidation (rules) {
    return [rules, doValidation]
}