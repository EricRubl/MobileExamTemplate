import React from 'react';
import autoBind from 'react-autobind';
import {View, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {Button, ListItem, Text} from "react-native-elements";
import * as API from '../client/restClient';

class DeleteBoat extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            id: -1,
            boats: [],
            spinner: false
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        this.setState({spinner: true});

        try {
            const boats = await API.getAllBoats();
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

    async deleteBoat() {
        this.setState({spinner: true});

        try {
            await API.deleteBoat(this.state.id);
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
        this.setState({id: boat.id});
    }

    render() {
        return (
            this.state.spinner ? <ActivityIndicator size="large" color="#0000ff" /> :
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
                <Text>{`Boat to delete: ${this.state.id}`}</Text>
                <Button title={'Delete boat'} onPress={this.deleteBoat}/>
            </View>

        );
    }
}

export default DeleteBoat;