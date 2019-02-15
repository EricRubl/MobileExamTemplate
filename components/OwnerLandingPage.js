import React from 'react';
import autoBind from 'react-autobind';
import {View, Picker, NetInfo, ScrollView} from 'react-native';
import {Button, ListItem} from "react-native-elements";
import * as api from '../client/restClient';

class OwnerLandingPage extends React.Component {


    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            boats: [],
            offlineBoats: [],
            diffBoats: [],
            isConnected: true,
            selectedID: -1,
            rides: 0,
            name: '',
            status: 'free',
            seats: 0
        };
    }

    async componentWillMount() {
        if (this.state.isConnected) {
            api.getAllBoats().then((boats) => this.setState({boats: boats}));

            if(api.getRecords().length === 0) {
                this.state.boats.map(boat => api.addRecord(boat));
            }

            this.setState({offlineBoats: api.getRecords()});

        } else {
            console.log("Offline mode");
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

    clearLocalStorage() {
        if(this.state.offlineBoats.length > 0) {
            api.clearStorage().then(this.setState({offlineBoats: []}));
        }
    };

    render() {
            const boats = this.state.isConnected ? this.state.boats : this.state.offlineBoats;

            return (
                <ScrollView>
                    {
                        boats.filter(boat => boat.status === 'free').map((boat) => (
                            <ListItem
                                key={boat.id}
                                title={`${boat.id} | ${boat.name} | ${boat.model}`}
                                subtitle={`Seats: ${boat.seats} Rides: ${boat.rides}`}>
                            </ListItem>
                        ))
                    }
                    <Button onPress={this.clearLocalStorage} title={'Clear local storage'}/>
                    <View
                        style={{
                            flexDirection: 'row',
                            height: 100,
                            padding: 20,
                        }}
                    >
                    <Picker
                        selectedValue={this.state.selectedID}
                        style={{height: 50, width: 50}}
                        onValueChange={itemValue => this.setState({selectedID: itemValue})}
                    >
                            {boats.map(boat => <Picker.Item key={boat.id} label={boat.id.toString()} value={boat.id} />)}
                    </Picker>
                    <Picker
                        selectedValue={this.state.status}
                        style={{height: 50, width: 50}}
                        onValueChange={itemValue => this.setState({status: itemValue})}
                    >
                        <Picker.Item key={'free'} label={'Free'} value={'free'} />
                        <Picker.Item key={'busy'} label={'Busy'} value={'busy'} />
                    </Picker>
                    </View>
                </ScrollView>
            );
    }
}

export default OwnerLandingPage;