import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ToastAndroid } from "react-native";

//Importing components
import { navigationRef } from "./components/TabNavigation/TabNavRef";
import StudentRootNav from "./components/TabNavigation/StudentRootNav";
import TeacherRootNav from "./components/TabNavigation/TeacherRootNav";
import MainStackNav from "./components/StackNavigation/MainStackNav";
import StreamScreen from "./components/LiveStream/StreamScreen";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
        ) : (
          <MainStackNav
            storeToken={(token) => this.storeToken(token)}
            pushApiKey={(key) => this.setState({ token: key })}
            pushAccountType={(accountType) => this.setState({ accountType })}
          />
        )}
      </NavigationContainer>
    );
  }
}
