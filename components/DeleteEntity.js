import React from 'react';
import autoBind from 'react-autobind';
import {View, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {Button, ListItem, Text} from "react-native-elements";
import * as API from '../client/restClient';

class DeleteEntity extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            id: -1,
            entities: [],
            spinner: false
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        this.setState({spinner: true});

        try {
            const entities = await API.getAllEntities();

            this.setState({entities: entities, spinner: false});
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

    async deleteEntity() {
        this.setState({spinner: true});

        try {
            await API.deleteEntity(this.state.id);
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

    updateForm(entity) {
        this.setState({id: entity.id});
    }

    render() {
        return (
            this.state.spinner ? <ActivityIndicator size="large" color="#0000ff" /> :
            <View style={{flexDirection: 'column'}}>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.entities.map(entity => entity.toListItem(this.updateForm))
                    }
                </ScrollView>
                <Text>{`Boat to delete: ${this.state.id}`}</Text>
                <Button title={'Delete boat'} onPress={this.deleteEntity}/>
            </View>

        );
    }
}

export default DeleteEntity;