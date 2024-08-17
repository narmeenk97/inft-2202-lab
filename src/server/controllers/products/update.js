import Product from '../../models/Products.js';
import { checkSchema } from 'express-validator';

//create rules for update 
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
    
}, ['query']);

const handle = async (request, response, next) => {
    try {
        const { name, price, onHand, description } = request.body;
        const filter = {_id: request.params.productId};
        console.log('Filter: ', filter);
        const update = {price, onHand, description};
        console.log('Product Data: ', update);
        const product = await Product.findOneAndUpdate(filter, update, {new: true});
        if (!product) {
            console.log("Product not found with ID:", request.params.productId);
            return response.status(404).json({message: 'Product not found'});
        }
        console.log("Updated product:", product);
        response.json(product);
    } catch (error) {
        console.error("Error during product update:", error);
        next(error);
    }   
};

export default { rules, handle };