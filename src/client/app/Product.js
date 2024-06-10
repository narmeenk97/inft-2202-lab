export class Product {
    constructor(name, price, onHand, description) {
        this.name = name;
        this.price = price;
        this.onHand = onHand;
        this.description = description;
    }
    toString() {
        return `${this.name} costs $${this.price}. We have ${this.onHand} on hand. Description: ${this.description}`;
    }
}

