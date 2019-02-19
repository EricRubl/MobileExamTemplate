import React from 'react';
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
        this.status = status === Entity.statusFreeString;
        // number - number seats
        this.seats = seats;
        // number - number of times the entity was used
        this.rides = rides;
    }

    static isAvailable() {
        return this.status;
    }

    static getFreeEntitiesURL() {
        return '/boats';
    }

    static getBusyEntitiesURL() {
        return '/busy';
    }

    static getChangeEntityURL() {
        return '/change';
    }

    static getIncrementRidesURL() {
        return '/rides';
    }

    static getAddEntityURL() {
        return '/add';
    }


    /**
     * @param  {Entity} updater Entity object to update
     */
    update(updater) {
        this.name = updater.name;
        this.model = updater.model;
        this.status = updater.status;
        this.seats = updater.seats;
        this.rides = updater.rides;
    }

    incrementNumberProp() {

    }

    toListItem() {
        return <ListItem
            key={this.id}
            title={`${this.id} | ${this.name} | ${this.model}`}
            subtitle={`Seats: ${this.seats} Rides: ${this.rides}`}>
        </ListItem>;
    }

    statusToString() {
        return this.status ? Entity.statusFreeString : Entity.statusBusyString;
    }

    static fromObject(obj) {
        return new Entity(obj.id, obj.name, obj.model, obj.status, obj.seats, obj.rides);
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
