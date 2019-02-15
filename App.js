import React from 'react';
import UserLandingPage from "./components/UserLandingPage";
import OwnerLandingPage from "./components/OwnerLandingPage";
import {createAppContainer, createStackNavigator} from "react-navigation";
import Home from "./components/Home";
import LoanBike from "./components/LoanBike";
import BikeDetails from "./components/BikeDetails";
import HistoryScreen from "./components/History";
import ReturnBike from "./components/ReturnBike";
import RemoveBike from "./components/RemoveBike";
import AddBike from "./components/AddBike";
import EmployeeTopList from "./components/EmployeeTopList";
import Users from './components/Users';
import PrivateMessages from './components/PrivateMessages';

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
        LoanBike: LoanBike,
        BikeDetails: BikeDetails,
        History: HistoryScreen,
        ReturnBike: ReturnBike,
        DeleteBike: RemoveBike,
        AddBike: AddBike,
        EmployeeTopList: EmployeeTopList,
        Users: Users,
        PrivateMessages: PrivateMessages,
    });

const AppContainer = createAppContainer(AppNavigator);

