import {AsyncStorage} from "react-native";

export async function clearStorage() {
    await AsyncStorage.clear();
}

export async function addEntity(entity) {
    try {
        let entities = await AsyncStorage.getItem('ENTITIES');

        if (entities == null) {
            entities = [];
        } else
            entities = JSON.parse(entities);

        await AsyncStorage.setItem('ENTITIES', JSON.stringify([...entities, entity]));

        return true;
    } catch (error) {
        console.log("Error adding entity to async storage: ", error);
        return false;
    }
}

export async function changeEntity(entity) {
    try {
        let entities = await AsyncStorage.getItem('ENTITIES');

        entities = JSON.parse(entities);

        const index = entities.findIndex(entity => entity.id === id);

        entities[index].name = name;
        entities[index].status = status;
        entities[index].seats = seats;

        await AsyncStorage.setItem('ENTITIES', JSON.stringify([...entities]));

        return true;
    } catch (error) {
        console.log("Error changing entity in async storage: ", error);

        return false;
    }
}

export async function incrementNumberProp(id, rides) {
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

export async function getAllEntities() {
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