import React from 'react';
import autoBind from 'react-autobind';
import {View, Switch, NetInfo, ScrollView, TextInput, Alert} from 'react-native';
import {Button, ListItem, Text} from "react-native-elements";
import * as API from '../client/restClient';
import * as LocalStorage from '../client/localStorage';

class ChangeBoatDetails extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            boats: [],
            isConnected: true,
            selectedID: -1,
            name: '',
            free: true,
            seats: '0',
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        const conn = await NetInfo.isConnected.fetch();

        let boats;

        try {
            if (conn) {
                boats = await API.getAllBoats();
            } else {
                boats = await LocalStorage.getAllBoats();
            }

            this.setState({boats: boats, isConnected: conn});
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

    async changeDetails() {
        const status = this.state.free ? 'free' :  'busy';

        await LocalStorage.changeBoat(this.state.selectedID, this.state.name, status, parseInt(this.state.seats));

        try {
            if(this.state.isConnected) {
                await API.changeBoat(this.state.selectedID, this.state.name, status, parseInt(this.state.seats));
            } else {
                await LocalStorage.addUpdate({category: 'change', id: this.state.selectedID, name: this.state.name, status: status, seats: parseInt(this.state.seats)});
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

        await this.update();
    }

    updateForm(event, boat) {
        console.log(boat.status === 'free');
        this.setState({selectedID: boat.id, name: boat.name, free: boat.status === 'free', seats: boat.seats})
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
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 20,
                        justifyContent: 'center',
                    }}
                >
                    <TextInput
                        style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({name: text})}
                        value={this.state.name}
                    />
                    <TextInput
                        style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({seats: text})}
                        value={this.state.seats.toString()}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 20,
                        justifyContent: 'center',
                    }}
                >
                    <Text>{this.state.isConnected ? 'yeee' : 'nuuu'}</Text>
                    <Switch value={this.state.free} onValueChange={value => this.setState({free: value})}/>
                </View>
                <Button title={'Change details'} onPress={this.changeDetails}/>
            </View>

        );
    }
}

export default ChangeBoatDetails;