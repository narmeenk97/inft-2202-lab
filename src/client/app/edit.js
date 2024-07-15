import { validateForm } from "./add.js";
import { createProductService } from "./product.service.js";

const apiKey = '6671c3c9f6855731eec4972d';
const host = 'https://inft2202.paclan.net/api/products';
const productService = createProductService(host, apiKey);

let params = new URL(document.location).searchParams;
let productId = params.get('productId');
if (productId) {
    setUpEditForm(productId);
}
const spinner = document.getElementById('spinner');
const container = document.getElementById('form-container');

async function setUpEditForm(productId) {
    //get a reference to the heading 
    const heading = document.querySelector('h2');
    heading.textContent = 'Edit Treat';
    //get reference to submit button 
    const button = document.getElementById('button');
    button.textContent = 'Update Treat';
    //use the name from the URL to find product
    showSpinner();
    try {
        let product = await delayedFetch(() => productService.findProduct(productId));
        //get reference to the form 
        const treatForm = document.getElementById('form');
        //set the field values 
        treatForm.name.value = product.name;
        treatForm.price.value = product.price;
        treatForm.stock.value = product.stock;
        treatForm.description.value = product.description;
        treatForm.name.disabled = true;
        treatForm.addEventListener('submit', (event) => submitEditForm(event, productId));
    } catch (error) {
        throw new Error("Failed to update item");
    } finally {
        hideSpinner();
    }
}
async function submitEditForm(event, productId) {
    event.preventDefault();
    const valid = await validateForm(
        event.target.name.value,
        event.target.price.value,
        event.target.stock.value,
        event.target.description.value
    );
    if (valid) {
        //get the product data from the form 
        const product = {
            name: event.target.name.value,
            price: event.target.price.value,
            stock: event.target.stock.value,
            description: event.target.description.value
        };
        showSpinner();
        try {
            const updated = await productService.updateProduct(productId, product);
            if (updated) {
                window.location.href = "list.html";
            } else {
                console.log('Failed to update product')
            }
        } catch (error) {
            throw new Error('Failed to update product', error);
        } finally {
            hideSpinner();
        }
    }
}

//function to add a delay to the api response to show the spinner to the user 
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
