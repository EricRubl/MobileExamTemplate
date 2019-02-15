import React from 'react';
import {View, Text, NetInfo, ScrollView} from 'react-native';
import {Button, ListItem} from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
const restApi = require('.././client/restClient');

class EmployeeTopList extends React.Component{


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
    }

    async componentWillMount(){
        if(this.state.isConnected){
            restApi.getBigRequests().then((requests) => this.setState({requests:requests}));
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
        this.props.navigation.navigate("OwnerLandingPage",{});
    }

    render(){
        if(this.state.isConnected){
            return(
                <ScrollView>
                    {
                        this.state.requests.sort((a, b) => a.quantity < b.quantity).slice(0,10).map((request) => (
                            <ListItem
                                key={request.id}
                                title={request.id + " : " + request.name + " - " + request.product}
                                subtitle={request.quantity}>
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

export default EmployeeTopList;