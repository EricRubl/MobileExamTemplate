import React from "react";
import { Button } from "react-native-elements";
import { TextInput, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
const restApi = require('.././client/restClient');

class AddBike extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            spinner: false
        };
        this.addBike = this.addBike.bind(this);
        this.getRequestFromState = this.getRequestFromState.bind(this);

    }

    getRequestFromState() {
        const request = {
            sender: this.state.sender,
            type: this.state.type,
            receiver: this.state.receiver,
            text: this.state.text,
        };
        return request;
    }

    addBike() {
        this.setState({ spinner: true });
        setTimeout(() => { this.setState({ spinner: false }) }, 2000);
        restApi.addBike(this.getRequestFromState()).then(() => { this.props.navigation.navigate("OwnerLandingPage", {}) });
    }

    render() {
        return (
            <View style={{ align: 'center' }}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                />
                <TextInput
                    placeholder={"Name"}
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 250, textAlign: 'center' }}
                    onChangeText={(name) => this.setState({ sender: name })}
                    value={this.state.sender}
                />
                <TextInput
                    placeholder={"To"}
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 250, textAlign: 'center' }}
                    onChangeText={(to) => this.setState({ receiver: to })}
                    value={this.state.receiver}
                />
                <TextInput
                    placeholder={"Type"}
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 250, textAlign: 'center' }}
                    onChangeText={(product) => this.setState({ type: product })}
                    value={this.state.type}
                />
                <TextInput
                    placeholder={"Text"}
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: 250, textAlign: 'center' }}
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                />
                <Button onPress={this.addBike} title={"Send"} />
            </View>
        )
    }
}
export default AddBike;