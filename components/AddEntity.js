import React from 'react';
import autoBind from 'react-autobind';
import {View, Picker, TextInput, Alert, ActivityIndicator, Text} from 'react-native';
import {Button} from "react-native-elements";
import * as API from '../client/restClient';
import Entity from "./Entity";

class AddEntity extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            entity: new Entity(-1, '', 'Serenity', 'free', 0, 0),
            spinner: false
        };
    }

    async addEntity() {
        this.setState({spinner: true});

        try {
            await API.addEntity(this.state.entity);
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

        this.setState({spinner: false});

        const reload = this.props.navigation.getParam('refresh');
        reload();
    }

    render() {
        return (
            this.state.spinner ? <ActivityIndicator size="large" color="#0000ff" /> :
            <View style={{flexDirection: 'column'}}>
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 20,
                        justifyContent: 'center',
                    }}
                >
                    <Text>Boat's name</Text>
                    <TextInput
                        style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({entity: this.state.entity.setName(text)})}
                        value={this.state.entity ? this.state.entity.name : ''}
                    />
                    <Text>Seats</Text>
                    <TextInput
                        style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({entity: this.state.entity.setSeats(parseInt(text))})}
                        value={this.state.entity ? this.state.entity.seats.toString() : ''}
                    />
                </View>
                <Picker
                    selectedValue={this.state.entity ? this.state.entity.model : 'Serenity'}
                    style={{height: 50, width: 150}}
                    onValueChange={(itemValue) =>
                        this.setState({entity: this.state.entity.setModel(itemValue)})
                    }>
                    <Picker.Item label="Serenity" value="Serenity" />
                    <Picker.Item label="Whisper" value="Whisper" />
                    <Picker.Item label="Orion" value="Orion" />
                </Picker>
                <Button title={'Add boat'} onPress={this.addEntity}/>
            </View>

        );
    }
}

export default AddEntity;
