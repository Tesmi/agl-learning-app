import React, { Component } from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//Importing Screens

import HomeScreen from "./HomeScreen/HomeScreen";
import FilesScreen from "./TeacherScreen/FilesScreen/FilesScreen";
import NotificationScreen from "./TeacherScreen/NotificationScreen/NotificationScreen";
import ScheduleScreen from "./TeacherScreen/ScheduleScreen/ScheduleScreen";
import RecVidScreen from "./TeacherScreen/RecordedVidScreen/RecVidScreen";

const Tab = createBottomTabNavigator();

export default class TeacherRootNav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Tab.Navigator initialRouteName="HomeScreen" activeColor="#fff">
          <Tab.Screen
            name="HomeScreen"
            children={(props) => (
              <HomeScreen
                changeURL={(url) => this.props.changeURL(url)}
                startStream={() => this.props.startStream()}
                token={this.props.token}
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
            name="FilesScreen"
            options={{ tabBarVisible: false, unmountOnBlur: true }}
            listeners={({ navigation }) => ({
              blur: () => navigation.setParams({ screen: undefined }),
            })}
          >
            {({ navigation }) => (
              <FilesScreen navigation={navigation} token={this.props.token} />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="ScheduleScreen"
            options={{ tabBarVisible: false, unmountOnBlur: true }}
            listeners={({ navigation }) => ({
              blur: () => navigation.setParams({ screen: undefined }),
            })}
          >
            {({ navigation }) => (
              <ScheduleScreen
                changeURL={(url) => this.props.changeURL(url)}
                startStream={() => this.props.startStream()}
                navigation={navigation}
                token={this.props.token}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="NotificationScreen"
            options={{ tabBarVisible: false, unmountOnBlur: true }}
            listeners={({ navigation }) => ({
              blur: () => navigation.setParams({ screen: undefined }),
            })}
          >
            {({ navigation }) => (
              <NotificationScreen
                navigation={navigation}
                token={this.props.token}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="RecordedVideoScreen"
            options={{ tabBarVisible: false, unmountOnBlur: true }}
            listeners={({ navigation }) => ({
              blur: () => navigation.setParams({ screen: undefined }),
            })}
          >
            {({ navigation }) => (
              <RecVidScreen
                hideBottomTab={this.props.hideBottomTab}
                showBottomTab={this.props.showBottomTab}
                navigation={navigation}
                token={this.props.token}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    );
  }
}
