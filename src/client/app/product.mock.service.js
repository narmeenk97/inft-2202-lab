import { Product } from "./Product.js";

export class ProductService {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
    }

    listProducts() {
        return this.products.map(product => new Product(product.name, product.price, product.onHand, product.description));
    }

    findProduct(name) {
        const product = this.products.find(product => product.name === name);
        return product ? new Product(product.name, product.price, product.onHand, product.description) : null;
    }

    addProduct(product) {
        if (!this.findProduct(product.name)) {
            this.products.push(product);
            localStorage.setItem('products', JSON.stringify(this.products));
            return true;
        }
        return false;
    }

    editProduct(name, updatedProduct) {
        const index = this.products.findIndex(product => product.name === name);
        if (index !== -1) {
            this.products[index] = updatedProduct;
            localStorage.setItem('products', JSON.stringify(this.products));
            return true;
        }
        return false;
    }

    deleteProduct(name) {
        const index = this.products.findIndex(product => product.name === name);
        if (index !== -1) {
            this.products.splice(index, 1);
            localStorage.setItem('products', JSON.stringify(this.products));
            return true;
        }
        return false;
    }
}

// Export a new instance of ProductService
export const productService = new ProductService();