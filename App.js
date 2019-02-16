import React from 'react';
import UserLandingPage from "./components/UserLandingPage";
import OwnerLandingPage from "./components/OwnerLandingPage";
import {createAppContainer, createStackNavigator} from "react-navigation";
import Home from "./components/Home";
import ChangeBoatDetails from './components/ChangeBoatDetails';

export default class App extends React.Component {

  render() {
    return (
      <AppContainer/>
    );
  }
}

const AppNavigator = createStackNavigator({
        Login: Home,
        EmployeeLandingPage: UserLandingPage,
        OwnerLandingPage: OwnerLandingPage,
        ChangeBoatDetails: ChangeBoatDetails,
    });

const AppContainer = createAppContainer(AppNavigator);

