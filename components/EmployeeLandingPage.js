import React from 'react';
import autoBind from 'react-autobind';
import {View, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {Button, ListItem} from "react-native-elements";
import * as API from '../client/restClient';
import Entity from "./Entity";

class EmployeeLandingPage extends React.Component {


    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            entities: [],
            wsEntities: [],
            spinner: false
        };

        this.ws = new WebSocket('ws://' + API.IP + ':' + API.PORT);

        this.ws.onmessage = (event) => {
            let wsEntities = this.state.wsEntities;
            const entity = Entity.fromObject(JSON.parse(event.data));
            this.setState({wsEntities: [...wsEntities, entity]});
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

    addEntity() {
        this.props.navigation.navigate('AddEntity', {refresh: () => this.update()});
    }

    deleteEntity() {
        this.props.navigation.navigate('DeleteEntity', {refresh: () => this.update()});
    }

    clearWebSocketData() {
        this.setState({wsboats: []});
    }

    render() {
        return (
            this.state.spinner ? <ActivityIndicator size="large" color="#0000ff" /> :
            <View style={{flexDirection: 'column'}}>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.entities.filter(entity => !entity.isAvailable()).sort((a, b) =>{
                            if(a.rides === b.rides) {
                                return (a.seats < b.seats) ? 1 : (a.seats > b.seats) ? -1 : 0;
                            } else {
                                return a.rides < b.rides ? 1 : -1;
                            }
                        }).map(entity => entity.toListItem())
                    }
                </ScrollView>
                <View style={{height: '20%'}}>
                    <Button onPress={this.addEntity} title={'Add boat'}/>
                    <Button onPress={this.deleteEntity} title={'Delete boat'}/>
                    <Button onPress={this.clearWebSocketData} title={'Clear WebSocket Data'}/>
                </View>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.wsEntities.map(entity => entity.toListItem())
                    }
                </ScrollView>
            </View>

        );
    }
}

export default EmployeeLandingPage;
