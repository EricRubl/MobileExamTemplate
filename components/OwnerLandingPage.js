import React from 'react';
import autoBind from 'react-autobind';
import {View, NetInfo, ScrollView, Alert, ActivityIndicator} from 'react-native';
import {Button, ListItem} from "react-native-elements";
import * as API from '../client/restClient';
import * as LocalStorage from '../client/localStorage';
import Entity from "./Entity";

class OwnerLandingPage extends React.Component {


    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            entities: [],
            updates: [],
            isConnected: true,
            spinner: false
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        this.setState({spinner: true});

        try {
            const updates = await LocalStorage.getAllUpdates();
            let entities = await LocalStorage.getAllEntities();
            const localSize = entities.length;

            if (this.state.isConnected) {
                entities = await API.getAllEntities();

                if(localSize === 0) {
                    for(let i = 0; i < entities.length; ++i) {
                        await LocalStorage.addEntity(entities[i]);
                        console.log('added', entities[i]);
                    }
                }

                this.setState({entities: entities, updates: updates, spinner: false});
            } else {
                this.setState({entities: entities, updates: updates, spinner: false});
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

    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = async networkIsConnected => {
        console.log("IsConnected to internet la ouner: " + networkIsConnected);

        this.setState({spinner: true});

        try {
            const updates = this.state.updates;
            if (networkIsConnected && updates.length > 0) {
                for(let i = 0; i < updates.length; ++i) {
                    if (updates[i].category === 'change') {
                        await API.changeEntity(Entity.fromObject(updates[i].entity));
                    } else {
                        await API.incrementNumberProp(updates[i].id, updates[i].increment);
                    }
                }

                await LocalStorage.clearUpdates();

                this.setState({isConnected: networkIsConnected, updates: [], spinner: false})
            } else {
                this.setState({isConnected: networkIsConnected, spinner: false});
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

    };

    async clearLocalStorage() {
        await LocalStorage.clearStorage();

        if (!this.state.isConnected) {
            this.setState({entities: [], updates: []});
        } else {
            this.setState({updates: []});
        }
    };

    changeDetails() {
        this.props.navigation.navigate("ChangeEntityDetails", {refresh: () => this.update()});
    }

    addRides() {
        this.props.navigation.navigate("IncrementNumberProp", {refresh: () => this.update()});
    }

    async retryConnection() {
        this.setState({spinner: true});

        const conn = await NetInfo.isConnected.fetch();

        try {
            if(conn) {
                const updates = this.state.updates;

                if (updates.length > 0) {
                    for(let i = 0; i < updates.length; ++i) {
                        if (updates[i].category === 'change') {
                            await API.changeEntity(Entity.fromObject(updates[i].entity));
                        } else {
                            await API.incrementNumberProp(updates[i].id, updates[i].increment);
                        }

                    }
                    await LocalStorage.clearUpdates();

                    this.setState({isConnected: true, updates: [], spinner: false})
                } else {
                    this.setState({isConnected: true, spinner: false});
                }
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

    }

    render() {
        console.log(this.state.entities);
        return (
            this.state.spinner ? <ActivityIndicator size="large" color="#0000ff" /> :
            <View style={{flexDirection: 'column'}}>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.entities.filter(entity => entity.isAvailable()).map(entity => entity.toListItem())
                    }
                </ScrollView>
                <View style={{height: '20%'}}>
                    <Button onPress={this.clearLocalStorage} title={'Clear local storage'}/>
                    <Button onPress={this.changeDetails} title={'Change Details'}/>
                    <Button onPress={this.addRides} title={'Add Rides'}/>
                    <Button onPress={this.retryConnection} disabled={this.state.isConnected} title={'Retry connection'}/>
                </View>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.updates.map(update => {
                            if(update.category === 'change') {
                                const entity = Entity.fromObject(update.entity);
                                return entity.toListItem();
                            } else {
                                return <ListItem title={`ID: ${update.id} Increment: ${update.increment}`} key={update.id + update.increment} />
                            }
                        })
                    }
                </ScrollView>
            </View>

        );
    }
}

export default OwnerLandingPage;
