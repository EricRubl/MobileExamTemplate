import {ActivityIndicator, NetInfo, View} from "react-native";
import {Button,  Text} from "react-native-elements";
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
const restApi = require('.././client/restClient');

class LoanBike extends React.Component{

    constructor(props){
        super(props);
        this.state={
            isConnected: true,
            request : this.props.navigation.state.params.request,
            spinner: false
        };

        this.handleConnectionChange = this.handleConnectionChange.bind(this);
        this.onReload = this.onReload.bind(this);
        this.onLoan = this.onLoan.bind(this);
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

    onLoan(){
        restApi.clearStorage();
        const request = {
            id: this.state.request.id,
            name: this.state.request.name,
            type: this.state.request.type,
            size: this.state.request.size,
            owner: this.state.request.owner,
        };
        const today = new Date();
        const date = today.getDate() + "-" + parseInt(today.getMonth()+1) + "-" + today.getFullYear();
        const record = {
                date,
                request: request
            }
        ;
        this.setState({spinner:true});
        restApi.addRecord(record);
        restApi.loan(request.id).then(() => {setTimeout(() => {this.setState({spinner:false})},2000)}).then(() => {this.props.navigation.navigate("UserLandingPage",{})});
    }

    render(){
        if(this.state.isConnected){
                return(
                    <View>
                        <Text style={{textAlign: 'center'}}>
                            Request id: {this.state.request.id}
                        </Text>
                        <Text style={{textAlign: 'center'}}>
                            Request name: {this.state.request.name}
                        </Text>
                        <Text style={{textAlign: 'center'}}>
                            Request owner: {this.state.request.owner}
                        </Text>
                        <Text style={{textAlign: 'center'}}>
                            Would you like to fulfill this request?
                        </Text>
                        <Button onPress={this.onLoan} title={"Loan bike"}/>
                        <Spinner
                            visible={this.state.spinner}
                            textContent={'Loading...'}
                        />
                    </View>
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

export default LoanBike;