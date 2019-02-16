import React from 'react';
import autoBind from 'react-autobind';
import {View, ScrollView} from 'react-native';
import {Button, ListItem} from "react-native-elements";
import * as API from '../client/restClient';

class EmployeeLandingPage extends React.Component {


    constructor(props) {
        super(props);
        autoBind(this);

        this.state = {
            boats: [],
        };
    }

    async componentWillMount() {
        await this.update();
    }

    async update() {
        const boats = await API.getAllBoats();
        this.setState({boats: boats});
    }

    addBoat() {
        this.props.navigation.navigate('AddBoat', {refresh: () => this.update()});
    }

    deleteBoat() {
        this.props.navigation.navigate('DeleteBoat', {refresh: () => this.update()});
    }

    render() {
        return (
            <View style={{flexDirection: 'column'}}>
                <ScrollView style={{height: '80%'}}>
                    {
                        this.state.boats.filter(boat => boat.status === 'busy').sort((a, b) =>{
                            if(a.rides === b.rides) {
                                return (a.seats < b.seats) ? 1 : (a.seats > b.seats) ? -1 : 0;
                            } else {
                                return a.rides < b.rides ? 1 : -1;
                            }
                        }).map((boat) => (
                            <ListItem
                                key={boat.id}
                                title={`${boat.id} | ${boat.name} | ${boat.model}`}
                                subtitle={`Seats: ${boat.seats} Rides: ${boat.rides}`}>
                            </ListItem>
                        ))
                    }
                </ScrollView>
                <View style={{height: '20%'}}>
                    <Button onPress={this.addBoat} title={'Add boat'}/>
                    <Button onPress={this.deleteBoat} title={'Delete boat'}/>
                </View>
            </View>

        );
    }
}

export default EmployeeLandingPage;