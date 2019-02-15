import {ScrollView, View} from "react-native";
import {ListItem, Button} from "react-native-elements";
import React from "react";
const restApi = require('.././client/restClient');

class Users extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            records: [],
            userName: this.props.navigation.state.params.userName,
        }
    }

    async componentWillMount(){
        restApi.getUsers().then((records) => this.setState({records:records}));
    }

    componentDidMount(){
        console.log(this.state.records);
    }

    onSelect(name){
        this.props.navigation.navigate('PrivateMessages', { name })
    }

    render(){
        return(
            <ScrollView>
                {
                    this.state.records.map((record) => (
                        <ListItem
                            title={`User: ${record}`}
                            onPress={() => this.onSelect(record)}
                        >
                        </ListItem>
                    ))
                }

            </ScrollView>
        )
    }
}

export default Users;