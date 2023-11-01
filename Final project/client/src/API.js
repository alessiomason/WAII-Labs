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

function createCustomer(customer) {
    // call: POST /API/signup
    return new Promise((resolve, reject) => {
        fetch(new URL(`signup`, APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: customer.email,
                password: customer.password,
                firstName: customer.firstName,
                lastName: customer.lastName,
                phone: customer.phone
            })
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function createExpert(expert) {
    // call: POST /API/experts
    return new Promise((resolve, reject) => {
        fetch(new URL(`experts`, APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: expert.email,
                password: expert.password,
                firstName: expert.firstName,
                lastName: expert.lastName
            })
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
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

async function getPurchaseById(purchaseId) {
    const accessToken = localStorage.getItem('accessToken');

    // call /API/purchases/:id
    const response = await fetch(new URL('purchases/' + purchaseId, APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const purchase = await response.json();
    if (response.ok)
        return ({
            id: purchase.id,
            customer: purchase.customer,
            product: purchase.product,
            status: purchase.status,
            dateOfPurchase: purchase.dateOfPurchase,
            warranty: purchase.warranty,
            coveredByWarranty: purchase.coveredByWarranty,
            ticketIds: purchase.ticketIds
        });
    else throw purchase;
}

function insertPurchase(purchase) {
    const accessToken = localStorage.getItem('accessToken');
    // call: POST /API/purchases
    return new Promise((resolve, reject) => {
        fetch(new URL(`purchases`, APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                customer: purchase.customer,
                product: purchase.product,
                status: purchase.status,
                dateOfPurchase: purchase.dateOfPurchase
            })
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

function addWarranty(purchaseId, expiryDate) {
    const accessToken = localStorage.getItem('accessToken');

    // call: POST /API/purchases/:id/warranty
    return new Promise((resolve, reject) => {
        fetch(new URL(`purchases/${purchaseId}/warranty`, APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

            body: JSON.stringify({
                expiryDate: expiryDate
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

async function getExperts() {
    const accessToken = localStorage.getItem('accessToken');

    // call /API/experts
    const response = await fetch(new URL('experts', APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    const experts = await response.json();
    if (response.ok)
        return experts.map((expert) => ({
            id: expert.id,
            firstName: expert.firstName,
            lastName: expert.lastName,
            authorized: expert.authorized,
            specializations: expert.specializations,
            ticketIds: expert.ticketIds
        }))
    else throw experts;
}

async function getExpertById(expertId) {
    const accessToken = localStorage.getItem('accessToken');

    // call /API/experts/:id
    const response = await fetch(new URL('experts/' + expertId, APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const expert = await response.json();
    if (response.ok)
        return ({
            id: expert.id,
            firstName: expert.firstName,
            lastName: expert.lastName,
            authorized: expert.authorized,
            specializations: expert.specializations,
            ticketIds: expert.ticketIds
        });
    else throw expert;
}

async function getExpertByEmail(email) {
    const accessToken = localStorage.getItem('accessToken');
    // call /API/expertsByEmail/:email
    const response = await fetch(new URL('expertsByEmail/' + email, APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const expert = await response.json();
    if (response.ok)
        return ({
            id: expert.id,
            firstName: expert.firstName,
            lastName: expert.lastName,
            authorized: expert.authorized,
            specializations: expert.specializations,
            ticketIds: expert.ticketIds
        });
    else throw expert;
}

function authorizeExpert(expertId, authorized) {
    const accessToken = localStorage.getItem('accessToken');

    // call: PATCH /API/experts/:id/authorize
    return new Promise((resolve, reject) => {
        fetch(new URL(`experts/${expertId}/authorize`, APIURL), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },

            body: JSON.stringify({
                authorized: authorized
            }),

        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
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

function createTicket(ticket) {
    const accessToken = localStorage.getItem('accessToken');
    // call: POST /API/tickets
    return new Promise((resolve, reject) => {
        fetch(new URL(`tickets`, APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                title: ticket.title,
                description: ticket.description,
                purchase: ticket.purchase
            })
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

function editTicket(editedTicket) {
    const accessToken = localStorage.getItem('accessToken');
    // call: PUT /API/tickets/properties
    return new Promise((resolve, reject) => {
        fetch(new URL(`tickets/properties`, APIURL), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                id: editedTicket.id,
                title: editedTicket.title,
                description: editedTicket.description,
                purchase: editedTicket.purchase,
                expert: editedTicket.expert,
                ticketStatus: editedTicket.ticketStatus,
                priorityLevel: editedTicket.priorityLevel,
                chat: editedTicket.chat
            })
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function editPurchase(purchaseId, newPurchaseStatus) {
    const accessToken = localStorage.getItem('accessToken');
    // call: PUT /API/purchases/{id}
    return new Promise((resolve, reject) => {
        fetch(new URL(`purchases/${purchaseId}`, APIURL), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: newPurchaseStatus
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function assignExpert(ticket, selectedExpert) {
    const accessToken = localStorage.getItem('accessToken');
    // call: POST /API/tickets/expert
    return new Promise((resolve, reject) => {
        fetch(new URL(`tickets/expert`, APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                id: ticket.id,
                title: ticket.title,
                description: ticket.description,
                purchase: ticket.purchase,
                expert: selectedExpert,
                ticketStatus: ticket.ticketStatus,
                priorityLevel: ticket.priorityLevel,
                chat: ticket.chat
            })
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
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

function sendMessage(ticketId, text) {
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
                text: text
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
    const accessToken = localStorage.getItem('accessToken');
    // call /API/profiles/:email
    const response = await fetch(new URL('profiles/' + email, APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const profile = await response.json();
    if (response.ok)
        return ({
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone
        });
    else throw profile;
}

async function getProfileByEmail(email) {
    const accessToken = localStorage.getItem('accessToken');
    // call /API/profilesByEmail/:email
    const response = await fetch(new URL('profilesByEmail/' + email, APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const profile = await response.json();
    if (response.ok)
        return ({
            id: profile.id,
            email: profile.email,
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone
        });
    else throw profile;
}

/* function createProfile(profile) {
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
*/

function editProfile(editedProfile) {
    const accessToken = localStorage.getItem('accessToken');
    // call: PUT /API/profiles
    return new Promise((resolve, reject) => {
        fetch(new URL(`profiles`, APIURL), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                id: editedProfile.id,
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
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function editExpert(editedProfile) {
    const accessToken = localStorage.getItem('accessToken');
    // call: PUT /API/experts
    return new Promise((resolve, reject) => {
        fetch(new URL(`experts`, APIURL), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                id: editedProfile.id,
                firstName: editedProfile.firstName,
                lastName: editedProfile.lastName,
                specializations: editedProfile.specializations,
                ticketIds: editedProfile.ticketIds
            })
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function removeSpecialization(specialization) {
    const accessToken = localStorage.getItem('accessToken');
    // call: DELETE /API/experts/specialization
    return new Promise((resolve, reject) => {
        fetch(new URL('experts/specialization', APIURL), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                id: specialization.id,
                name: specialization.name
            })
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

function addSpecialization(expertId, specializationName) {
    const accessToken = localStorage.getItem('accessToken');
    // call: POST /API/experts/{id}/specialization
    return new Promise((resolve, reject) => {
        fetch(new URL(`experts/${expertId}/specialization`, APIURL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: specializationName
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

async function getManagerById(managerId) {
    const accessToken = localStorage.getItem('accessToken');

    // call /API/managers/:id
    const response = await fetch(new URL('managers/' + managerId, APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const manager = await response.json();
    if (response.ok)
        return ({
            id: manager.id,
            firstName: manager.firstName,
            lastName: manager.lastName,
        });
    else throw manager;
}

async function getManagerByEmail(email) {
    const accessToken = localStorage.getItem('accessToken');
    // call /API/managersByEmail/:email
    const response = await fetch(new URL('managersByEmail/' + email, APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });
    const manager = await response.json();
    if (response.ok)
        return ({
            id: manager.id,
            firstName: manager.firstName,
            lastName: manager.lastName
        });
    else throw manager;
}

function editManager(editedProfile) {
    const accessToken = localStorage.getItem('accessToken');
    // call: PUT /API/managers
    return new Promise((resolve, reject) => {
        fetch(new URL(`managers`, APIURL), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                id: editedProfile.id,
                firstName: editedProfile.firstName,
                lastName: editedProfile.lastName
            })
        }).then((response) => {
            if (response.ok)
                resolve(null);
            else {
                // analyze the cause of error
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}

async function getLogsByTicket(ticketId) {
    const accessToken = localStorage.getItem('accessToken');

    // call /API/logs/ticket/:ticketId
    const response = await fetch(new URL('logs/ticket/' + ticketId, APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    const logs = await response.json();
    if (response.ok)
        return logs.map((log) => ({
            id: log.id,
            previousTicketStatus: log.previousTicketStatus,
            newTicketStatus: log.newTicketStatus,
            time: log.time,
            ticket: log.ticket
        }))
    else throw logs;
}

async function getLogsByExpert(expertId) {
    const accessToken = localStorage.getItem('accessToken');

    // call /API/logs/expert/:expertId
    const response = await fetch(new URL('logs/expert/' + expertId, APIURL), {
        headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    const logs = await response.json();
    if (response.ok)
        return logs.map((log) => ({
            id: log.id,
            previousTicketStatus: log.previousTicketStatus,
            newTicketStatus: log.newTicketStatus,
            time: log.time,
            ticket: log.ticket
        }))
    else throw logs;
}

const API = {
    login,
    refreshLogin,
    getProducts,
    getProductById,
    getPurchases,
    getPurchaseById,
    insertPurchase,
    addWarranty,
    getExperts,
    getExpertById,
    getExpertByEmail,
    authorizeExpert,
    getTickets,
    getTicketById,
    createTicket,
    editTicket,
    editPurchase,
    createChat,
    sendMessage,
    closeChat,
    getProfileById,
    getProfileByEmail,
    createCustomer,
    createExpert,
    editProfile,
    editExpert,
    removeSpecialization,
    addSpecialization,
    getManagerById,
    getManagerByEmail,
    editManager,
    assignExpert,
    getLogsByTicket,
    getLogsByExpert
};

export default API;