import React from 'react';
import { View} from 'react-native';
import {Button, ListItem, Text} from 'react-native-elements';
import { NetInfo, TextInput } from 'react-native';
const restApi = require('.././client/restClient');
import Spinner from 'react-native-loading-spinner-overlay';


class UserLandingPage extends React.Component{

    constructor(props){
        super(props);
        this.state={
            requests:
                [],
            isConnected: true,
            spinner: false,
            userName: '',
        };

        this.handleConnectionChange = this.handleConnectionChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.setUserName = this.setUserName.bind(this);
        this.seeHistory = this.seeHistory.bind(this);
    }

    async componentWillMount(){
        restApi.getUserName()
        .then(userName => {
            if (userName !== '') {
                this.setState({ userName: userName[0].name});
                if(this.state.isConnected){
                   restApi.getMessages(this.state.userName)
                   .then((requests) => {
                       this.setState({requests:requests});
                       requests.forEach(request => restApi.addRecord(request));
                    });
                }
                else
                {
                    console.log("Offline");
                    restApi.getRecords().then((records) => this.setState({records:records}));
                }
            } else {
                console.log('Please add user name!');
            }
        })

    }

    componentDidMount() {

        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    }

    handleConnectionChange = info =>  {
        this.setState({ isConnected : info});
        this.setState({spinner: !info});
        setTimeout(() => {this.setState({spinner:info})},2000);
        console.log("IsConnected to internet: " + info);
    };

    onDelete(){
        this.props.navigation.navigate("DeleteBike",{});
    }


    setUserName(){
        restApi.getUserName()
            .then(userName => {
                if (userName !== '') {
                    console.log(`User name ${userName[0].name} already set`);
                } else {
                    restApi.setUserName({ name: this.state.userName });
                }
            })
        // restApi.clearStorage();
    }

    seeHistory(){
        this.props.navigation.push("History",{userName: this.state.userName});
    }


    render(){
        if(this.state.isConnected){
            return(
                <View>
                    {
                        this.state.requests.map((request) => (
                            <ListItem
                                key={request.id}
                                title={`ID: ${request.id} - Sender: ${request.sender} - Receiver: ${request.receiver}`}
                                subtitle={`Text: ${request.text}`}>
                            </ListItem>
                        ))
                    }
                    <TextInput
                        placeholder={"UserName"}
                        style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 100, textAlign: 'center'}}
                        onChangeText={userName => this.setState({userName})}
                        value={this.state.userName}
                    />
                    <Button onPress={this.setUserName} title={"Add username"}/>
                    <Button onPress={this.onDelete} title={"Delete message"}/>

                </View>
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
                    <Button onPress={this.onReload} title={"Reload"}>
                        Reload
                    </Button>

                </View>
            )
        }

    }
}

export default UserLandingPage;