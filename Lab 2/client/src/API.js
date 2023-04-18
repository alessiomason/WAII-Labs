const APIURL = 'http://localhost:8080/API'

async function getProducts() {
    // call /api/products
    const response = await fetch(new URL('/products', APIURL));
    const products = await response.json();
    if (response.ok)
        return products.map((prod) => ({
            ean: prod.ean,
            name: prod.name,
            brand: prod.brand
        }))
    else throw products;
}

const API = {
    getProducts
};
export default API;