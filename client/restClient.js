import { AsyncStorage } from "react-native";

const IP = '127.0.0.1';
const port='2101';
const url = 'http://' + IP + ":" + port;

function createRequestWithTimeout(ms, promise, message) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(new Error(message))
        }, ms);
        promise.then(resolve, reject)
    })
}


async function clearStorage(){
    await AsyncStorage.clear();
}

async function getMessages(user) {
    try {
        console.log("GET /bikes. Getting all available messages from server.");
        const requests = await createRequestWithTimeout(1000, fetch(`${url}/private/${user}`), "cannot access server");
        return JSON.parse(requests._bodyText)
    } catch(err) {
        console.log("Error while getting all available bikes from server." + err.toString());
        return []
    }
}

async function getUsers() {
    try {
        console.log("GET /bikes. Getting all available messages from server.");
        const requests = await createRequestWithTimeout(1000, fetch(`${url}/users`), "cannot access server");
        return JSON.parse(requests._bodyText)
    } catch(err) {
        console.log("Error while getting all available bikes from server." + err.toString());
        return []
    }
}

async function getAllMessages() {
    try {
        console.log("GET /all. Getting all bikes from server.");
        const requests = await createRequestWithTimeout(1000, fetch(url+'/public'), "cannot access server");
        return JSON.parse(requests._bodyText)
    } catch(err) {
        console.log("Error while getting all requests from server");
        return []
    }
}

async function getPrivateMessages(user) {
    try {
        console.log("GET /all. Getting all bikes from server.");
        const requests = await createRequestWithTimeout(1000, fetch(`${url}/sender/${user}`), "cannot access server");
        return JSON.parse(requests._bodyText)
    } catch(err) {
        console.log("Error while getting all requests from server");
        return []
    }

}

async function getReceivedMessages(user) {
    try {
        console.log("GET /all. Getting all bikes from server.");
        const requests = await createRequestWithTimeout(1000, fetch(`${url}/receiver/${user}`), "cannot access server");
        return JSON.parse(requests._bodyText)
    } catch(err) {
        console.log("Error while getting all requests from server");
        return []
    }

}

async function getBigRequests() {
    try {
        console.log("GET /big. Getting top still open requests from server.");
        const requests = await createRequestWithTimeout(1000, fetch(url+'/big'), "cannot access server");
        return JSON.parse(requests._bodyText)
    } catch(err) {
        console.log("Error while getting top open requests from server");
        return []
    }
}

async function loan(id) {
    try {
        console.log("POST /loan. Fulfilling a request.");
        let request =  fetch(url + '/loan', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            })
        });
        const response = await createRequestWithTimeout(1000, request, "cannot complete loan request on server");
        return JSON.parse(response._bodyText).success;
    } catch (error) {
        console.log("Error fulfill to server: ", error);
        return false;
    }
}

 async function returnBike(id) {
    try {
        console.log("POST /return. Fulfilling a request.");
        let request =  fetch(url + '/return', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            })
        });
        const response = await createRequestWithTimeout(1000, request, "cannot complete return request on server");
        return JSON.parse(response._bodyText).success;
    } catch (error) {
        console.log("Error return to server: ", error);
        return false;
    }

}

async function deleteMessage(id){
    try {
        console.log("DELETE /request. Deleting a request.");
        let deleteRequest =  fetch(url + '/message/' + id, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        });
        const response = await createRequestWithTimeout(1000, deleteRequest, "cannot complete delete request on server");
        return JSON.parse(response._bodyText).success;
    } catch (error) {
        // Error saving data
        console.log("Error while deleting the request: ", error);
        return false;
    }
}

async function addBike(request){
    try {
        console.log("POST /request. Adding a new request.");
        let addRequest =  fetch(url + '/message', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                request
            )
        });
        const response = await createRequestWithTimeout(3000, addRequest, "cannot complete addition operation on server");
        if(response._bodyText.id !== null) {
            //we have error
            console.log(response._bodyText);
            return JSON.parse(response._bodyText.text);
        }
        else
        {
            console.log("Added successfully");
            return "Added successfully";
        }
    } catch (error) {
        // Error saving data
        return false;
    }
}


async function addRecord(record){
    try{
        let records = await AsyncStorage.getItem('MESSAGES');
        if(records == null) {
            records = [];
        }
        else
            records = JSON.parse(records);
        await AsyncStorage.setItem('MESSAGES', JSON.stringify([...records, record]));
        return true;
    }
    catch (error) {
        // Error retrieving data
        console.log("Error adding fulfilled request to async storage: ", error);
        return false;
    }
}

async function getRecords() {
    try {
        const records = await AsyncStorage.getItem('MESSAGES');
        if (records !== null) {
            return JSON.parse(records);
        }
        else
            return [];
    } catch (error) {
        // Error retrieving data
        console.log("Error retrieving records from local storage: ", error);
        return [];
    }
}

async function setUserName(record){
    try{
        let records = await AsyncStorage.getItem('USERNAME');
        if(records == null) {
            records = [];
        }
        else
            records = JSON.parse(records);
        await AsyncStorage.setItem('USERNAME', JSON.stringify([...records, record]));
        return true;
    }
    catch (error) {
        // Error retrieving data
        console.log("Error adding fulfilled request to async storage: ", error);
        return false;
    }
}

async function getUserName(){
    try {
        const records = await AsyncStorage.getItem('USERNAME');
        if (records !== null) {
            return JSON.parse(records);
        }
        else
            return '';
    } catch (error) {
        // Error retrieving data
        console.log("Error retrieving records from local storage: ", error);
        return '';
    }
}

module.exports = {getReceivedMessages, getPrivateMessages, getUsers, getMessages, clearStorage, getBigRequests, loan, returnBike, addRecord, getRecords, getAllMessages, deleteMessage, addBike, setUserName, getUserName};