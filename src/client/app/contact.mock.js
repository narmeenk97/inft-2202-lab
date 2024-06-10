export function saveMessage(form) {
    const formData = {
        name: form.name.value,
        phone: form.phone.value,
        email: form.email.value,
        message: form.message.value
    };
    localStorage.setItem('contactFormMessage', JSON.stringify(formData));
}