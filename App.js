import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Icon from "react-native-vector-icons/Ionicons";

import { Text, View } from "react-native";

//Importing components
import TabBar from "./components/Tabbar/index.tsx";

import CircularLoader from "./components/Loader/CircularLoader";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import StreamScreen from "./components/LiveStream/StreamScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// const Tab = createMaterialBottomTabNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "null",
    };
  }

  render() {
    return (
      <NavigationContainer>
        {this.state.token !== null ? (
          <Tab.Navigator
            tabBar={(props) => <TabBar {...props} />}
            initialRouteName="Home"
            activeColor="#fff"
          >
            <Tab.Screen name="HomeScreen" component={CircularLoader} />
            <Tab.Screen name="SettingsScreen" component={CircularLoader} />
          </Tab.Navigator>
        ) : (
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

            <Stack.Screen name="StreamScreen">
              {({ navigation }) => <StreamScreen navigation={navigation} />}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    );
  }
}
