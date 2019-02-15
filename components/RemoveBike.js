import React from 'react';
import {ScrollView, TextInput, View} from 'react-native';
import {Button} from 'react-native-elements';
import Spinner from "react-native-loading-spinner-overlay";
const restApi = require('.././client/restClient');

class RemoveBike extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            spinner: false
        }
        this.removeBike = this.removeBike.bind(this);
    }

    removeBike(){
        this.setState({spinner: true});
        setTimeout(() => {this.setState({spinner:false})},2000);
        restApi.deleteMessage(this.state.id).then(() => {this.props.navigation.navigate("UserLandingPage",{})});
    }

    render(){
        return(
            <ScrollView style={{align: 'center'}}>
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
                <Button onPress={this.removeBike} title={"Delete message"}/>

            </ScrollView>
        )
    }
}
export default RemoveBike;