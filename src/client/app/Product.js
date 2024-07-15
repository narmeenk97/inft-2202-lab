function Product(name, price, onHand, description, listedBy, listedAt) {
    this.name = name;
    this.price = price;
    this.onHand = onHand;
    this.description = description;
    this.listedBy = listedBy || null;
    this.listedAt = listedAt || null;
}

Product.prototype.toString = function() {
    return `${this.name} costs $${this.price}. We have ${this.onHand} on hand. Description: ${this.description}. Listed by: ${this.listedBy} at ${this.listedAt}`;
};

export function newProduct(name, price, onHand, description, listedBy, listedAt) {
    return new Product(name, price, onHand, description, listedBy, listedAt)
};

