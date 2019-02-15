import {ActivityIndicator, NetInfo, ScrollView} from "react-native";
import {Button,  Text, ListItem} from "react-native-elements";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
const restApi = require('.././client/restClient');

class PrivateMessages extends React.Component{

    constructor(props){
        super(props);
        this.state={
            requests: [],
            receivedRequests: [],
            isConnected: true,
            name : this.props.navigation.state.params.name,
            spinner: false
        };

        this.handleConnectionChange = this.handleConnectionChange.bind(this);
        this.onReload = this.onReload.bind(this);
    }
    async componentWillMount(){
        if(this.state.isConnected){
            restApi.getPrivateMessages(this.state.name).then((requests) => this.setState({requests:requests}));
            restApi.getReceivedMessages(this.state.name).then(requests => this.setState({receivedRequests: requests}));
        }
        else
        {
            console.log("Offline mode");
        }
    }

    componentDidMount() {        
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = info =>  {
        this.setState({ isConnected : info });
        console.log("IsConnected to internet: " + info);
    };

    onReload(){
        this.props.navigation.navigate("LoanBike");
    }

    render(){
        if(this.state.isConnected){
                return(
                    <ScrollView>
                        <Text style={{textAlign: 'center'}}>
                            {this.state.name} sent:
                        </Text>
                        {
                            this.state.requests.sort((a, b) => a.date < b.date).map((request) => (
                                <ListItem
                                    key={request.id}
                                    title={`ID: ${request.id} Sender: ${request.sender} Receiver: ${request.receiver}`}
                                    subtitle={`Date: ${request.date} Text: ${request.text}`}>
                                </ListItem>
                            ))
                        }
                        <Text style={{textAlign: 'center'}}>
                            {this.state.name} received:
                        </Text>
                        {
                            this.state.requests.sort((a, b) => a.date < b.date).map((request) => (
                                <ListItem
                                    key={request.id}
                                    title={`ID: ${request.id} Sender: ${request.sender} Receiver: ${request.receiver}`}
                                    subtitle={`Date: ${request.date} Text: ${request.text}`}>
                                </ListItem>
                            ))
                        }
                    </ScrollView>
                )
        }
        else
        {
            return(
                <View>
                    <ActivityIndicator animating={true} size="large" color="#0000ff" />
                    <Text>
                        You are offline. Please try again
                    </Text>
                    <Button onPress={this.onReload} title={"Reload"}>
                        Reload
                    </Button>

                </View>
            )
        }
    }


}

export default PrivateMessages;