import express from 'express';

//import the controllers 
import ProductsCreateController from '../controllers/products/create.js';
import ProductsRetrieveController from '../controllers/products/retrieve.js';
import ProductsDeleteController from '../controllers/products/delete.js';
import ProductsSearchController from '../controllers/products/search.js';
import ProductsUpdateController from '../controllers/products/update.js';
import { CheckValidation } from '../middleWare/validation.js';

export const productRoutes = express.Router();

//define the routes 
//create 
productRoutes.post('/api/products', 
    CheckValidation(ProductsCreateController.rules),
    ProductsCreateController.handle);
//search 
productRoutes.get('/api/products', 
    CheckValidation(ProductsSearchController.rules),
    ProductsSearchController.handle);
//delete 
productRoutes.delete('/api/products/:product_id', ProductsDeleteController.handle);
//retrieve 
productRoutes.get('/api/products/:product_id', ProductsRetrieveController.handle);
//update 
productRoutes.put('/api/products/:product_id', 
    CheckValidation(ProductsUpdateController.rules),
    ProductsUpdateController.handle);