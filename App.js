import React from 'react';
import EmployeeLandingPage from "./components/EmployeeLandingPage";
import OwnerLandingPage from "./components/OwnerLandingPage";
import {createAppContainer, createStackNavigator} from "react-navigation";
import Home from "./components/Home";
import ChangeBoatDetails from './components/ChangeBoatDetails';
import AddRides from './components/AddRides';
import AddBoat from './components/AddBoat';
import DeleteBoat from './components/DeleteBoat';

export default class App extends React.Component {

  render() {
    return (
      <AppContainer/>
    );
  }
}

const AppNavigator = createStackNavigator({
    Login: Home,
    EmployeeLandingPage: EmployeeLandingPage,
    OwnerLandingPage: OwnerLandingPage,
    ChangeBoatDetails: ChangeBoatDetails,
    AddRides: AddRides,
    AddBoat: AddBoat,
    DeleteBoat: DeleteBoat,
});

const AppContainer = createAppContainer(AppNavigator);
