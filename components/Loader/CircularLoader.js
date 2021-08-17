import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
} from "react-native";

import axios from "axios";
import config from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class CircularLoader extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let token = "";
    try {
      token = (await AsyncStorage.getItem("REFRESH_TOKEN")) || null;
    } catch (error) {
      ToastAndroid.show(
        `Error : Can't read Tokens from storage`,
        ToastAndroid.SHORT
      );
      return this.props.navigation.navigate("SplashScreen");
    }

    if (token) {
      axios
        .get(`${config.uri}/public/loginToken`, { params: { token } })
        .then((e) => {
          if (e.data.status == "success") {
            this.props.pushAccountType(e.data.data.accountType);
            this.props.pushApiKey(e.data.data.accessToken);
          } else {
            return this.props.navigation.navigate("SplashScreen");
          }
        })
        .catch((err) => {
          return this.props.navigation.navigate("SplashScreen");
        });
    } else {
      return this.props.navigation.navigate("SplashScreen");
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar animated={true} backgroundColor="#5999ab" hidden={false} />
        <ActivityIndicator style={styles.loader} size="large" color="#1c4f4c" />
        <Text style={styles.loadingTxt}>Loading</Text>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5999ab",
    flex: 1,
    justifyContent: "center",
  },
  loader: {
    zIndex: 2,
    transform: [{ scale: 1.45 }],
  },
  loadingTxt: {
    position: "relative",
    color: "#fefefe",
    alignSelf: "center",
    top: 20,
    fontSize: 18,
    fontFamily: "monospace",
  },
});
