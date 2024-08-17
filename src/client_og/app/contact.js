import { saveMessage } from "./contact.mock.js";

document.addEventListener("DOMContentLoaded", () => {
    const formElement = document.getElementById("form");

    formElement.addEventListener('submit', (event) => {
        event.preventDefault();

        const isValid = validateContactForm(formElement);

        if (isValid) {
            console.log(`Name: ${formElement.name.value}`);
            console.log(`Phone: ${formElement.phone.value}`);
            console.log(`Email: ${formElement.email.value}`);
            console.log(`Message: ${formElement.message.value}`);

            saveMessage(formElement);
            formElement.reset();
            console.log("Message saved!");
        }
    });
//validate the input from the contact form 
function validateContactForm(form) {

    let valid = true;

    //Check if name field is valid 
    const name = form.name.value;
    const eleNameError = form.name.nextElementSibling;
    if (name === "") {
        eleNameError.classList.remove('d-none');
        eleNameError.textContent = "You must fill this field.";
        valid = false;
    } else {
        eleNameError.classList.add('d-none');
    }
    const phone = form.phone.value;
    const elePhoneError = form.phone.nextElementSibling;
    if (phone === "") {
        elePhoneError.classList.remove('d-none');
        elePhoneError.textContent = "You must fill this field.";
        valid = false;
    } else {
        elePhoneError.classList.add('d-none');
    }
    const email = form.email.value;
    const eleEmailError = form.email.nextElementSibling
    if (email === "") {
        eleEmailError.classList.remove('d-none');
        eleEmailError.textContent = "You must fill this field.";
        valid = false;
    } else {
        eleEmailError.classList.add('d-none');
    }
    const message = form.message.value;
    const eleMessageError = form.message.nextElementSibling;
    if (message === "") {
        eleMessageError.classList.remove('d-none');
        eleMessageError.textContent = "You must fill this field.";
        valid = false;
    } else {
        eleMessageError.classList.add('d-none');
    }
    return valid;
}
});