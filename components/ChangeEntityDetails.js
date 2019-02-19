import React from 'react';
import autoBind from 'react-autobind';
import {View, Switch, NetInfo, ScrollView, TextInput, Alert, ActivityIndicator} from 'react-native';
import {Button} from "react-native-elements";
import * as API from '../client/restClient';
import * as LocalStorage from '../client/localStorage';

class ChangeEntityDetails extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            entities: [],
            selectedEntity: null,
            isConnected: true,
            spinner: false
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        this.setState({spinner: true});

        const conn = await NetInfo.isConnected.fetch();

        let entities;

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

    async changeDetails() {
        this.setState({spinner: true});

        await LocalStorage.changeEntity(this.state.selectedEntity);

        try {
            if(this.state.isConnected) {
                await API.changeEntity(this.state.selectedEntity);
            } else {
                await LocalStorage.addUpdate({category: 'change', entity: this.state.selectedEntity.toDict()});
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
        this.setState({selectedEntity: entity});
    }


    render() {
        console.log('rendered');
        return (
            this.state.spinner ? <ActivityIndicator size="large" color="#0000ff" /> :
            <View style={{flexDirection: 'column'}}>
                <ScrollView style={{height: '40%'}}>
                    {
                        this.state.entities.map(entity => entity.toListItem(this.updateForm))
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
                        onChangeText={(text) => this.setState({selectedEntity: this.state.selectedEntity.setName(text)})}
                        value={this.state.selectedEntity ? this.state.selectedEntity.name : ''}
                    />
                    <TextInput
                        style={{height: 40, width: 100, margin: 10, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({selectedEntity: this.state.selectedEntity.setSeats(parseInt(text))})}
                        value={this.state.selectedEntity ? this.state.selectedEntity.seats.toString() : ''}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 20,
                        justifyContent: 'center',
                    }}
                >
                    <Switch value={this.state.selectedEntity ? this.state.selectedEntity.status : false} onValueChange={value => this.setState({selectedEntity: this.state.selectedEntity.setStatus(value)})}/>
                </View>
                <Button title={'Change details'} onPress={this.changeDetails}/>
            </View>

        );
    }
}

export default ChangeEntityDetails;