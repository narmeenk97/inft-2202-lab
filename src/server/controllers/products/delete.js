import Product from '../../models/Products.js';

const handle = async (request, response, next) => {
    try { 
        const product = await Product.findOneAndDelete({
            _id: request.params.productId
        });
        response.json(product);
    } catch (error) {
        next(error);
    }   
};

export default { handle };