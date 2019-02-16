import React from 'react';
import autoBind from 'react-autobind';
import {View, Switch, NetInfo, ScrollView, TextInput} from 'react-native';
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
            increment: '0'
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        const conn = await NetInfo.isConnected.fetch();

        let boats;

        if (conn) {
            boats = await API.getAllBoats();
        } else {
            boats = await LocalStorage.getAllBoats();
        }

        this.setState({boats: boats, isConnected: conn});
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
        const rides = parseInt(this.state.increment);

        await LocalStorage.addRides(this.state.selectedID, rides + this.state.rides);

        if(this.state.isConnected) {
            await API.addRides(this.state.selectedID, rides);
        } else {
            await LocalStorage.addUpdate({category: 'rides', id: this.state.selectedID, rides: rides});
        }

        const reload = this.props.navigation.getParam('refresh');
        reload();

        await this.update();
    }

    updateForm(event, boat) {
        this.setState({selectedID: boat.id, rides: boat.rides});
    }


    render() {
        return (
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