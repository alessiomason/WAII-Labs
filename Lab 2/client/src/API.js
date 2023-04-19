const APIURL = new URL('http://localhost:8080/API/')

async function getProducts() {
    // call /api/products
    const response = await fetch(new URL('products', APIURL));
    const products = await response.json();
    if (response.ok)
        return products.map((prod) => ({
            ean: prod.ean,
            name: prod.name,
            brand: prod.brand
        }))
    else throw products;
}

async function getProductById(ean) {
    // call /api/products/:ean
    const response = await fetch(new URL('products/' + ean, APIURL));
    const product = await response.json();
    if (response.ok)
        return ({
            ean: product.ean,
            name: product.name,
            brand: product.brand
        });
    else throw product;
}

async function getProfileById(email) {
    // call /api/profiles/:email
    const response = await fetch(new URL('profiles/' + email, APIURL));
    const profile = await response.json();
    if (response.ok)
        return ({
            email: profile.name,
            firstName: profile.name,
            lastName: profile.lastName,
            phone: profile.phone
        });
    else throw profile;
}

function createProfile(profile) {
    // call: POST /api/profiles
    return new Promise((resolve, reject) => {
        fetch(new URL('profiles', APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                email: profile.email,
                firstName: profile.name,
                lastName: profile.lastName,
                phone: profile.phone
            }),

        }).then((response) => {
            if (response.ok)
                resolve(response.json());
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function editProfile(editedProfile) {
    // call: PUT /api/profiles/:email
    return new Promise((resolve, reject) => {
        fetch(new URL('profiles/' , APIURL), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: editedProfile.firstName,
                lastName: editedProfile.lastName,
                phone: editedProfile.phone
            })
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((obj) => { reject(obj); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}


const API = {
    getProducts, getProductById, getProfileById, createProfile, editProfile
};
export default API;