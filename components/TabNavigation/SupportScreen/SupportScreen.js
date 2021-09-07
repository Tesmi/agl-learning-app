import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Alert,
  ScrollView,
  StatusBar,
  BackHandler,
} from "react-native";
import { Appbar, TextInput, Button } from "react-native-paper";

import axios from "axios";
import styles from "./styles";
import config from "../../../config";

export default class SupportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendingMsg: false,
      fullname: "",
      email: "",
      phone: "",
      query: "",
    };
  }

  componentDidMount() {
    this.props.hideBottomTab();
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = () => {
    this.props.showBottomTab();
  };

  resetState() {
    this.setState({
      sendingMsg: false,
      fullname: "",
      email: "",
      phone: "",
      query: "",
    });
  }

  async submitMsg() {
    this.setState({ sendingMsg: true });

    let email = this.state.email;
    let query = this.state.query;
    let phone = this.state.phone;
    let fullname = this.state.fullname;

    if (!email || !query || !phone || !fullname) {
      this.setState({ sendingMsg: false });
      return ToastAndroid.show(
        "Error : All fields are required.",
        ToastAndroid.SHORT
      );
    }

    email = email.toString().trim().toLocaleLowerCase();
    query = query.toString().trim();
    phone = phone.toString().trim();
    fullname = fullname.toString().trim();

    if (!email || !query || !phone || !fullname) {
      this.setState({ sendingMsg: false });
      return ToastAndroid.show(
        "Error : All fields are required.",
        ToastAndroid.SHORT
      );
    }

    if (!(email.includes("@") && email.includes("."))) {
      this.setState({ sendingMsg: false });
      return ToastAndroid.show(
        "Please enter a valid email",
        ToastAndroid.SHORT
      );
    }

    if (phone.length != 10) {
      this.setState({ sendingMsg: false });
      return ToastAndroid.show(
        "Please enter a valid phone number",
        ToastAndroid.SHORT
      );
    }

    let msg = `<h1>UserInfo :</h1>
    <h2> Email : ${this.state.email}</h2>
    <h2> phone : ${this.state.phone}</h2>
    <h2> name : ${this.state.fullname}</h2>
    <h2> Query : </h2>
    <h3>&emsp;&emsp;&emsp;&emsp;${this.state.query}</h3>`;

    let sub = "Support";

    let aglEmail = "aglofficial29@gmail.com";

    await axios
      .get(`${config.uri}/public/sendEmail`, {
        params: {
          email: aglEmail,
          msg,
          sub,
        },
      })
      .then((e) => {
        if (e.data.status == "success") {
          Alert.alert(
            "MESSAGE SENT",
            "Thankyou for contacting AGL support team, we'll reach you in under 24 hours.",
            [{ text: "OKAY", onPress: () => this.resetState() }]
          );
        } else {
          this.setState({ sendingMsg: false });
          return ToastAndroid.show(
            "Server error, try again later",
            ToastAndroid.SHORT
          );
        }
      })
      .catch((err) => {
        this.setState({ sendingMsg: false });
        return ToastAndroid.show(
          "Server error, try again later",
          ToastAndroid.SHORT
        );
      });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          barStyle={"light-content"}
          backgroundColor="#6200ee"
        />
        <View>
          <Appbar.Header>
            <Appbar.Action
              icon="menu"
              onPress={() => this.props.navigation.openDrawer()}
            />
            <Appbar.Content title="Support" />
            <Appbar.Action
              icon="close"
              onPress={() => {
                this.props.showBottomTab();
                this.props.navigation.navigate("root");
              }}
            />
          </Appbar.Header>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.container}>
            <TextInput
              onChangeText={(fullname) => this.setState({ fullname })}
              value={this.state.fullname}
              style={styles.textInp}
              mode="outlined"
              label="Full name"
            />
            <TextInput
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
              style={styles.textInp}
              mode="outlined"
              label="Email"
            />
            <TextInput
              onChangeText={(phone) => this.setState({ phone })}
              value={this.state.phone}
              style={styles.textInp}
              mode="outlined"
              label="Phone number"
              keyboardType="number-pad"
            />

            <TextInput
              onChangeText={(query) => this.setState({ query })}
              value={this.state.query}
              style={styles.textInp}
              multiline={true}
              numberOfLines={7}
              mode="outlined"
              label="Query"
            />
            <Button
              loading={this.state.sendingMsg}
              disabled={this.state.sendingMsg}
              mode="contained"
              style={styles.submitBtn}
              onPress={() => this.submitMsg()}
            >
              Submit
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
