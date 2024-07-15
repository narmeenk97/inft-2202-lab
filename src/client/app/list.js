import {createProductService} from './product.service.js';
import { setupPagination } from './pagination.js';

const apiKey = '6671c3c9f6855731eec4972d';
const host = 'https://inft2202.paclan.net/api/products';
const productService = createProductService(host, apiKey);

const container = document.getElementById('cardDiv');
const messageBox = document.getElementById('message-box');
const spinner = document.getElementById('spinner');
//to check if the product was listed by me only then the delete and edit buttons will appear 
const myBannerID = 100913624;

const pagination = setupPagination(loadProducts);

let perPage = 10; //default per page 
loadProducts(1, perPage);

//function load and display the product cards 
export async function loadProducts(page, perPage) {
    showSpinner();
    try {
        const res = await delayedFetch(() => productService.listProducts(page, perPage), 1000);
        const products = res.records;
        const totalCount = res.pagination.count;
        if (products.length === 0) {
            messageBox.classList.remove('d-none');
        } else {
            messageBox.classList.add('d-none');
            drawCards(products); 
            const totalPages = Math.ceil(totalCount/perPage);
            pagination.createPagination(totalPages, page);
        }
    } catch (error) {
        console.error('Error fetching products', error);
        throw new Error('Error fetching products')
    } finally {
        hideSpinner();
    }
}

function drawCards(products) {
    container.innerHTML = "";
    products.forEach(product => {
        const card = createCard(product);
        container.appendChild(card);
    });
}

function createCard(product) {
    const card = document.createElement('div');
    card.classList.add('card', 'm-2', 'p-2', 'flex-fill');
    card.style.width = '18rem';
    
    const cardImg = document.createElement('img');
    cardImg.classList.add('card-img-top');
    cardImg.src = "img/img.jpg";
    cardImg.alt = product.name;
    console.log('Image path:', cardImg.src);
    card.appendChild(cardImg);
    
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.appendChild(cardBody);

    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = product.name;
    cardBody.appendChild(cardTitle);

    const cardDescription = document.createElement('p');
    cardDescription.classList.add('card-description');
    cardDescription.textContent = product.description;
    cardBody.appendChild(cardDescription);

    const cardPrice = document.createElement('p');
    cardPrice.classList.add('card-price');
    cardPrice.textContent = `Price: ${product.price}`;
    cardBody.appendChild(cardPrice);

    const cardOnHand = document.createElement('p');
    cardOnHand.classList.add('card-onHand');
    cardOnHand.textContent = `QTY: ${product.stock}`;
    cardBody.appendChild(cardOnHand);

    const cardListedBy = document.createElement('p');
    cardListedBy.classList.add('card-listedBy');
    cardListedBy.textContent = `Listed By: ${product.owner.name}`;
    cardBody.appendChild(cardListedBy);

    const cardListedAt = document.createElement('p');
    cardListedAt.classList.add('card-listedAt');
    cardListedAt.textContent = `Listed At: ${new Date(product.createdAt).toLocaleString()}`;
    cardBody.appendChild(cardListedAt);

    const addToCart = document.createElement('a');
    addToCart.classList.add('btn', 'btn-outline-primary');
    addToCart.href = "#";
    addToCart.textContent = "Add to cart";
    cardBody.appendChild(addToCart);

    if (product.owner.bannerId === myBannerID) {

        const deleteBtn = document.createElement('a');
        deleteBtn.classList.add('btn', 'btn-outline-danger', 'fas', 'fa-trash-alt');
        deleteBtn.href = "#";
        cardBody.appendChild(deleteBtn);

        deleteBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const myModal = new bootstrap.Modal(document.getElementById('myModal'));
            myModal.show();
        
            document.getElementById('delete').addEventListener('click', async function() {
                showSpinner();
                try {
                    const productId = product.productId; // Ensure correct productId is used
                    console.log(`Attempting to delete product with ID: ${productId}`);
                    const deleted = await delayedFetch(() => productService.deleteProduct(productId), 1000);
                    if (deleted === null) {
                        card.remove();
                        console.log('Product deleted successfully');
                        displayMessage(`Product deleted: ${product.name}`, 'success');
                    } else {
                        console.log('Failed to delete product');
                        displayMessage(`Failed to delete product: ${product.name}`, 'danger');
                    }
                } catch (error) {
                    console.log('Cannot delete product', error);
                    displayMessage('Failed to delete product', 'danger');
                } finally {
                    hideSpinner();
                    myModal.hide();
                }
            });
        });

        const editBtn = document.createElement('a');
        editBtn.classList.add('btn', 'btn-outline-warning', 'fas', 'fa-edit');
        editBtn.href = `add.html?productId=${product.productId}`;
        editBtn.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = editBtn.href;
        });
        cardBody.appendChild(editBtn);
    }
    return card;
}

//function to display the relevant messages in the message box 
//cant use alerts to display messages 
function displayMessage(message, type) {
    messageBox.textContent = message;
    messageBox.classList.remove('d-none', 'alert-success', 'alert-danger');
    messageBox.classList.add(`alert-${type}`);
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