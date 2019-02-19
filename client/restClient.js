import Entity from "../components/Entity";

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
        console.log('GET ' + Entity.getFreeEntitiesURL());
        const entities = await createRequestWithTimeout(1000, fetch(URL + Entity.getFreeEntitiesURL()), "Cannot access server");
        return JSON.parse(entities._bodyText).map(dict => Entity.fromObject(dict));
    } catch (err) {
        console.log("Error while getting entities from server", err);
        throw Error();
    }
}

export async function getBusyEntities() {
    try {
        console.log('GET ' + Entity.getBusyEntitiesURL());
        const entities = await createRequestWithTimeout(1000, fetch(URL + Entity.getBusyEntitiesURL()), "Cannot access server");
        return JSON.parse(entities._bodyText).map(dict => Entity.fromObject(dict));
    } catch (err) {
        console.log("Error while getting busy boats from server");
        throw Error();
    }
}

export async function getAllEntities() {
    let entities = [];

    try {
        await getFreeEntities().then(free => entities = [...entities, ...free]);
        await getBusyEntities().then(busy => entities = [...entities, ...busy]);
    } catch (err) {
        throw Error('Cannot get boats from the server 😥');
    }

    return entities;
}

export async function changeEntity(entity) {
    try {
        console.log('POST ' + Entity.getChangeEntityURL());

        let request = fetch(URL + Entity.getChangeEntityURL(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(entity.getChangeBody())
        });

        await createRequestWithTimeout(1000, request, "Cannot access server");
    } catch (error) {
        console.log("Error changing entity: ", error);
        throw Error('Cannot change entity on the server 😥');
    }
}

export async function incrementNumberProp(id, rides) {
    try {
        console.log('POST ' + Entity.getIncrementRidesURL());
        let request = fetch(URL + Entity.getIncrementRidesURL(), {
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

export async function addEntity(incompleteEntity) {
    try {
        console.log('POST ' + Entity.getAddEntityURL());
        let request = fetch(URL + Entity.getAddEntityURL(), {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(incompleteEntity.getAddBody())
        });

        await createRequestWithTimeout(1000, request, "Cannot access server");

    } catch (error) {
        console.log("Error adding boat: ", error);
        throw Error('Cannot add boat on the server 😥');
    }
}

export async function deleteEntity(id) {
    try {
        console.log('DELETE ' + Entity.getDeleteEntityURL());
        let request = fetch(URL + Entity.getDeleteEntityURL() + id.toString(), {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });

        await createRequestWithTimeout(1000, request, "Cannot access server");

    } catch (error) {
        console.log("Error deleting entity: ", error);
        throw Error('Cannot delete entity from the server 😥');
    }
}
