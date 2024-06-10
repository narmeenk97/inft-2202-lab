import {productService} from './product.mock.service.js';

const container = document.getElementById('cardDiv');
const messageBox = document.getElementById('message-box');
const products = productService.listProducts();

//Display message box if no products in local storage 
if (products.length === 0) {
    messageBox.classList.remove('d-none');
} else {
    drawCards(products);
}

function drawCards(products) {
    products.forEach(product => {
        const card = createCard(product);
        container.appendChild(card);
    });
}

function createCard(product) {
    const card = document.createElement('div');
    card.classList.add('card');
    
    const cardImg = document.createElement('img');
    cardImg.classList.add('card-img-top');
    cardImg.src = "../img/istockphoto-114335947-612x612.jpg";
    cardImg.alt = product.name;
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
    cardOnHand.textContent = `QTY: ${product.onHand}`;
    cardBody.appendChild(cardOnHand);

    const addToCart = document.createElement('a');
    addToCart.classList.add('btn', 'btn-outline-primary');
    addToCart.href = "#";
    addToCart.textContent = "Add to cart";
    cardBody.appendChild(addToCart);

    const deleteBtn = document.createElement('a');
    deleteBtn.classList.add('btn', 'btn-outline-danger', 'fas', 'fa-trash-alt');
    deleteBtn.href = "#";
    cardBody.appendChild(deleteBtn);

      // Add event listener for the delete button
      deleteBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();

        // Event handler for clicking the delete button in the modal
        document.getElementById('delete').addEventListener('click', function() {
            if (productService.deleteProduct(product.name)) {
                // Remove the deleted card from the UI
                card.remove();
            } else {
                console.error("Failed to delete product");
            }
            myModal.hide();
        });
    });

    const editBtn = document.createElement('a');
    editBtn.classList.add('btn', 'btn-outline-warning', 'fas', 'fa-edit');
    cardBody.appendChild(editBtn);
    editBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const url = "add.html?name=" + product.name;
        window.location.href = url;
    });

    return card;
}
