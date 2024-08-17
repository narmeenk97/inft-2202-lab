import {createProductService} from './product.service.js';
import { newProduct } from "./Product.js";

//const apiKey = '6671c3c9f6855731eec4972d';
const host = 'http://localhost:3000/api/products';
const productService = createProductService(host);

const form = document.getElementById('form');
const spinner = document.getElementById('spinner');
const container = document.getElementById('form-container');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    //get the form values 
    const name = form.name.value;
    const price = parseFloat(form.price.value);
    const onHand = parseInt(form.onHand.value, 10);
    const description = form.description.value;

    //create a product object 
    const product = {
        name: name,
        price: price,
        onHand: onHand,
        description: description
    }

    //validate the form 
    const isValid = await validateForm(name, price, onHand, description);

    if (isValid) {
        showSpinner();
        try {
            const result =  await delayedFetch(() => productService.addProduct(product), 1000);
            console.log(result);
            hideSpinner();
            window.location.href = 'list.html';
        } catch (error) {
            console.error('Failed to add the product', error);
        } finally {
            hideSpinner();
        }
    } else {
        console.error('Validation failed!');
    }
});

export async function validateForm(name, price, onHand, description) {
    let isValid = true;

    //Clear any exisiting error messages 
    clearErrorMessages();

    //check if name field is empty
    if (!name) {
        isValid = false;
        showErrorMessages('nameError');
    }

    // Check if the price is a valid number with up to two decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
        isValid = false;
        showErrorMessages('priceError');
    }

    //check if the onHand is a valid number 
    if (!Number.isInteger(onHand)) {
        isValid = false;
        showErrorMessages('stockError');
    }

    //check if the description is empty 
    if (!description) {
        isValid = false;
        showErrorMessages('desError');
    }

    return isValid;
}

//function to show error messages
function showErrorMessages(id) {
    const error = document.getElementById(id);
    error.classList.remove('d-none');
}

// Function to clear error messages
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.text-danger');
    errorMessages.forEach((message) => {
        message.classList.add('d-none');
        message.textContent = '';
    });
}

// Function to add a delay to the API response to show the spinner to the user
async function delayedFetch(apiCall, delay) {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const result = await apiCall();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        }, delay);
    });
}

//function to show the spinner 
function showSpinner(){
    spinner.classList.remove('d-none');
    container.classList.add('d-none');
}

//function to hide spinner 
function hideSpinner() {
    spinner.classList.add('d-none');
    container.classList.remove('d-none');
}