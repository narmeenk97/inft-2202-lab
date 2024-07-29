import { validateForm } from "./add.js";
import { createProductService } from "./product.service.js";

//const apiKey = '6671c3c9f6855731eec4972d';
const host = 'http://localhost:3000/api/products';
const productService = createProductService(host);
const spinner = document.getElementById('spinner');
const container = document.getElementById('form-container');

let params = new URL(document.location).searchParams;
let productId = params.get('productId');
if (productId) {
    setUpEditForm(productId);
}

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
        console.log(`Fetching product with ID: ${productId}`);
        let product = await delayedFetch(() => productService.findProduct(productId));
        console.log('Fetched product:', product);
        //get reference to the form 
        const treatForm = document.getElementById('form');
        //set the field values 
        treatForm.name.value = product.name;
        treatForm.price.value = product.price;
        treatForm.onHand.value = product.onHand;
        treatForm.description.value = product.description;
        treatForm.name.disabled = true;
        treatForm.addEventListener('submit', (event) => submitEditForm(event, productId));
    } catch (error) {
        throw new Error("Failed to fetch item");
    } finally {
        hideSpinner();
    }
}
async function submitEditForm(productId) {
    const form = document.getElementById('form');
    const valid = await validateForm(
        form.name.value,
        form.price.value,
        form.onHand.value,
        form.description.value
    );
    if (valid) {
        //get the product data from the form 
        const product = {
            name: form.name.value,
            price: form.price.value,
            onHand: form.onHand.value,
            description: form.description.value
        };
        showSpinner();
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
