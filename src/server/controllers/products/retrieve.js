import Product from '../../models/Products.js';
import { checkSchema } from 'express-validator';

//create rules for retrieve 
const rules = checkSchema({
    productId: {
        notEmpty: true,
        errorMessage: 'Please enter the product ID you want to retrieve'
    }
}, ['query']);

const handle = async (request, response, next) => {
    try { 
        const product = await Product.findOne({
            _id: request.params.product_id
        });
        /* if (!product) {
            throw new Error('Product not found!');
        } */
        response.json(product);
    } catch (error) {
        next(error);
    }   
};

export default { rules, handle };