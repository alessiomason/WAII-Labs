const APIURL = new URL('http://localhost:8080/API/')

async function login(email, password) {
    // call /API/login
    const response = await fetch(new URL('login', APIURL), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            email: email,
            password: password
        }),

    });

    const jwtDTO = await response.json();
    if (response.ok) return jwtDTO;
    else throw jwtDTO;
}

async function refreshLogin(refreshToken) {
    // call /API/refreshLogin
    const response = await fetch(new URL('refreshLogin', APIURL), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            refreshToken: refreshToken
        }),

    });

    const jwtDTO = await response.json();
    if (response.ok) return jwtDTO;
    else throw jwtDTO;
}

async function getProducts() {
    const accessToken = localStorage.getItem('accessToken');

    // call /API/products
    const response = await fetch(new URL('products', APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    const products = await response.json();
    if (response.ok)
        return products.map((product) => ({
            ean: product.ean,
            name: product.name,
            brand: product.brand
        }))
    else throw products;
}

async function getProductById(ean) {
    // call /API/products/:ean
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

async function getPurchases() {
    const accessToken = localStorage.getItem('accessToken');

    // call /API/purchases
    const response = await fetch(new URL('purchases', APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    const purchases = await response.json();
    if (response.ok)
        return purchases.map((purchase) => ({
            id: purchase.id,
            customer: purchase.customer,
            product: purchase.product,
            status: purchase.status,
            dateOfPurchase: purchase.dateOfPurchase,
            warranty: purchase.warranty,
            coveredByWarranty: purchase.coveredByWarranty,
            ticketIds: purchase.ticketIds
        }))
    else throw purchases;
}

async function getTickets() {
    const accessToken = localStorage.getItem('accessToken');

    // call /API/tickets
    const response = await fetch(new URL('tickets', APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    const tickets = await response.json();
    if (response.ok)
        return tickets.map((ticket) => ({
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            purchase: ticket.purchase,
            expert: ticket.expert,
            ticketStatus: ticket.ticketStatus,
            priorityLevel: ticket.priorityLevel
        }))
    else throw tickets;
}

async function getTicketById(ticketId) {
    const accessToken = localStorage.getItem('accessToken');

    // call /API/tickets/:id
    const response = await fetch(new URL('tickets/' + ticketId, APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const ticket = await response.json();
    if (response.ok)
        return ({
            id: ticket.id,
            title: ticket.title,
            description: ticket.description,
            purchase: ticket.purchase,
            expert: ticket.expert,
            ticketStatus: ticket.ticketStatus,
            priorityLevel: ticket.priorityLevel,
            chat: ticket.chat
        });
    else throw ticket;
}

function createChat(ticketId) {
    const accessToken = localStorage.getItem('accessToken');

    // call: POST /API/tickets/:ticketId/chat
    return new Promise((resolve, reject) => {
        fetch(new URL(`tickets/${ticketId}/chat`, APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
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

function sendMessage(ticketId, message) {
    const accessToken = localStorage.getItem('accessToken');

    // call: POST /API/tickets/:ticketId/chat/messages
    return new Promise((resolve, reject) => {
        fetch(new URL(`tickets/${ticketId}/chat/messages`, APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

            body: JSON.stringify({
                text: message.text,
                to: message.to
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

function closeChat(ticketId) {
    const accessToken = localStorage.getItem('accessToken');

    // call: PUT /API/tickets/:ticketId/chat
    return new Promise((resolve, reject) => {
        fetch(new URL(`tickets/${ticketId}/chat`, APIURL), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
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

async function getProfileById(email) {
    // call /API/profiles/:email
    const response = await fetch(new URL('profiles/' + email, APIURL));
    const profile = await response.json();
    if (response.ok)
        return ({
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone
        });
    else throw profile;
}

function createProfile(profile) {
    // call: POST /API/profiles
    return new Promise((resolve, reject) => {
        fetch(new URL('profiles', APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                email: profile.email,
                firstName: profile.firstName,
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
    // call: PUT /API/profiles/:email
    return new Promise((resolve, reject) => {
        fetch(new URL('profiles/' + editedProfile.email, APIURL), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: editedProfile.email,
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
    login,
    refreshLogin,
    getProducts,
    getProductById,
    getTickets,
    getTicketById,
    getPurchases,
    createChat,
    sendMessage,
    closeChat,
    getProfileById,
    createProfile,
    editProfile
};

export default API;