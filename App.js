import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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
          <View style={{ flex: 12 }}>
            <View style={{ flex: 11 }}>
              <Tab.Navigator initialRouteName="HomeScreen" activeColor="#fff">
                <Tab.Screen
                  options={{ tabBarVisible: false }}
                  name="HomeScreen"
                  component={CircularLoader}
                />
                <Tab.Screen
                  options={{ tabBarVisible: false }}
                  name="LiveClassesScreen"
                  component={CircularLoader}
                />
                <Tab.Screen
                  options={{ tabBarVisible: false }}
                  name="FilesScreen"
                  component={CircularLoader}
                />
                <Tab.Screen
                  options={{ tabBarVisible: false }}
                  name="ScheduleScreen"
                  component={Register}
                />
                <Tab.Screen
                  options={{ tabBarVisible: false }}
                  name="NotificationsScreen"
                  component={Login}
                />
                <Tab.Screen
                  options={{ tabBarVisible: false }}
                  name="SettingsScreen"
                  component={Login}
                />
              </Tab.Navigator>
            </View>
            <View style={{ flex: 1 }}>
              <TabBar />
            </View>
          </View>
        ) : (
          <Stack.Navigator headerMode="none" initialRouteName="StreamScreen">
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
