import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

//Importing components
import { navigationRef } from "./components/TabNavigation/TabNavRef";
import StudentRootNav from "./components/TabNavigation/StudentRootNav";
import MainStackNav from "./components/StackNavigation/MainStackNav";
import StreamScreen from "./components/LiveStream/StreamScreen";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      startStream: false,
      userinfo: { username: "user", email: "user@jitsi.aglofficial.com" },
    };
  }

  async deleteKeys() {
    //get api refresh token
    //delete all tokens
    //put back api refresh token
    try {
      await AsyncStorage.getAllKeys()
        .then((keys) => AsyncStorage.multiRemove(keys))
        .then(() => console.log(AsyncStorage.getAllKeys()));
    } catch (error) {
      console.error("Error clearing app data.");
    }
  }

  startStream() {
    this.setState({ startStream: true });
  }

  stopStream() {
    console.log("Stop stream triggered");
    this.deleteKeys();
    this.setState({ startStream: false });
  }

  changeUserInfo(username, email) {
    this.setState({ userinfo: { username, email } });
  }

  render() {
    return this.state.startStream ? (
      <StreamScreen
        info={this.state.userinfo}
        stopStream={() => this.stopStream()}
      />
    ) : (
      <NavigationContainer ref={navigationRef}>
        {this.state.token !== null ? (
          <StudentRootNav
            startStream={() => this.startStream()}
            chengeUserInfo={(username, email) =>
              this.changeUserInfo(username, email)
            }
          />
        ) : (
          <MainStackNav />
        )}
      </NavigationContainer>
    );
  }
}
