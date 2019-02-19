import React from 'react';
import EmployeeLandingPage from "./components/EmployeeLandingPage";
import OwnerLandingPage from "./components/OwnerLandingPage";
import {createAppContainer, createStackNavigator} from "react-navigation";
import Home from "./components/Home";
import ChangeEntityDetails from './components/ChangeEntityDetails';
import IncrementNumberProp from './components/IncrementNumberProp';
import AddEntity from './components/AddEntity';
import DeleteEntity from './components/DeleteEntity';

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
    ChangeEntityDetails: ChangeEntityDetails,
    IncrementNumberProp: IncrementNumberProp,
    AddEntity: AddEntity,
    DeleteEntity: DeleteEntity,
});

const AppContainer = createAppContainer(AppNavigator);
