import { validateForm } from "./add.js";
import { productService } from "./product.mock.service.js";

let params = new URL(document.location).searchParams;
let name = params.get('name');
if (name) {
    setUpEditForm();
}

function setUpEditForm() {
    //get a reference to the heading 
    const heading = document.querySelector('h2');
    heading.textContent = 'Edit Treat';
    //get reference to submit button 
    const button = document.getElementById('button');
    button.textContent = 'Update Treat';
    //use the name from the URL to find product
    let product = productService.findProduct(name);
    //get reference to the form 
    const treatForm = document.getElementById('form');
    //set the field values 
    treatForm.name.value = product.name;
    treatForm.price.value = product.price;
    treatForm.qty.value = product.onHand;
    treatForm.description.value = product.description;
    treatForm.name.disabled = true;
    treatForm.addEventListener('submit', submitEditForm);
}
function submitEditForm(event) {
    event.preventDefault();
    const valid = validateForm(event.target);
    if (valid) {
        //get the product data from the form 
        const product = {
            name: event.target.name.value,
            price: event.target.price.value,
            onHand: event.target.onHand.value,
            description: event.target.description.value
        };
        const updated = productService.editProduct(product);
        if (updated) {
            window.location.href = "list.html";
        } else {
            console.log('Failed to update product')
        }
    }
}