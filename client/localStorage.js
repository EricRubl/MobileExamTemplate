import {AsyncStorage} from "react-native";

export async function clearStorage() {
    await AsyncStorage.clear();
}

export async function addBoat(boat) {
    try {
        let boats = await AsyncStorage.getItem('BOATS');

        if (boats == null) {
            boats = [];
        } else
            boats = JSON.parse(boats);

        boats.push(boat);

        await AsyncStorage.setItem('BOATS', JSON.stringify(boats));

        return true;
    } catch (error) {
        console.log("Error adding boat to async storage: ", error);

        return false;
    }
}

export async function changeBoat(id, name, status, seats) {
    try {
        let boats = await AsyncStorage.getItem('BOATS');

        boats = JSON.parse(boats);

        const index = boats.findIndex(boat => boat.id === id);

        boats[index].name = name;
        boats[index].status = status;
        boats[index].seats = seats;

        await AsyncStorage.setItem('BOATS', JSON.stringify([...boats]));

        return true;
    } catch (error) {
        console.log("Error adding fulfilled request to async storage: ", error);

        return false;
    }
}

export async function addRides(id, rides) {
    try {
        let boats = await AsyncStorage.getItem('BOATS');

        boats = JSON.parse(boats);

        const index = boats.findIndex(boat => boat.id === id);

        boats[index].rides = rides;

        await AsyncStorage.setItem('BOATS', JSON.stringify([...boats]));

        return true;
    } catch (error) {
        console.log("Error adding fulfilled request to async storage: ", error);

        return false;
    }
}

export async function getAllBoats() {
    try {
        const boats = await AsyncStorage.getItem('BOATS');

        if (boats !== null) {
            return JSON.parse(boats);
        } else
            return [];
    } catch (error) {
        console.log("Error retrieving records from local storage: ", error);

        return [];
    }
}

export async function getAllUpdates() {
    try {
        const updates = await AsyncStorage.getItem('UPDATES');

        if (updates !== null) {
            return JSON.parse(updates);
        } else
            return [];
    } catch (error) {
        console.log("Error retrieving records from local storage: ", error);

        return [];
    }
}

export async function addUpdate(update) {
    try {
        let updates = await AsyncStorage.getItem('UPDATES');

        if (updates == null) {
            updates = [];
        } else
            updates = JSON.parse(updates);

        await AsyncStorage.setItem('UPDATES', JSON.stringify([...updates, update]));

        return true;
    } catch (error) {
        console.log("Error adding update to async storage: ", error);

        return false;
    }
}

export async function clearUpdates() {
    try {
        await AsyncStorage.setItem('UPDATES', JSON.stringify([]));

        return true;
    } catch (error) {
        console.log("Error deleting updates from async storage: ", error);

        return false;
    }
}