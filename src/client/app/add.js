import {productService} from './product.mock.service.js';
import { Product } from "./Product.js";

let params = new URL(document.location).searchParams;
let name = params.get('name');
const form = document.getElementById('form');
if (!name) {
    document.getElementById('form').addEventListener('submit', form);
}
form.addEventListener('submit', (event) => {
    event.preventDefault();
    //get the form values 
    const productName = form.name.value;
    const price = form.price.value;
    const onHand = form.quantity.value;
    const description = form.description.value;

    //validate the form 
    const isValid = validateForm(productName, price, onHand, description);

    if (isValid) {
        const newProduct = new Product(productName, price, onHand, description);
        const isStored = productService.addProduct(newProduct);
        if (isStored) {
            window.location.href = 'list.html';
        } else {
            console.error('Failed to store the product');
        }
    } else {
        console.error('Validation failed!');
    }
});

export function validateForm(name, price, onHand, description) {
    let isValid = true;

    // Check if all fields have been filled out
    if (!name || isNaN(price) || isNaN(onHand) || !description) {
        isValid = false;
        showErrorMessages();
    }

    // Check if the price is a valid number with up to two decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
        isValid = false;
        showErrorMessages();
    }

    return isValid;
}

// Function to show error messages
function showErrorMessages() {
    const errorMessages = document.querySelectorAll('.text-danger');
    errorMessages.forEach((message) => {
        message.classList.remove('d-none');
    });
}