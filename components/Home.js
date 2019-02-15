import React from 'react';
import {View, Text, Button} from 'react-native';

class Home extends React.Component{

    constructor(props){
        super(props);
        this.onUser = this.onUser.bind(this);
        this.onOwner = this.onOwner.bind(this);
    }

    onUser(){
        this.props.navigation.navigate("UserLandingPage");
    }

    onOwner(){
        this.props.navigation.navigate("OwnerLandingPage");
    }

    render(){
        return(
            <View>
                <Text style={{textAlign: 'center'}}>
                    Select your role:
                </Text>
                <Button onPress={this.onUser} title={"Uhsdgfjhsg"}/>
                <Button onPress={this.onOwner} title={"Public"}/>
            </View>
        )
    }
}

export default Home;