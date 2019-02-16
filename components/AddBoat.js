import React from 'react';
import autoBind from 'react-autobind';
import {View, Switch, Picker, ScrollView, TextInput} from 'react-native';
import {Button, ListItem, Text} from "react-native-elements";
import * as API from '../client/restClient';

class AddBoat extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            name: '',
            model: 'Serenity',
            seats: '0',
        };
    }

    async addBoat() {
        await API.addBoat(this.state.name, this.state.model, parseInt(this.state.seats));

        const reload = this.props.navigation.getParam('refresh');
        reload();
    }

    render() {
        return (
            <View style={{flexDirection: 'column'}}>
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
                <Picker
                    selectedValue={this.state.model}
                    style={{height: 50, width: 100}}
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