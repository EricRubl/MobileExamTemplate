import {ListItem} from "react-native-elements";

class Entity {
    static statusFreeString = 'free';
    static statusBusyString = 'busy';

    constructor(id, name, model, status, seats, rides) {
        // number - id from the DB
        this.id = id;
        // string - name of the entity
        this.name = name;
        // string - model of the entity
        this.model = model;
        // boolean - status of the entity
        this.status = status === Entity.statusFreeString ? true : false;
        // number - number of times the entity was used
        this.rides = rides;
    }

    isAvailable() {
        return this.status;
    }

    toListItem() {
        return <ListItem
            key={this.id}
            title={`${this.id} | ${this.name} | ${this.model}`}
            subtitle={`Seats: ${this.seats} Rides: ${this.rides}`}>
        </ListItem>;
    }

    statusToString() {
        return this.status ? statusFreeString : statusBusyString;
    }

    static fromObject() {

    }

    toAddJSON() {
        return JSON.stringify({
            name: this.name,
            model: this.model,
            seats: this.seats,
        });
    }
}

export default Entity;
