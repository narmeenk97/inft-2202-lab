import tmplContact from './contact.ejs';
import ContactMessage from '../../../../server/models/ContactMessage.js';
export default async (route) => {
    console.log(route);
    const {messages} = onInit();
    const strContact = tmplContact({messages});
    document.getElementById('app').innerHTML = strContact;
    onRender();
}

function onInit() 
{
    // make sure storage is set up for messages
    if (!localStorage.getItem('messages')) {
        localStorage.setItem('messages', JSON.stringify([]));
    }
    // get a list of messages
    const messages = JSON.parse(localStorage.getItem('messages'));
    // i like to return an object here so it's easily changeable
    return { messages }
}

function onRender() 
{
    // get a reference to the form
    const formElement = document.getElementById('form');
    // attach the event listener
    formElement.addEventListener('submit', formSubmitHandler);
}

function formSubmitHandler (event) {
    // stop the default handler from executing
    event.preventDefault();
    // log out some values, event.target will be the actual form element
    console.log(`name: ${event.target.name.value}`);
    console.log(`phone: ${event.target.phone.value}`);
    console.log(`email: ${event.target.email.value}`);
    console.log(`message: ${event.target.message.value}`);
    /* 
     *  Should probably do some kind of input validation here
     */
    const form = event.target;
    const isValid = validateContactForm(form);
    if (!isValid) {
        return;
    }
    // create a new ContactMessage
    const message = new ContactMessage({
        name: event.target.name.value,
        phone: event.target.phone.value,
        email: event.target.email.value,
        message: event.target.message.value,
    })
    // get existing list of messages
    const store = JSON.parse(localStorage.getItem('messages'));
    // add this message to it
    store.push(message);
    // try to store it
    localStorage.setItem('messages', JSON.stringify(store));
    console.log('Message saved');
    //re-render the contact page to show the message 
    const { messages } = onInit();
    const strContact = tmplContact({messages});
    document.getElementById('app').innerHTML = strContact;
    onRender();
}

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