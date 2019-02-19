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

    isAvailable() {
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
        return '/new';
    }

    static getDeleteEntityURL() {
        return '/boat/';
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

    getChangeBody() {
        return {
            id: this.id,
            name: this.name,
            seats: this.seats,
            status: this.statusToString(),
        }
    }

    getAddBody() {
        return {
            name: this.name,
            model: this.model,
            seats: this.seats,
        }
    }

    incrementNumberProp(increment) {
        this.rides += increment;

    }

    setName(newName) {
        this.name = newName;

        return this;
    }

    setSeats(newSeats) {
        this.seats = newSeats;

        return this;
    }

    setStatus(newStatus) {
        this.status = newStatus;

        return this;
    }

    setModel(newModel) {
        this.model = newModel;

        return this;
    }

    toListItem(callback) {
        return <ListItem
            key={this.id}
            title={`${this.id} | ${this.name} | ${this.model}`}
            subtitle={`Seats: ${this.seats} Rides: ${this.rides}`}
            onPress={() => {
                if (callback)
                    callback(this);
            }}>
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

    toDict() {
        return {
            id: this.id,
            name: this.name,
            status: this.statusToString(),
            model: this.model,
            rides: this.rides,
            seats: this.seats,
        }
    }

    getNumberProp() {
        return this.rides;
    }
}

export default Entity;
