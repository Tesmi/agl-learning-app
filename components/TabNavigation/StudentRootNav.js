import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";

import TabBar from "./StudentScreen/Tabbar/index";

//Importing Screens

import HomeScreen from "./StudentScreen/HomeScreen/HomeScreen";
import LiveClassesScreen from "./StudentScreen/LiveClassesScreen/LiveClassesScreen";
import FilesScreen from "./StudentScreen/FilesScreen/FilesScreen";
import ScheduleScreen from "./StudentScreen/ScheduleScreen/ScheduleScreen";
import NotificationsScreen from "./StudentScreen/NotificationsScreen/NotificationsScreen";
import SettingsScreen from "./StudentScreen/SettingsScreen/SettingsScreen";

const Tab = createBottomTabNavigator();

export default class StudentRootNav extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 12 }}>
        <View style={{ flex: 11 }}>
          <Tab.Navigator initialRouteName="HomeScreen" activeColor="#fff">
            <Tab.Screen
              name="HomeScreen"
              children={(props) => (
                <HomeScreen
                  startStream={this.props.startStream}
                  chengeUserInfo={this.props.chengeUserInfo}
                  {...props}
                />
              )}
              options={{ tabBarVisible: false, unmountOnBlur: true }}
              listeners={({ navigation }) => ({
                blur: () => navigation.setParams({ screen: undefined }),
              })}
            />
            <Tab.Screen
              name="LiveClassesScreen"
              component={LiveClassesScreen}
              options={{ tabBarVisible: false, unmountOnBlur: true }}
              listeners={({ navigation }) => ({
                blur: () => navigation.setParams({ screen: undefined }),
              })}
            />

            <Tab.Screen
              name="FilesScreen"
              component={FilesScreen}
              options={{ tabBarVisible: false, unmountOnBlur: true }}
              listeners={({ navigation }) => ({
                blur: () => navigation.setParams({ screen: undefined }),
              })}
            />
            <Tab.Screen
              name="ScheduleScreen"
              component={ScheduleScreen}
              options={{ tabBarVisible: false, unmountOnBlur: true }}
              listeners={({ navigation }) => ({
                blur: () => navigation.setParams({ screen: undefined }),
              })}
            />
            <Tab.Screen
              name="NotificationsScreen"
              component={NotificationsScreen}
              options={{ tabBarVisible: false, unmountOnBlur: true }}
              listeners={({ navigation }) => ({
                blur: () => navigation.setParams({ screen: undefined }),
              })}
            />
            <Tab.Screen
              name="SettingsScreen"
              component={SettingsScreen}
              options={{ tabBarVisible: false, unmountOnBlur: true }}
              listeners={({ navigation }) => ({
                blur: () => navigation.setParams({ screen: undefined }),
              })}
            />
          </Tab.Navigator>
        </View>
        <View style={{ flex: 1 }}>
          <TabBar />
        </View>
      </View>
    );
  }
}
