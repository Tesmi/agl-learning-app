import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ToastAndroid } from "react-native";
import { navigationRef } from "./components/TabNavigation/TabNavRef";

//Importing components

import StudentRootNav from "./components/TabNavigation/StudentRootNav";
import TeacherRootNav from "./components/TabNavigation/TeacherRootNav";
import MainStackNav from "./components/StackNavigation/MainStackNav";
import StreamScreen from "./components/LiveStream/StreamScreen";
import TeacherTabBar from "./components/TabNavigation/TeacherScreen/TabbarTeacher/index";
import StudentTabBar from "./components/TabNavigation/StudentScreen/TabbarStudent/index";
import SettingsScreen from "./components/TabNavigation/SettingsScreen/SettingsScreen";
import SupportScreen from "./components/TabNavigation/SupportScreen/SupportScreen";
import DrawerContent from "./components/TabNavigation/Drawer/DrawerContent";

const Drawer = createDrawerNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBottomTabVisible: true,
      token: null,
      accountType: null,
      startStream: false,
      userinfo: { username: "user", email: "user@jitsi.aglofficial.com" },
      url: "https://jitsi.aglofficial.com/1iogsl6izbk",
    };
  }

  async deleteKeys() {
    try {
      //get api refresh token
      let refreshToken = "";
      refreshToken = (await AsyncStorage.getItem("REFRESH_TOKEN")) || null;

      //delete all tokens
      await AsyncStorage.getAllKeys().then((keys) =>
        AsyncStorage.multiRemove(keys)
      );
      //put back api refresh token
      if (refreshToken) {
        await AsyncStorage.setItem("REFRESH_TOKEN", refreshToken);
      }
    } catch (error) {
      //todo: handle error
    }
  }

  startStream() {
    this.setState({ startStream: true });
  }

  stopStream() {
    this.deleteKeys();
    this.setState({ startStream: false });
  }

  changeUrl(url) {
    this.setState({ url });
  }

  changeUserInfo(username, email) {
    this.setState({ userinfo: { username, email } });
  }

  storeToken = async (rToken) => {
    try {
      await AsyncStorage.setItem("REFRESH_TOKEN", rToken);
    } catch (error) {
      ToastAndroid.show(
        `Storage error, can't update tokens...`,
        ToastAndroid.SHORT
      );
    }
  };

  render() {
    return this.state.startStream ? (
      <StreamScreen
        url={this.state.url}
        info={this.state.userinfo}
        stopStream={() => this.stopStream()}
      />
    ) : (
      <NavigationContainer ref={navigationRef}>
        {this.state.token !== null ? (
          <View style={{ flex: 1 }}>
            <Drawer.Navigator
              screenOptions={{ unmountOnBlur: "true" }}
              initialRouteName="root"
              drawerContent={(props) => (
                <DrawerContent
                  token={this.state.token}
                  removeAccessToken={() => this.setState({ token: null })}
                  {...props}
                />
              )}
            >
              <Drawer.Screen
                name="root"
                children={() =>
                  this.state.accountType == "teacher" ? (
                    <TeacherRootNav
                      removeAccessToken={() => this.setState({ token: null })}
                      token={this.state.token}
                      changeURL={(url) => this.changeUrl(url)}
                      startStream={() => this.startStream()}
                      changeUserInfo={(username, email) =>
                        this.changeUserInfo(username, email)
                      }
                    />
                  ) : (
                    <StudentRootNav
                      removeAccessToken={() => this.setState({ token: null })}
                      changeURL={(url) => this.changeUrl(url)}
                      token={this.state.token}
                      startStream={() => this.startStream()}
                      changeUserInfo={(username, email) =>
                        this.changeUserInfo(username, email)
                      }
                    />
                  )
                }
              />
              <Drawer.Screen
                name="settingsScreen"
                children={({ navigation }) => (
                  <SettingsScreen
                    navigation={navigation}
                    hideBottomTab={() =>
                      this.setState({ isBottomTabVisible: false })
                    }
                    showBottomTab={() =>
                      this.setState({ isBottomTabVisible: true })
                    }
                    removeAccessToken={() => this.setState({ token: null })}
                    token={this.state.token}
                  />
                )}
              />

              <Drawer.Screen
                name="supportScreen"
                children={({ navigation }) => (
                  <SupportScreen
                    navigation={navigation}
                    hideBottomTab={() =>
                      this.setState({ isBottomTabVisible: false })
                    }
                    showBottomTab={() =>
                      this.setState({ isBottomTabVisible: true })
                    }
                  />
                )}
              />
            </Drawer.Navigator>
            {this.state.accountType == "teacher" ? (
              <TeacherTabBar
                opacity={this.state.isBottomTabVisible ? 1 : 0}
                height={this.state.isBottomTabVisible ? 62 : 0}
              />
            ) : (
              <StudentTabBar
                opacity={this.state.isBottomTabVisible ? 1 : 0}
                height={this.state.isBottomTabVisible ? 62 : 0}
              />
            )}
          </View>
        ) : (
          <MainStackNav
            activateBottomTab={() =>
              this.setState({ isBottomTabVisible: true })
            }
            storeToken={(token) => this.storeToken(token)}
            pushApiKey={(key) => this.setState({ token: key })}
            pushAccountType={(accountType) => this.setState({ accountType })}
          />
        )}
      </NavigationContainer>
    );
  }
}
