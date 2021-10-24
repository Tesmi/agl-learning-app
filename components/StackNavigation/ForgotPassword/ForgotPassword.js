import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  ToastAndroid,
  Alert,
} from "react-native";
import { Button, TextInput } from "react-native-paper";

import OTPTextView from "react-native-otp-textinput";

import styles from "./styles";
import config from "../../../config";
import axios from "axios";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      confirmNewPassword: "",
      AccountUsername: "",
      AccountEmail: "",
      emailOrUsername: "",
      userOTP: "",
      OTP: "",
      canEnterOTP: false,
      otpVerified: false,
      findingAccount: false,
      updatingPassword: false,
    };

    this.otpRef = React.createRef();
  }

  async sendOTP() {
    let otp = Math.floor(100000 + Math.random() * 900000);
    let email = this.state.AccountEmail;

    this.setState({ OTP: otp });

    let msg = `<!DOCTYPE html><html lang="en"><body><h2> Welcome to AGL-Learning-App your otp is</h2><h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2></body></html>`;
    let sub = "OTP from AGL-Learning-App";
    try {
      axios.get(`${config.uri}/public/sendEmail`, {
        params: { msg, sub, email },
      });
    } catch (error) {
      return ToastAndroid.show(
        "Unable to send otp, try again later",
        ToastAndroid.SHORT
      );
    }
  }

  async verifyOTP() {
    if (this.state.userOTP == this.state.OTP) {
      this.setState({ otpVerified: true });
    } else {
      return ToastAndroid.show("Invalid OTP", ToastAndroid.SHORT);
    }
  }

  async findAccount() {
    this.setState({ findingAccount: true });
    let user = this.state.emailOrUsername;

    if (!user) {
      this.setState({ findingAccount: false });
      return ToastAndroid.show("Invalid Username or Email", ToastAndroid.SHORT);
    }

    user = user.trim().toString();

    if (!user) {
      this.setState({ findingAccount: false });
      return ToastAndroid.show("Invalid Username or Email", ToastAndroid.SHORT);
    }

    await axios
      .get(`${config.uri}/public/findUserInfo`, { params: { user } })
      .then((e) => {
        if (e.data.status == "success") {
          this.setState({
            AccountUsername: e.data.data.username,
            AccountEmail: e.data.data.email,
            canEnterOTP: true,
            findAccount: false,
          });
          this.sendOTP();
        } else {
          this.setState({ findingAccount: false });
          return ToastAndroid.show(
            "No account found with this email or username.",
            ToastAndroid.SHORT
          );
        }
      })
      .catch((err) => {
        this.setState({ findingAccount: false });
        return ToastAndroid.show(
          "Network error, try again later",
          ToastAndroid.SHORT
        );
      });
  }

  async updatePassword() {
    this.setState({ updatingPassword: true });

    let password = this.state.newPassword;
    let confirmPassword = this.state.confirmNewPassword;

    if (password != confirmPassword) {
      this.setState({ updatingPassword: false });
      return ToastAndroid.show(
        "Password doesn't match confirm password.",
        ToastAndroid.SHORT
      );
    }

    if (password.length != password.trim().length) {
      this.setState({ updatingPassword: false });
      return ToastAndroid.show(
        "Spaces are not allowed in password.",
        ToastAndroid.SHORT
      );
    }

    if (password.length < 8) {
      this.setState({ updatingPassword: false });
      return ToastAndroid.show("Password is too short.", ToastAndroid.SHORT);
    }

    await axios
      .get(`${config.uri}/public/updatePassword`, {
        params: { password: password, username: this.state.AccountUsername },
      })
      .then((e) => {
        if (e.data.status == "success") {
          Alert.alert("Success", "Password updated successfully.");
          this.setState({ updatingPassword: false });
          return this.props.navigation.navigate("Login");
        } else {
          this.setState({ updatingPassword: false });
          return ToastAndroid.show(
            "Something went wrong, try again later.",
            ToastAndroid.SHORT
          );
        }
      })
      .catch((e) => {
        this.setState({ updatingPassword: false });
        return ToastAndroid.show(
          "Something went wrong, try again later.",
          ToastAndroid.SHORT
        );
      });
  }

  render() {
    return (
      <SafeAreaView style={{ backgroundColor: "#fff", flex: 1 }}>
        <Text style={styles.heading}> Forgot Password?</Text>
        <View style={styles.container}>
          <Image
            source={require("../../../assets/forgot_password.png")}
            style={styles.OTPImg}
            resizeMode="contain"
          />
          {this.state.otpVerified ? (
            <View style={{ width: "100%", alignItems: "center" }}>
              <TextInput
                secureTextEntry={true}
                style={{ width: "95%" }}
                mode="outlined"
                label="Enter your new password"
                value={this.state.newPassword}
                onChangeText={(text) => this.setState({ newPassword: text })}
              />

              <TextInput
                secureTextEntry={true}
                style={{ width: "95%" }}
                mode="outlined"
                label="Re-enter your new password"
                value={this.state.confirmNewPassword}
                onChangeText={(text) =>
                  this.setState({ confirmNewPassword: text })
                }
              />

              <Button
                mode="contained"
                loading={this.state.updatingPassword}
                disabled={this.state.updatingPassword}
                marginTop={20}
                onPress={() => this.updatePassword()}
              >
                Update Password
              </Button>
            </View>
          ) : this.state.canEnterOTP ? (
            <>
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                Enter the OTP that we've sent to your email.
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 15, color: "red" }}>
                {this.state.AccountEmail}
              </Text>
              <OTPTextView
                handleTextChange={(e) => {
                  this.setState({ userOTP: e });
                }}
                containerStyle={styles.textInputContainer}
                textInputStyle={styles.roundedTextInput}
                inputCount={6}
                inputCellLength={1}
                tintColor="#6d63ff"
                ref={(e) => (this.otpRef = e)}
              />
              <Button mode="contained" onPress={() => this.verifyOTP()}>
                Verify OTP
              </Button>
            </>
          ) : (
            <>
              <TextInput
                style={{ width: "95%" }}
                mode="outlined"
                label="Enter your email or username"
                value={this.state.emailOrUsername}
                onChangeText={(text) =>
                  this.setState({ emailOrUsername: text })
                }
              />
              <Button
                icon="account-search"
                onPress={() => this.findAccount()}
                loading={this.state.findingAccount}
                disabled={this.state.findingAccount}
                mode="contained"
                style={{ height: 40, width: "95%", marginTop: 10 }}
              >
                Find Account
              </Button>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }
}
