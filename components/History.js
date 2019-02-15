import {ScrollView, View} from "react-native";
import {ListItem, Button} from "react-native-elements";
import React from "react";
const restApi = require('.././client/restClient');

class HistoryScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            records: [],
            userName: this.props.navigation.state.params.userName,
        }
    }

    async componentWillMount(){
        restApi.getMessages(this.state.userName).then((records) => this.setState({records:records}));
    }

    componentDidMount(){
        console.log(this.state.records);
    }

    render(){
        return(
            <ScrollView>
                {
                    this.state.records.map((record) => (
                        <ListItem
                            key={record.id}
                            title={`ID: ${record.id} Sender: ${record.sender} Receiver: ${record.receiver}`}
                            subtitle={`Date: ${record.date} Text: ${record.text}`}>
                        </ListItem>
                    ))
                }
                <Button onPress={this.onReturn} title={'Return bike'}/>

            </ScrollView>
        )
    }
}

export default HistoryScreen;