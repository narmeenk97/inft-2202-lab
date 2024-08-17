import {createProductService} from '../../../../client_og/app/product.service.js';
import tmplList from './list-products.ejs';
import '../../../img/img.jpg';
import * as bootstrap from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const host = 'http://localhost:3000/api/products';
const productService = createProductService(host);
export default async (route) => {
    console.log(route);
    const strList = tmplList({products: []});
    document.getElementById('app').innerHTML = strList;
    const { products } = await onInit();
    if (products) {
        const strList = tmplList({products});
        console.log(products);
        document.getElementById('app').innerHTML = strList;
        onRender();
    }
}
async function onInit() {
    const container = document.getElementById('cardDiv');
    const spinner = document.getElementById('spinner');
    const messageBox = document.getElementById('message-box');
    showSpinner(container, spinner);
    try {
        const products = await loadProducts(1, 10);
        if (products.length === 0) {
            messageBox.classList.remove('d-none');
        }
        console.log('api response: ', products);
        return { products };
    } catch (error) {
        console.error('Error listing products', error);
        return { products: [] };
    } finally {
        hideSpinner(container, spinner);
    }
}
async function loadProducts(page, perPage) {
    try {
        const res = await delayedFetch(() => productService.listProducts(page, perPage), 1000);
        return res.records;
    } catch (error) {
        console.error('Error fetching products', error);
    }
}

function onRender() {

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const productId = event.target.getAttribute('data-id');
            const productName = event.target.getAttribute('data-name');
            openModal(productId, productName);
        });
    });
    //edit button event listener 
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = event.target.getAttribute('data-id');
            window.location.href = `add.html?productId=${productId}`;
        });
    });
}

function openModal(productId, productName) {
    const myModalElement = document.getElementById('myModal');
    if (myModalElement) {
        const myModal = new bootstrap.Modal(myModalElement);

        document.getElementById('confirmDelete').setAttribute('data-id', productId);
        myModal.show();

        document.getElementById('confirmDelete').addEventListener('click', async function() {
            try {
                console.log(`Attempting to delete product with ID: ${productId}`);
                const response = await delayedFetch(() => productService.deleteProduct(productId), 1000);
                if (response === null) {
                    document.getElementById(`product-${productId}`).remove();
                    console.log('Product deleted successfully');
                } else {
                    console.log('Failed to delete product');
                }
            } catch (error) {
                console.log('Cannot delete product', error);
            } finally {
                myModal.hide();
            }
        });
    } else {
        console.error("Modal element not found");
    }
}


//function to show the spinner 
function showSpinner(container, spinner){
    spinner.classList.remove('d-none');
    container.classList.add('d-none');
} 

//function to hide spinner 
function hideSpinner(container, spinner) {
    spinner.classList.add('d-none');
    container.classList.remove('d-none');
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

//event listener for the dropdown menu 
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault();
        perPage = parseInt(event.target.getAttribute('data-value'));
        document.getElementById('perPage').textContent = perPage;
        loadProducts(1, perPage);
    })
});