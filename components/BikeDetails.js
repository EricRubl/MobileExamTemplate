import React from 'react';
import { View } from 'react-native';
import {Button,  Text} from 'react-native-elements';

class BikeDetail extends React.Component {

    constructor(props){
        super(props);
        this.goBack = this.goBack.bind(this);
        this.seeHistory = this.seeHistory.bind(this);
        this.state = {
            bike: this.props.navigation.state.params.bike
        }
    }

    goBack(){
        this.props.navigation.navigate("UserLandingPage",{});
    }

    seeHistory(){
        this.props.navigation.navigate("History",{});
    }


    render(){
        return(
            <View>
                <Text style={{textAlign: 'center'}}>
                    Bike id: {this.state.bike.id}
                </Text>
                <Text  style={{textAlign: 'center'}}>
                    Bike name: {this.state.bike.name}
                </Text>
                <Text style={{textAlign: 'center'}}>
                    Bike type: {this.state.bike.type}
                </Text>
                <Text style={{textAlign: 'center'}}>
                    Bike owner: {this.state.bike.owner}
                </Text>
                <Text style={{textAlign: 'center'}}>
                    Bike size: {this.state.bike.size}
                </Text>
                <Button onPress={this.goBack} title={"Back"}/>
                <Button onPress={this.seeHistory} title={"History"}/>
            </View>
        )
    }
}
export default BikeDetail;