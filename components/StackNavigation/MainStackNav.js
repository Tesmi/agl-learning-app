import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";

//Importing Screens
import CircularLoader from "../Loader/CircularLoader";
import SplashScreen from "./SplashScreen/SplashScreen";
import Login from "./Login/Login";
import Register from "./Register/Register";

const Stack = createStackNavigator();

export default class MainStackNav extends Component {
  render() {
    return (
      <Stack.Navigator headerMode="none" initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen">
          {({ navigation }) => <SplashScreen navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {({ navigation }) => <Login navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="Register">
          {({ navigation }) => <Register navigation={navigation} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }
}
