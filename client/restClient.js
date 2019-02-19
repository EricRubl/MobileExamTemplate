export const IP = '127.0.0.1';  // change this according to your needs
export const PORT = '4022';  // and this
const URL = 'http://' + IP + ":" + PORT;

function createRequestWithTimeout(ms, promise, message) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error(message))
        }, ms);
        promise.then(resolve, reject)
    })
}

export async function getFreeEntities() {
    try {
        console.log("GET /boats. Getting free boats from server.");
        const boats = await createRequestWithTimeout(1000, fetch(URL + '/boats'), "Cannot access server");
        return JSON.parse(boats._bodyText)
    } catch (err) {
        console.log("Error while getting free boats from server");
        throw Error();
    }
}

export async function getBusyEntities() {
    try {
        console.log("GET /busy. Getting busy boats from server.");
        const boats = await createRequestWithTimeout(1000, fetch(URL + '/busy'), "Cannot access server");
        return JSON.parse(boats._bodyText)
    } catch (err) {
        console.log("Error while getting busy boats from server");
        throw Error();
    }
}

export async function getAllEntities() {
    let boats = [];

    try {
        await getFreeEntities().then(free => boats = boats.concat(free));
        await getBusyEntities().then(busy => boats = boats.concat(busy));
    } catch (err) {
        throw Error('Cannot get boats from the server 😥');
    }


    return boats;
}

export async function changeEntity(id, name, status, seats) {
    try {
        console.log("POST /change. Changing boat details.");
        let request = fetch(URL + '/change', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                name: name,
                status: status,
                seats: seats,
            })
        });
        const response = await createRequestWithTimeout(1000, request, "Cannot access server");
        return JSON.parse(response._bodyText).success;
    } catch (error) {
        console.log("Error changing boat: ", error);
        throw Error('Cannot change boat on the server 😥');
    }
}

export async function incrementNumberProp(id, rides) {
    try {
        console.log("POST /rides. Changing boat details.");
        let request = fetch(URL + '/rides', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                rides: rides,
            })
        });
        const response = await createRequestWithTimeout(1000, request, "Cannot access server");
        return JSON.parse(response._bodyText).success;
    } catch (error) {
        console.log("Error adding rides: ", error);
        throw Error('Cannot add rides on the server 😥');
    }
}

export async function addEntity(name, model, seats) {
    try {
        console.log("POST /new. Adding boat.");
        let request = fetch(URL + '/new', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                model: model,
                seats: seats,
            })
        });
        const response = await createRequestWithTimeout(1000, request, "Cannot access server");
        return JSON.parse(response._bodyText).success;
    } catch (error) {
        console.log("Error adding boat: ", error);
        throw Error('Cannot add boat on the server 😥');
    }
}

export async function deleteEntity(id) {
    try {
        console.log("DELETE /boat. Deleting boat.");
        let request = fetch(URL + '/boat/' + id.toString(), {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const response = await createRequestWithTimeout(1000, request, "Cannot access server");
        return JSON.parse(response._bodyText).success;
    } catch (error) {
        console.log("Error deleting boat: ", error);
        throw Error('Cannot delete boat from the server 😥');
    }
}
