import React from 'react';
import {View, Text, NetInfo, ScrollView} from 'react-native';
import {Button, ListItem} from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
const restApi = require('.././client/restClient');

class OwnerLandingPage extends React.Component{


    constructor(props){
        super(props);
        this.state={
            requests:
                [],
            isConnected: true,
            spinner: false
        };

        this.handleConnectionChange = this.handleConnectionChange.bind(this);
        this.onReload = this.onReload.bind(this);
        this.viewUsers = this.viewUsers.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    async componentWillMount(){
        if(this.state.isConnected){
            restApi.getAllMessages().then((requests) => this.setState({requests:requests}));
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
        this.setState({ isConnected : info,
            spinner: !info
        });
        console.log("IsConnected to internet: " + info);
        console.log("Spinner to internet: " + !info);
    };

    onReload(){
        this.setState({spinner: true});
        setTimeout(() => {this.setState({spinner:false})},2000);
    }

    viewUsers(){
        this.props.navigation.navigate('Users', {});
    }

    sendMessage(){
        this.props.navigation.navigate('AddBike', {});
    }

    render(){
        if(this.state.isConnected){
            return(
                <ScrollView>
                    {
                        this.state.requests.sort((a, b) => a.date < b.date).slice(0, 10).map((request) => (
                            <ListItem
                                key={request.id}
                                title={`ID: ${request.id} Sender: ${request.sender} Receiver: ${request.receiver}`}
                                subtitle={`Date: ${request.date} Text: ${request.text}`}>
                            </ListItem>
                        ))
                    }
                    <Button onPress={this.viewUsers} title={"See users"}/>
                    <Button onPress={this.sendMessage} title={'Send message'}></Button>
                </ScrollView>
            )
        }
        else
        {
            return(
                <View>
                    <Spinner
                        visible={this.state.spinner}
                        textContent={'Loading...'}
                    />
                    <Text>
                        You are offline. Please try again
                    </Text>
                    <Button onPress={this.onReload} title={"Reload"}/>

                </View>
            )
        }

    }
}

export default OwnerLandingPage;