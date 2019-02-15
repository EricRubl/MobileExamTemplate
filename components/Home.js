import React from 'react';
import autoBind from 'react-autobind';
import {View, Text, Button} from 'react-native';

class Home extends React.Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    onEmployee() {
        this.props.navigation.navigate("EmployeeLandingPage");
    }

    onOwner() {
        this.props.navigation.navigate("OwnerLandingPage");
    }

    render() {
        return (
            <View>
                <Text style={{textAlign: 'center'}}>
                    Choose a dashboard
                </Text>
                <Button onPress={this.onEmployee} title={"Employee"}/>
                <Button onPress={this.onOwner} title={"Owner"}/>
            </View>
        )
    }
}

export default Home;