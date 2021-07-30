import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//Importing components
import CircularLoader from "./components/Loader/CircularLoader";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode="none" initialRouteName="Register">
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
      </NavigationContainer>
    );
  }
}
