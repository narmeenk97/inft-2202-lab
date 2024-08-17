import express from 'express';
import mongoose from 'mongoose';
//import new router file 
import { productRoutes } from './routes/products.js';
//import middleware/logging files 
import { ErrorHandlingMiddleware } from './middleWare/errorHandling.js';
import { LoggingMiddleWare } from './middleWare/logging.js';
import Path from 'path';
//still need a port number to operate on 
const PORT = 3000;
//create a new instance of the http server 
const server = express();
//tell express to expect json input 
server.use(express.json());
//tell express to use our new logger 
server.use(LoggingMiddleWare);
//tell the server to use the imported router 
server.use(productRoutes);
//automatically serve static assessts from the client directory  
const localDir = import.meta.dirname;
server.use(express.static(`${localDir}/../../dist`));
server.use('/node_modules', express.static(`${localDir}/../../node_modules`));
server.get('*', (req, res, next) => {
    res.sendFile(Path.resolve(import.meta.dirname + '/../../dist/index.html'));
})
server.use(ErrorHandlingMiddleware);
try {
    //try to connect to the database 
    await mongoose.connect('mongodb://localhost:27017/inft2202');
    console.log('Connected to the database!');
    //start the server 
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (error) {
    console.log(error);
    process.exit(1);
}