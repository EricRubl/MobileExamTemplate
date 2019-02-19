import React from 'react';
import autoBind from 'react-autobind';
import {View, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {Button, ListItem} from "react-native-elements";
import * as API from '../client/restClient';

class EmployeeLandingPage extends React.Component {


    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            boats: [],
            wsboats: [],
            spinner: false
        };

        this.ws = new WebSocket('ws://' + API.IP + ':' + API.PORT);

        this.ws.onmessage = (event) => {
            let wsboats = this.state.wsboats;
            const boat = JSON.parse(event.data);
            this.setState({wsboats: [...wsboats, boat]});
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        this.setState({spinner: true});

        try {
            const boats = await API.getAllEntities();
            this.setState({boats: boats, spinner: false});
        } catch (err) {
            Alert.alert(
                'Server error',
                err.toString(),
                [
                    {text: 'OK'},
                ],
                {cancelable: true},
            );
        }
    }

    addBoat() {
        this.props.navigation.navigate('AddBoat', {refresh: () => this.update()});
    }

    deleteBoat() {
        this.props.navigation.navigate('DeleteBoat', {refresh: () => this.update()});
    }

    clearWebSocketData() {
        this.setState({wsboats: []});
    }

    render() {
        return (
            this.state.spinner ? <ActivityIndicator size="large" color="#0000ff" /> :
            <View style={{flexDirection: 'column'}}>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.boats.filter(boat => boat.status === 'busy').sort((a, b) =>{
                            if(a.rides === b.rides) {
                                return (a.seats < b.seats) ? 1 : (a.seats > b.seats) ? -1 : 0;
                            } else {
                                return a.rides < b.rides ? 1 : -1;
                            }
                        }).map((boat) => (
                            <ListItem
                                key={boat.id}
                                title={`${boat.id} | ${boat.name} | ${boat.model}`}
                                subtitle={`Seats: ${boat.seats} Rides: ${boat.rides}`}>
                            </ListItem>
                        ))
                    }
                </ScrollView>
                <View style={{height: '20%'}}>
                    <Button onPress={this.addBoat} title={'Add boat'}/>
                    <Button onPress={this.deleteBoat} title={'Delete boat'}/>
                    <Button onPress={this.clearWebSocketData} title={'Clear WebSocket Data'}/>
                </View>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.wsboats.map((boat) => (
                            <ListItem
                                key={boat.id}
                                title={`${boat.id} | ${boat.name} | ${boat.model}`}
                                subtitle={`Seats: ${boat.seats} Rides: ${boat.rides}`}>
                            </ListItem>
                        ))
                    }
                </ScrollView>
            </View>

        );
    }
}

export default EmployeeLandingPage;
