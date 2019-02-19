import React from 'react';
import autoBind from 'react-autobind';
import {View, NetInfo, ScrollView, TextInput, Alert, ActivityIndicator} from 'react-native';
import {Button, Text} from "react-native-elements";
import * as API from '../client/restClient';
import * as LocalStorage from '../client/localStorage';

class IncrementNumberProp extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            entities: [],
            isConnected: true,
            selectedID: -1,
            current: 0,
            increment: '0',
            spinner: false
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        const conn = await NetInfo.isConnected.fetch();

        let entities;

        this.setState({spinner: true});

        try {
            if (conn) {
                entities = await API.getAllEntities();
            } else {
                entities = await LocalStorage.getAllEntities();
            }

            this.setState({entities: entities, isConnected: conn, spinner: false});
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

    async incrementProp() {
        this.setState({spinner: true});

        const increment = parseInt(this.state.increment);

        await LocalStorage.incrementNumberProp(this.state.selectedID, increment);

        try {
            if(this.state.isConnected) {
                await API.incrementNumberProp(this.state.selectedID, increment);
            } else {
                await LocalStorage.addUpdate({category: 'increment', id: this.state.selectedID, increment: increment});
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

        this.setState({spinner: false});

        await this.update();
    }

    updateForm(entity) {
        this.setState({selectedID: entity.id, current: entity.getNumberProp()});
    }


    render() {
        return (
            this.state.spinner? <ActivityIndicator size="large" color="#0000ff" /> :
            <View style={{flexDirection: 'column'}}>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.entities.map(entity => entity.toListItem(this.updateForm))
                    }
                </ScrollView>
                <TextInput
                    style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(text) => this.setState({increment: text})}
                    value={this.state.increment}
                />
                <Text>{`Current value: ${this.state.current}`}</Text>
                <Button title={'Add rides'} onPress={this.incrementProp}/>
            </View>

        );
    }
}

export default IncrementNumberProp;