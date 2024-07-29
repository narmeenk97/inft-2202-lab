import { model, Schema } from 'mongoose';

//define the fields in the database 
const fields = {
    
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    onHand: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
};
//create a new mongoose schema
const schema = new Schema(fields);
//use it to create and export a new model named 'Product'
export default model('Product', schema);