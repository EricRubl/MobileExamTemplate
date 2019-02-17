import React from 'react';
import autoBind from 'react-autobind';
import {View, NetInfo, ScrollView, TextInput, Alert, ActivityIndicator} from 'react-native';
import {Button, ListItem, Text} from "react-native-elements";
import * as API from '../client/restClient';
import * as LocalStorage from '../client/localStorage';

class AddRides extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            boats: [],
            isConnected: true,
            selectedID: -1,
            rides: 0,
            increment: '0',
            spinner: false
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        const conn = await NetInfo.isConnected.fetch();

        let boats;

        this.setState({spinner: true});

        try {
            if (conn) {
                boats = await API.getAllBoats();
            } else {
                boats = await LocalStorage.getAllBoats();
            }

            this.setState({boats: boats, isConnected: conn, spinner: false});
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

    handleConnectionChange = info => {
        this.setState({
            isConnected: info,
        });
        console.log("IsConnected to internet: " + info);
    };

    async addRides() {
        this.setState({spinner: true});

        const rides = parseInt(this.state.increment);

        await LocalStorage.addRides(this.state.selectedID, rides + this.state.rides);

        try {
            if(this.state.isConnected) {
                await API.addRides(this.state.selectedID, rides);
            } else {
                await LocalStorage.addUpdate({category: 'rides', id: this.state.selectedID, rides: rides});
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

        const reload = this.props.navigation.getParam('refresh');
        reload();

        this.setState({spinner: false});

        await this.update();
    }

    updateForm(event, boat) {
        this.setState({selectedID: boat.id, rides: boat.rides});
    }


    render() {
        return (
            this.state.spinner? <ActivityIndicator size="large" color="#0000ff" /> :
            <View style={{flexDirection: 'column'}}>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.boats.map((boat) => (
                            <ListItem
                                key={boat.id}
                                title={`${boat.id} | ${boat.name} | ${boat.model}`}
                                subtitle={`Seats: ${boat.seats} Rides: ${boat.rides} Status: ${boat.status}`}
                                onPress={e => this.updateForm(e, boat)}
                            >
                            </ListItem>
                        ))
                    }
                </ScrollView>
                <TextInput
                    style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({increment: text})}
                    value={this.state.increment}
                />
                <Text>{`Current rides: ${this.state.rides}`}</Text>
                <Button title={'Add rides'} onPress={this.addRides}/>
            </View>

        );
    }
}

export default AddRides;