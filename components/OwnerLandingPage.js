import React from 'react';
import autoBind from 'react-autobind';
import {View, NetInfo, ScrollView, Alert} from 'react-native';
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
        try {
            const updates = await LocalStorage.getAllUpdates();
            let boats = await LocalStorage.getAllBoats();
            const localSize = boats.length;

            if (this.state.isConnected) {
                boats = await API.getAllBoats();

                if(localSize === 0) {
                    for(let i = 0; i < boats.length; ++i) {
                        await LocalStorage.addBoat(boats[i]);
                    }
                }

                this.setState({boats: boats, updates: updates});
            } else {
                this.setState({boats: boats, updates: updates});
            }
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

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }


    handleConnectionChange = async info => {
        console.log("IsConnected to internet la ouner: " + info);

        try {
            const updates = this.state.updates;
            if (info && updates.length > 0) {
                for(let i = 0; i < updates.length; ++i) {
                    if (updates[i].category === 'change') {
                        await API.changeBoat(updates[i].id, updates[i].name, updates[i].status, updates[i].seats);
                    }

                }

                await LocalStorage.clearUpdates();
                this.setState({isConnected: info, updates: []})
            } else {
                this.setState({isConnected: info});
            }
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

    };

    async clearLocalStorage() {
        await LocalStorage.clearStorage();

        if (!this.state.isConnected) {
            this.setState({boats: [], updates: []});
        } else {
            this.setState({updates: []});
        }
    };

    changeDetails() {
        this.props.navigation.navigate("ChangeBoatDetails", {refresh: () => this.update()});
    }

    addRides() {
        this.props.navigation.navigate("AddRides", {refresh: () => this.update()});
    }

    async retryConnection() {
        const conn = await NetInfo.isConnected.fetch();

        try {
            if(conn) {
                const updates = this.state.updates;
                if (updates.length > 0) {
                    for(let i = 0; i < updates.length; ++i) {
                        if (updates[i].category === 'change') {
                            await API.changeBoat(updates[i].id, updates[i].name, updates[i].status, updates[i].seats);
                        } else {
                            await API.addRides(updates[i].id, updates[i].rides);
                        }

                    }
                    await LocalStorage.clearUpdates();
                    this.setState({isConnected: true, updates: []})
                } else {
                    this.setState({isConnected: true});
                }
            }
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
                    <Button onPress={this.addRides} title={'Add Rides'}/>
                    <Button onPress={this.retryConnection} disabled={this.state.isConnected} title={'Retry connection'}/>
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