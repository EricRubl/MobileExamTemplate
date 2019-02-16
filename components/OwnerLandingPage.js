import React from 'react';
import autoBind from 'react-autobind';
import {View, NetInfo, ScrollView} from 'react-native';
import {Button, ListItem} from "react-native-elements";
import * as API from '../client/restClient';
import * as LocalStorage from '../client/localStorage';

class OwnerLandingPage extends React.Component {


    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            boats: [],
            updates: [],
            isConnected: true,
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        const updates = await LocalStorage.getAllUpdates();
        let boats = await LocalStorage.getAllBoats();

        if (this.state.isConnected) {
            API.getAllBoats().then(boats => {
                if (LocalStorage.getAllBoats().length === 0) {
                    boats.map(boat => LocalStorage.addBoat(boat));
                }
                this.setState({boats: boats, updates: updates});
            });
        } else {
            this.setState({boats: boats, updates: updates});
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = info => {
        if(info && this.state.updates.length > 0) {
            this.state.updates.map(async update => {
                if(update.category === 'change') {
                    await API.changeBoat(update.id, update.name, update.status, update.seats);
                }
            });

            LocalStorage.clearUpdates().then(this.setState({isConnected: info, updates: []}));
        } else {
            this.setState({
                isConnected: info,
            });
        }
        console.log("IsConnected to internet: " + info);
    };

    clearLocalStorage() {
        if (LocalStorage.getAllBoats().length > 0) {
            LocalStorage.clearStorage().then(() => {
                if (!this.state.isConnected) {
                    this.setState({boats: []})
                }
            });
        }
    };

    changeDetails() {
        this.props.navigation.navigate("ChangeBoatDetails", { refresh: () => this.update() });
    }

    render() {

        return (
            <View style={{flexDirection: 'column'}}>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.boats.filter(boat => boat.status === 'free').map((boat) => (
                            <ListItem
                                key={boat.id}
                                title={`${boat.id} | ${boat.name} | ${boat.model}`}
                                subtitle={`Seats: ${boat.seats} Rides: ${boat.rides}`}>
                            </ListItem>
                        ))
                    }
                </ScrollView>
                <View style={{height: '20%'}}>
                    <Button onPress={this.clearLocalStorage} title={'Clear local storage'}/>
                    <Button onPress={this.changeDetails} title={'Change Details'}/>
                    <Button onPress={this.changeDetails} title={'Add Rides'}/>
                </View>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.updates.map((update) => (
                            <ListItem
                                title={`${update.category} | ${update.id}`}
                                subtitle={update.category === 'change' ? `Name: ${update.name} Seats: ${update.seats} Status: ${update.status}` : `Rides: ${update.rides}`}>
                            </ListItem>
                        ))
                    }
                </ScrollView>
            </View>

        );
    }
}

export default OwnerLandingPage;