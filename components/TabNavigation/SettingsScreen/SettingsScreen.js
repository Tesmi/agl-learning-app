import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  ToastAndroid,
  Alert,
  StatusBar,
  BackHandler,
} from "react-native";
import { Appbar, TextInput, List, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";
import axios from "axios";
import config from "../../../config";

export default class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: "",
      username: "",
      contact: "",
      accountType: "",
      createdOn: "",
      gender: "",
      fullName: "",
      userCurrentPassword: "",
      userPassword: "",
      confirmUserPassword: "",
      board: null,
      grade: null,
      class: "",
      updatingPassword: false,
      updatingAccount: false,
      deletingAccount: false,
      classExpanded: false,
      boardExpanded: false,
      loggingOut: false,
    };
  }

  componentDidMount() {
    this.props.hideBottomTab();
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
    this.getSettingsData();
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = () => {
    this.props.showBottomTab();
  };

  async updateProfile() {
    this.setState({ updatingAccount: true });

    let fullName = this.state.fullName;
    let email = this.state.email;
    let contact = this.state.contact;
    let accountType = this.state.accountType;
    let board = this.state.board;
    let grade = this.state.grade;

    if (!fullName || !email || !contact || !accountType) {
      this.setState({ updatingAccount: false });
      return ToastAndroid.show(
        "Error : All fields are required",
        ToastAndroid.SHORT
      );
    }

    fullName = fullName.toString().trim();
    email = email.toString().trim();
    contact = contact.toString().trim();

    if (!fullName || !email || !contact) {
      this.setState({ updatingAccount: false });
      return ToastAndroid.show("Error : Invalid request", ToastAndroid.SHORT);
    }

    if (!(email.includes("@") && email.includes("."))) {
      this.setState({ updatingAccount: false });
      return ToastAndroid.show("Error : Invalid email", ToastAndroid.SHORT);
    }

    if (contact.length != 10) {
      this.setState({ updatingAccount: false });
      return ToastAndroid.show("Error : Invalid contact", ToastAndroid.SHORT);
    }

    let dataToBeUpdated = {
      fullName,
      email,
      contact,
      accountType,
    };

    try {
      if (accountType == "teacher") {
        //do nothing
      } else if (accountType == "student") {
        dataToBeUpdated.board = board;
        dataToBeUpdated.grade = grade;
      } else {
        throw new Error("error");
      }

      let head = {
        headers: {
          authorization: `token ${this.props.token}`,
        },
      };

      axios
        .post(`${config.uri}/api/updateProfile`, dataToBeUpdated, head)
        .then((e) => {
          if (e.data.status == "success") {
            ToastAndroid.show("Profile Updated", ToastAndroid.SHORT);
            this.setState({ updatingAccount: false });
            return this.getSettingsData();
          } else {
            this.setState({ updatingAccount: false });
            ToastAndroid.show(
              "Can't update profile, try again later",
              ToastAndroid.SHORT
            );
          }
        })
        .catch((err) => {
          this.setState({ updatingAccount: false });
          return ToastAndroid.show(
            "Error : Unexpected error, try again later.",
            ToastAndroid.SHORT
          );
        });
    } catch (error) {
      this.setState({ updatingAccount: false });
      return ToastAndroid.show(
        "Error : Unexpected error, try again later.",
        ToastAndroid.SHORT
      );
    }
  }

  async getSettingsData() {
    this.setState({ loading: true });
    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    await axios
      .get(`${config.uri}/api/getUserProfileInfo`, head)
      .then((e) => {
        if (e.data.status == "success") {
          let data = e.data.data.userData;
          if (data.AccountType == "student") {
            this.setState({
              fullName: data.FullName,
              username: data.UserName,
              email: data.Email,
              contact: data.Contact,
              accountType: data.AccountType,
              createdOn: this.getDate(data.CreatedOn),
              board: data.Board,
              grade: data.Grade,
              loading: false,
            });
          } else {
            this.setState({
              fullName: data.FullName,
              username: data.UserName,
              email: data.Email,
              contact: data.Contact,
              accountType: data.AccountType,
              createdOn: this.getDate(data.CreatedOn),
              loading: false,
            });
          }
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  }

  getDate(timeinms) {
    const date = new Date(parseInt(timeinms));
    Str =
      ("00" + date.getDate()).slice(-2) +
      "/" +
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      date.getFullYear() +
      " " +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2) +
      ":" +
      ("00" + date.getSeconds()).slice(-2);

    return Str;
  }

  resetPasswordState(msg) {
    this.setState({
      userCurrentPassword: "",
      userPassword: "",
      confirmUserPassword: "",
      updatingPassword: false,
    });

    if (msg == "success") {
      this.logout();
    }
  }

  async updatePassword() {
    this.setState({ updatingPassword: true });

    let currentPassword = this.state.userCurrentPassword;
    let newPassword = this.state.userPassword;
    let confirmNewPassword = this.state.confirmUserPassword;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      ToastAndroid.show(
        "Error : Fill all required fields.",
        ToastAndroid.SHORT
      );
      return this.resetPasswordState();
    }

    currentPassword = currentPassword.toString();
    newPassword = newPassword.toString();
    confirmNewPassword = confirmNewPassword.toString();

    if (newPassword.length < 8) {
      ToastAndroid.show(
        "Error : New password is too small.",
        ToastAndroid.SHORT
      );
      return this.resetPasswordState();
    }

    if (confirmNewPassword != newPassword) {
      ToastAndroid.show(
        "Error : New password and confirm new password doesn't match.",
        ToastAndroid.SHORT
      );
      return this.resetPasswordState();
    }

    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    let data = { currentPassword, newPassword, confirmNewPassword };

    await axios
      .post(`${config.uri}/api/updatePassword`, data, head)
      .then((e) => {
        if (e.data.status == "success") {
          ToastAndroid.show(
            "Password updated successfully",
            ToastAndroid.SHORT
          );
          return this.logout();
        } else {
          ToastAndroid.show(e.data.msg, ToastAndroid.SHORT);
          return this.resetPasswordState();
        }
      })
      .catch((err) => {
        ToastAndroid.show("Network Error, try again later", ToastAndroid.SHORT);
        return this.resetPasswordState();
      });
  }

  async logout() {
    this.setState({ loggingOut: true });
    let refreshToken = null;
    //get the refresh token
    try {
      refreshToken = await AsyncStorage.getItem("REFRESH_TOKEN");
      return refreshToken != null ? JSON.parse(refreshToken) : null;
    } catch (e) {
      // read error
    }

    //post request to the server to delete token
    await axios
      .get(`${config.uri}/public/logout`, { params: { token: refreshToken } })
      .then((e) => {
        //delete the refresh token in async storage
      })
      .catch((err) => null);

    try {
      await AsyncStorage.removeItem("REFRESH_TOKEN");
      //remove access token from state of app.js
      this.props.removeAccessToken();
    } catch (e) {
      // remove error
    }
  }

  async deleteAccount() {
    this.setState({ deletingAccount: true });

    Alert.alert("Hold on!", "Are you sure you want to delete your account?", [
      {
        text: "Cancel",
        onPress: () => this.setState({ deletingAccount: false }),
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            let head = {
              headers: {
                authorization: `token ${this.props.token}`,
              },
            };
            await axios
              .get(`${config.uri}/api/deleteAccount`, head)
              .then((e) => {
                if (e.data.status == "success") {
                  ToastAndroid.show("Account Deleted.", ToastAndroid.SHORT);
                  return this.logout();
                } else {
                  throw new Error("error");
                }
              })
              .catch((err) => {
                this.setState({ deletingAccount: false });
                return ToastAndroid.show(
                  "Error: Can't delete account, try again later.",
                  ToastAndroid.SHORT
                );
              });
          } catch (error) {
            this.setState({ deletingAccount: false });
            return ToastAndroid.show(
              "Error: Can't delete account, try again later.",
              ToastAndroid.SHORT
            );
          }
        },
      },
    ]);
    return true;
  }
  setBoard(board) {
    this.setState({ board, boardExpanded: !this.state.boardExpanded });
  }

  setClass(txt, grade) {
    this.setState({
      class: txt,
      grade: grade,
      classExpanded: !this.state.classExpanded,
    });
  }

  render() {
    const standard = [
      { "Sixth Standard": 6 },
      { "Seventh Standard": 7 },
      { "Eighth Standard": 8 },
      { "Ninth Standard": 9 },
      { "Tenth Standard": 10 },
      { "Eleventh Standard": 11 },
      { "Twelfth Standard": 12 },
    ];

    const board = [
      "C.B.S.E Board",
      "I.C.S.E Board",
      "U.P. Board",
      "Rajasthan Board",
      "Bihar Board",
      "Haryana Board",
      "Madhya Pradesh Board",
      "Himachal Pradesh Board",
      "Punjab Board",
      "Maharashtra Board",
      "Odissa Board",
      "West Bengal Board",
      "Gujrat Board",
      "Delhi Board",
      "J & K Board",
      "Andhra Pradesh Board",
    ];

    return this.state.loading ? (
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
            <Appbar.Content title="Settings" />
            <Appbar.Action
              icon="close"
              onPress={() => {
                this.props.showBottomTab();
                this.props.navigation.navigate("root");
              }}
            />
          </Appbar.Header>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#6200ee" />
          <Text
            style={{
              marginTop: 10,
              fontSize: 17,
              color: "#12668a",
              fontWeight: "bold",
            }}
          >
            Loading
          </Text>
        </View>
      </SafeAreaView>
    ) : (
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
            <Appbar.Content title="Settings" />
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
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "#f2f5f0" }}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{ ...styles.profileContainer, borderColor: "#036363" }}
            >
              <Text style={{ ...styles.heading, color: "#036363" }}>
                Profile
              </Text>

              <TextInput
                mode="outlined"
                label="Full Name"
                value={this.state.fullName}
                onChangeText={(txt) => this.setState({ fullName: txt })}
              />

              <TextInput
                style={{ marginTop: 10 }}
                mode="outlined"
                disabled={true}
                label="Your Username"
                value={this.state.username}
              />
              <TextInput
                style={{ marginTop: 10 }}
                mode="outlined"
                label="Your Email"
                value={this.state.email}
                onChangeText={(txt) => this.setState({ email: txt })}
              />

              <TextInput
                style={{ marginTop: 10 }}
                mode="outlined"
                label="Contact Number"
                value={this.state.contact}
                onChangeText={(txt) => this.setState({ contact: txt })}
              />

              <TextInput
                style={{ marginTop: 10 }}
                mode="outlined"
                label="Account Type"
                disabled={true}
                value={this.state.accountType.toUpperCase() || "Not Found"}
              />

              <TextInput
                style={{ marginTop: 10 }}
                mode="outlined"
                label="Registered On"
                disabled={true}
                value={this.state.createdOn.toString() || "Not Found"}
              />

              {this.state.accountType == "student" ? (
                <View>
                  <List.Section title="Class">
                    <List.Accordion
                      title={this.state.grade}
                      left={(props) => <List.Icon {...props} icon="school" />}
                      expanded={this.state.classExpanded}
                      onPress={() =>
                        this.setState({
                          classExpanded: !this.state.classExpanded,
                        })
                      }
                    >
                      {standard.map((grade, key) => (
                        <List.Item
                          onPress={() =>
                            this.setClass(
                              Object.keys(grade)[0],
                              grade[Object.keys(grade)[0]].toString()
                            )
                          }
                          title={Object.keys(grade)[0]}
                          key={key}
                        />
                      ))}
                    </List.Accordion>
                  </List.Section>

                  <List.Section title="Board">
                    <List.Accordion
                      title={this.state.board}
                      left={(props) => <List.Icon {...props} icon="apps-box" />}
                      expanded={this.state.boardExpanded}
                      onPress={() =>
                        this.setState({
                          boardExpanded: !this.state.boardExpanded,
                        })
                      }
                    >
                      {board.map((board, key) => (
                        <List.Item
                          onPress={() => this.setBoard(board)}
                          title={board}
                          key={key}
                        />
                      ))}
                    </List.Accordion>
                  </List.Section>
                </View>
              ) : null}

              <Button
                icon="update"
                color="#036363"
                style={{ marginTop: 12 }}
                mode="contained"
                onPress={() => this.updateProfile()}
                loading={this.state.updatingAccount}
                disabled={this.state.updatingAccount}
              >
                UPDATE ACCOUNT INFO
              </Button>
            </View>

            <View
              style={{ ...styles.profileContainer, borderColor: "#f74b00" }}
            >
              <Text style={{ ...styles.heading, color: "#f74b00" }}>
                Security
              </Text>

              <TextInput
                mode="outlined"
                label="Current Password"
                secureTextEntry={true}
                value={this.state.userCurrentPassword}
                onChangeText={(txt) =>
                  this.setState({ userCurrentPassword: txt })
                }
              />

              <TextInput
                style={{ marginTop: 10 }}
                mode="outlined"
                label="New Password"
                secureTextEntry={true}
                value={this.state.userPassword}
                onChangeText={(txt) => this.setState({ userPassword: txt })}
              />

              <TextInput
                style={{ marginTop: 10 }}
                mode="outlined"
                label="Confirm New Password"
                secureTextEntry={true}
                value={this.state.confirmUserPassword}
                onChangeText={(txt) =>
                  this.setState({ confirmUserPassword: txt })
                }
              />

              <Button
                icon="lock-reset"
                color="#f74b00"
                style={{ marginTop: 12 }}
                mode="contained"
                onPress={() => this.updatePassword()}
              >
                UPDATE PASSWORD
              </Button>
            </View>

            <View
              style={{ ...styles.profileContainer, borderColor: "#dc3545" }}
            >
              <Text style={{ ...styles.heading, color: "#dc3545" }}>
                Actions
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 12,
                }}
              >
                <Button
                  onPress={() => this.deleteAccount()}
                  loading={this.state.deletingAccount}
                  disabled={this.state.deletingAccount}
                  icon="delete-alert"
                  color="#dc3545"
                  mode="contained"
                >
                  DELETE ACCOUNT
                </Button>
                <Button
                  onPress={() => this.logout()}
                  icon="exit-to-app"
                  loading={this.state.loggingOut}
                  disabled={this.state.loggingOut}
                  color="#17a2b8"
                  mode="contained"
                >
                  LOGOUT
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
