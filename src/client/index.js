import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navigo from 'navigo';

import HeaderComponent from './app/components/header/header.js';
import FooterComponent from './app/components/footer/footer.js';
import HomePage from './app/pages/home/home.js';
import AboutPage from './app/pages/about/about.js';
import ContactPage from './app/pages/contact/contact.js'
import ListProducts from './app/pages/list-products/list-products.js';
import CreateProduct from './app/pages/create-products/create-product.js';

export const router = new Navigo('/');

window.addEventListener('load', () => {
    HeaderComponent();
    FooterComponent();

    router 
        .on('/', HomePage)
        .on('/about.html', AboutPage)
        .on('/contact.html', ContactPage)
        .on('/add.html', CreateProduct)
        .on('/list.html', ListProducts)
        .resolve();
});

console.log("Hello World!");
