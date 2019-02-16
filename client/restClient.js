const IP = '127.0.0.1';
const PORT = '4022';
const URL = 'http://' + IP + ":" + PORT;

function createRequestWithTimeout(ms, promise, message) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            reject(new Error(message))
        }, ms);
        promise.then(resolve, reject)
    })
}

export async function getFreeBoats() {
    try {
        console.log("GET /boats. Getting free boats from server.");
        const boats = await createRequestWithTimeout(1000, fetch(URL + '/boats'), "Cannot access server");
        return JSON.parse(boats._bodyText)
    } catch (err) {
        console.log("Error while getting free boats from server");
        return []
    }
}

export async function getBusyBoats() {
    try {
        console.log("GET /busy. Getting busy boats from server.");
        const boats = await createRequestWithTimeout(1000, fetch(URL + '/busy'), "Cannot access server");
        return JSON.parse(boats._bodyText)
    } catch (err) {
        console.log("Error while getting busy boats from server");
        return []
    }
}

export async function getAllBoats() {
    let boats = [];

    await getFreeBoats().then(free => boats = boats.concat(free));
    await getBusyBoats().then(busy => boats = boats.concat(busy));

    return boats;
}

export async function changeBoat(id, name, status, seats) {
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
        return false;
    }
}
