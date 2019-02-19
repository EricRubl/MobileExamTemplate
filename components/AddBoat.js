import React from 'react';
import autoBind from 'react-autobind';
import {View, Picker, TextInput, Alert, ActivityIndicator, Text} from 'react-native';
import {Button} from "react-native-elements";
import * as API from '../client/restClient';

class AddBoat extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            name: '',
            model: 'Serenity',
            seats: '0',
            spinner: false
        };
    }

    async addBoat() {
        this.setState({spinner: true});

        try {
            await API.addEntity(this.state.name, this.state.model, parseInt(this.state.seats));
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
                        onChangeText={(text) => this.setState({name: text})}
                        value={this.state.name}
                    />
                    <Text>Seats</Text>
                    <TextInput
                        style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({seats: text})}
                        value={this.state.seats.toString()}
                    />
                </View>
                <Picker
                    selectedValue={this.state.model}
                    style={{height: 50, width: 150}}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({model: itemValue})
                    }>
                    <Picker.Item label="Serenity" value="Serenity" />
                    <Picker.Item label="Whisper" value="Whisper" />
                    <Picker.Item label="Orion" value="Orion" />
                </Picker>
                <Button title={'Add boat'} onPress={this.addBoat}/>
            </View>

        );
    }
}

export default AddBoat;
