import React from 'react';
import autoBind from 'react-autobind';
import {View, ScrollView, Alert} from 'react-native';
import {Button, ListItem, Text} from "react-native-elements";
import * as API from '../client/restClient';

class DeleteBoat extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            id: -1,
            boats: [],
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        try {
            const boats = await API.getAllBoats();
            this.setState({boats: boats});
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

        await this.update();

        const reload = this.props.navigation.getParam('refresh');
        reload();
    }

    updateForm(event, boat) {
        this.setState({id: boat.id});
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
                <Text>{`Boat to delete: ${this.state.id}`}</Text>
                <Button title={'Delete boat'} onPress={this.deleteBoat}/>
            </View>

        );
    }
}

export default DeleteBoat;