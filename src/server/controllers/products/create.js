import Product from '../../models/Products.js';
import { checkSchema } from 'express-validator';
import { ConflictError } from '../../errors/ConflictError.js';

//create rules for create 
const rules = checkSchema({
    name: {
        isString: true,
        notEmpty: true,
        errorMessage: 'Name cannot be empty and must be a string!'
    },
    price: {
        isNumeric: true,
        notEmpty: true,
        errorMessage: 'Price cannot be empty and must be a number!'
    },
    onHand: {
        isNumeric: true,
        notEmpty: true,
        errorMessage: 'onHand cannot be empty and must be a number!'
    },
    description: {
        isString: true,
        notEmpty: true,
        errorMessage: 'Description cannot be empty and must be a string!'
    },
    
}, ['body']);

const handle = async (request, response, next) => {
    try {
        const { name, price, onHand, description } = request.body;
        const exists = await Product.findOne({name});
        if (exists) {
            throw new ConflictError('That product already exists!');
        }
        const product = await Product.create({
            name,
            price,
            onHand,
            description
        });
        response.json(product);
    } catch (error) {
        next(error);
    }
};

export default { rules, handle };
