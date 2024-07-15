function ProductService(host, apiKey) {
    this.host = host;
    this.apiKey = apiKey;
}


//function to check whether the response status is anything other than 200/204
ProductService.prototype.responseStatus = function(res) {
    if (![200, 204].includes(res.status)) {
        throw new Error (`Response Status: ${res.status}`);
    }
};

ProductService.prototype.listProducts = async function(page, perPage) {
    try {
        const res = await fetch (`${this.host}?page=${page}&perPage=${perPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': this.apiKey
            }
        });
        //call the function to check the response status and throw an error if needed 
        this.responseStatus(res);
        const result = await res.json();
        console.log(result);
        return result;    
    } catch (error) {
        console.error(error);
        throw error;
    }
};

ProductService.prototype.findProduct = async function(productId) {
    try {
        const res = await fetch(`${this.host}/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': this.apiKey                
            }
        });
        this.responseStatus(res);
        const result = await res.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

ProductService.prototype.addProduct = async function(product) {
    try {
        const res = await fetch(this.host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': this.apiKey                
            },
            body: JSON.stringify(product)
        });
        if (res.status === 409) {
            const errorData = await res.json();
            // Log the error details
            console.log('409 Conflict Error:', errorData); 
            throw new Error(`Response Status: 409 - ${errorData.message}`);
        }
        this.responseStatus(res);
        const result = await res.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

ProductService.prototype.updateProduct = async function(productId, updatedProduct) {
    try {
        const res = await fetch(`${this.host}/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': this.apiKey
            },
            body: JSON.stringify(updatedProduct)
        });
        this.responseStatus(res);
        const result = await res.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

ProductService.prototype.deleteProduct = async function(productId) {
    try {
        const res = await fetch(`${this.host}/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.apikey}`,
                'Content-Type': 'application/json',
                'apiKey': this.apiKey
            }
        });
        this.responseStatus(res);
        const result = res.status === 204 ? null : await res.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Export a function to create a new instance of ProductService
export function createProductService(host, apikey) {
    return new ProductService(host, apikey)
};