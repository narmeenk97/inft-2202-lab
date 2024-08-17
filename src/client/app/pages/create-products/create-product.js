import {createProductService} from '../../../../client_og/app/product.service.js';
//import the product model 
import ProductModel from '../../../../server/models/Products.js';
//import template 
import tmplAdd from './create-products.ejs';

//export a default function for the router to call 
export default async (route) => {
    console.log(route);
    //render the template and give it our list of products 
    const strAdd = tmplAdd({});
    //attach template to the DOM 
    document.getElementById('app').innerHTML = strAdd;
    //prepare component before the template renders 
    const productId = onInit();
    onRender(productId);
}

//function to do prepare component before the template renders 
async function onInit() {
    const spinner = document.getElementById('spinner');
    const container = document.getElementById('form-container');
    console.log('Initializing the form element.');
    showSpinner(spinner, container);
    //get product id from the query string 
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');
    if (productId) {
        //if there is a product id in the query string then call the function to set up the edit form 
        await setUpEditForm(productId);
        hideSpinner(spinner, container);
     }
     hideSpinner(spinner, container);
     return productId;
}
//function to set up the edit form and load the product data 
async function setUpEditForm(productId) {
    try {
        const pageTitle = document.getElementById('page-title');
        const button = document.getElementById('button');
        pageTitle.textContent = 'Edit Treat';
        button.textContent = 'Update Treat';
        const product = await delayedFetch(() => productService.findProduct(productId));
        console.log('Fetched product:', product);
        //get reference to the form 
        const treatForm = document.getElementById('form');
        //set the field values 
        treatForm.name.value = product.name;
        treatForm.price.value = product.price;
        treatForm.onHand.value = product.onHand;
        treatForm.description.value = product.description;
        //change the event listener for the update button 
        treatForm.addEventListener('submit', (event) => {
            event.preventDefault();
            submitEditForm(productId);
        })
    } catch (error) {
        throw new Error("Failed to fetch item");
    } 
}
function onRender(productId) 
{
    //get reference to the form element 
    const form = document.getElementById('form');
    //get reference to the spinner element 
    const spinner = document.getElementById('spinner');
    //get reference to the container element 
    const container = document.getElementById('form-container');
    // attach the event listener
    if (!productId) {
        form.addEventListener('submit', (event) => formSubmitHandler(event, form, spinner, container, productId));
    }
}

//initialize product service 
const host = 'http://localhost:3000/api/products';
const productService = createProductService(host);

async function submitEditForm(productId) {
    const form = document.getElementById('form');
    const spinner = document.getElementById('spinner');
    const container = document.getElementById('form-container');
    // Logging the form values for debugging
    console.log('Form values before validation:', {
        name: form.name.value,
        price: form.price.value,
        onHand: form.onHand.value,
        description: form.description.value,
    });

    const valid = await validateForm({
        name: form.name.value,
        price: parseFloat(form.price.value),
        onHand: parseInt(form.onHand.value),
        description: form.description.value,
    });
    if (valid) {
        //get the product data from the form 
        const product = {
            name: form.name.value.trim(),
            price: parseFloat(form.price.value),
            onHand: parseInt(form.onHand.value),
            description: form.description.value.trim()
        };
        showSpinner(spinner, container);
        try {
            console.log('Updating product with data:', product);
            const updated = await productService.updateProduct(productId, product);
            if (updated) {
                window.location.href = "list.html";
            } else {
                console.log('Failed to update product')
            }
        } catch (error) {
            throw new Error('Failed to update product', error);
        } finally {
            hideSpinner(spinner, container);
        }
    } else {
        console.error('Validation failed');
    }
}
async function formSubmitHandler(event, form, spinner, container, productId) {
    event.preventDefault();
    //log out the values 
    console.log(`name: ${form.name.value}`);
    console.log(`price: ${form.price.value}`);
    console.log(`onHand: ${form.onHand.value}`);
    console.log(`description: ${form.description.value}`);

    //create a product object 
    const product = {
        name: form.name.value.trim(),
        price: parseFloat(form.price.value),
        onHand: parseInt(form.onHand.value),
        description: form.description.value.trim()
    };
    //validate the form 
    const isValid = await validateForm(product);

    if (isValid) {
        showSpinner(spinner, container);
        try {
            let result;
            //if there is a productId open the edit page 
            if (productId) {
                console.log('Updating product');
                result = await delayedFetch(() => productService.updateProduct(productId, product), 1000);
            } else {
                console.log('Product added');
                result = await delayedFetch(() => productService.addProduct(product), 1000);
            }
            console.log('Result: ', result);
            hideSpinner(spinner, container);
            window.location.href = 'list.html';
        } catch (error) {
            console.error('Failed to save product', error)
        } finally {
            hideSpinner(spinner, container);
        }
    } else {
        console.error('Validation failed!');
    }
}

export async function validateForm(product) {
    let isValid = true;

    //Clear any exisiting error messages 
    clearErrorMessages();

    //check if name field is empty
    if (!product.name) {
        isValid = false;
        showErrorMessages('nameError');
    }

    // Check if the price is a valid number with up to two decimal places
    if (!Number.isFinite(product.price) || product.price <=0) {
        isValid = false;
        showErrorMessages('priceError');
    }

    //check if the onHand is a valid number 
    if (!Number.isInteger(product.onHand || product.onHand <= 0)) {
        isValid = false;
        showErrorMessages('stockError');
    }

    //check if the description is empty 
    if (!product.description) {
        isValid = false;
        showErrorMessages('desError');
    }

    return isValid;
}

//function to show error messages
function showErrorMessages(id) {
    const error = document.getElementById(id);
    if (error) {
    error.classList.remove('d-none');
    }
}

// Function to clear error messages
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.text-danger');
    errorMessages.forEach((message) => {
        message.classList.add('d-none');
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
function showSpinner(spinner, container){
    spinner.classList.remove('d-none');
    container.classList.add('d-none');
}

//function to hide spinner 
function hideSpinner(spinner, container) {
    spinner.classList.add('d-none');
    container.classList.remove('d-none');
}