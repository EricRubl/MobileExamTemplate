import React from 'react';
import {TextInput, View} from 'react-native';
import {Button} from 'react-native-elements';
import Spinner from "react-native-loading-spinner-overlay";
const restApi = require('.././client/restClient');

class ReturnBike extends React.Component {

    constructor(props){
        super(props);
        this.returnBike = this.returnBike.bind(this);
        this.state = {
            spinner: false
        }
        this.returnBike = this.returnBike.bind(this);
    }

    returnBike(){
        this.setState({spinner: true});
        setTimeout(() => {this.setState({spinner:false})},2000);
        restApi.returnBike(this.state.id).then(() => {this.props.navigation.navigate("UserLandingPage",{})});
    }

    render(){
        return(
            <View style={{textAlign: 'center'}}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                />
                <TextInput
                    placeholder={"id"}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 100, textAlign: 'center'}}
                    onChangeText={(id) => this.setState({id})}
                    value={this.state.id}
                />
                <Button onPress={this.returnBike} title={"Return bike"}/>

            </View>
        )
    }
}
export default ReturnBike;