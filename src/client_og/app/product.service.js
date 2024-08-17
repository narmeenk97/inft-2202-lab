function ProductService(host) {
    this.host = host;
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
                //'apiKey': this.apiKey
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

ProductService.prototype.findProduct = async function(product_id) {
    try {
        const res = await fetch(`${this.host}/${product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                //'apiKey': this.apiKey                
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
                //'apiKey': this.apiKey                
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

ProductService.prototype.updateProduct = async function(product_id, updatedProduct) {
    try {
        const res = await fetch(`${this.host}/${product_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                //'apiKey': this.apiKey
            },
            body: JSON.stringify(updatedProduct)
        });
        // Log the response if a 409 error occurs
        if (res.status === 409) {
            const errorData = await res.json();
            console.log('409 Conflict Error:', errorData); 
            throw new Error(`Response Status: 409 - ${errorData.message || 'Validation Failed'}`);
        }
        this.responseStatus(res);
        const result = await res.json();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error during product update:', error);
        throw error;
    }
};

ProductService.prototype.deleteProduct = async function(product_id) {
    try {
        const res = await fetch(`${this.host}/${product_id}`, {
            method: 'DELETE',
            headers: {
                //'Authorization': `Bearer ${this.apikey}`,
                'Content-Type': 'application/json',
                //'apiKey': this.apiKey
            }
        });
        console.log(`Response status: ${res.status}`);
        this.responseStatus(res);
        if (res.status === 204) {
            console.log('Product successfully deleted');
            return null;
        } else {
            const result = await res.json();
            console.log('Response result:', result);
            return result;
        }
    } catch (error) {
        console.error('Error during deleteProduct:', error);
        throw error;
    }
};

// Export a function to create a new instance of ProductService
export function createProductService(host) {
    return new ProductService(host)
};