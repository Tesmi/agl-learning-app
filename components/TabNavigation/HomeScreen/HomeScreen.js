import React, { Component } from "react";

import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  ToastAndroid,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Appbar,
  Button,
  Subheading,
  Caption,
  Headline,
} from "react-native-paper";

import Clipboard from "@react-native-clipboard/clipboard";

import axios from "axios";
import styles from "./styles";
import config from "../../../config";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      fullName: "",
      totalStudents: "0",
      totalTeachers: "0",
      moderators: "0",
      currentClasses: null,
    };
  }

  componentDidMount() {
    this.getDashboardData();
  }

  joinStream(url) {
    this.props.changeURL(url);
    this.props.startStream();
  }

  copyUrl(url) {
    Clipboard.setString(url.toString());
    return ToastAndroid.show("URL Copied", ToastAndroid.SHORT);
  }

  formatDate(timeinms, onlyTime) {
    const date = new Date(parseInt(timeinms));

    let Str;

    if (onlyTime) {
      Str =
        ("00" + date.getHours()).slice(-2) +
        ":" +
        ("00" + date.getMinutes()).slice(-2) +
        ":" +
        ("00" + date.getSeconds()).slice(-2);
    } else {
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
    }
    return Str;
  }

  async getDashboardData() {
    this.setState({ loading: true });

    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    await axios
      .get(`${config.uri}/api/dashboardData`, head)
      .then((e) => {
        if (e.data.status == "success") {
          let data = e.data.data.dashboardData;
          this.setState({
            fullName: data.fullName,
            totalStudents: data.totalStudents,
            totalTeachers: data.totalTeachers,
            moderators: data.moderators,
            currentClasses: data.currentClasses,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  }

  render() {
    return this.state.loading ? (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          animated={true}
          barStyle={"light-content"}
          backgroundColor="#6200ee"
        />

        <View>
          <Appbar.Header>
            <Appbar.Content title="Dashboard" />
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
            <Appbar.Content title="Dashboard" />
          </Appbar.Header>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "#dcdee3" }}
        >
          <View style={{ padding: 10 }}>
            <Text
              style={{
                fontFamily: "WelcomeY2k-51jz",
                fontSize: 23,
                color: "teal",
              }}
            >
              {`Welcome, ${this.state.fullName}`}
            </Text>

            {this.state.currentClasses ? (
              <View style={styles.classesContainer}>
                <Text style={styles.heading}>Current Classes</Text>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  {this.state.currentClasses.map((obj, key) => (
                    <View style={styles.dataContainer} key={key}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                        }}
                      >
                        <View style={{ width: "63%" }}>
                          <Headline
                            style={{
                              marginLeft: 12,
                              marginTop: 10,
                              fontWeight: "bold",
                            }}
                          >
                            {obj.LectureName}
                          </Headline>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "row",
                              flexWrap: "wrap",
                            }}
                          >
                            <Subheading
                              style={{
                                marginLeft: 15,
                              }}
                            >
                              {obj.Board == "Everyone"
                                ? "All Boards"
                                : obj.Board}
                            </Subheading>

                            <Subheading
                              style={{
                                marginLeft: 15,
                              }}
                            >
                              {obj.ClassData == "Everyone"
                                ? "All Classes"
                                : "Class " + obj.ClassData}
                            </Subheading>
                          </View>

                          <Subheading
                            style={{
                              marginLeft: 15,
                            }}
                          >
                            {obj.By}
                          </Subheading>

                          <Caption style={{ marginLeft: 15, marginBottom: 10 }}>
                            {this.formatDate(obj.Start) +
                              " to " +
                              this.formatDate(obj.End, true)}
                          </Caption>
                        </View>
                        <View
                          style={{
                            width: "37%",
                            backgroundColor: "#dee3e1",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            onPress={() => {
                              this.joinStream(obj.URL);
                            }}
                            icon="account-plus"
                            style={{ marginBottom: 7, marginTop: 6 }}
                            compact={true}
                            mode="contained"
                          >
                            Join
                          </Button>
                          <Button
                            onPress={() => {
                              this.copyUrl(obj.URL);
                            }}
                            icon="content-copy"
                            color="#218838"
                            style={{ marginBottom: 7 }}
                            compact={true}
                            mode="contained"
                          >
                            Copy URL
                          </Button>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <View style={styles.imageContainer}>
              <View
                style={{
                  ...styles.centeredContainer,
                  marginTop: 10,
                }}
              >
                <Text style={{ ...styles.text, color: "purple" }}>
                  Students
                </Text>
                <Text style={{ ...styles.text, color: "orange" }}>
                  Teachers
                </Text>
              </View>
              <View style={styles.centeredContainer}>
                <Image
                  source={require("../../../assets/student.png")}
                  style={styles.images}
                />
                <Image
                  source={require("../../../assets/teacher.png")}
                  style={styles.images}
                />
              </View>
              <View
                style={{
                  ...styles.centeredContainer,
                  marginTop: -10,
                  marginBottom: 10,
                }}
              >
                <Text style={styles.numberTxt}>{this.state.totalStudents}</Text>
                <Text style={{ ...styles.numberTxt, marginLeft: "11%" }}>
                  {this.state.totalTeachers}
                </Text>
              </View>
            </View>

            <View
              style={{
                borderTopColor: "#d6d4d0",
                borderTopWidth: 1,
                backgroundColor: "white",
                ...styles.centeredContainer,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
              >
                <Text
                  style={{ alignSelf: "center", fontSize: 24, color: "teal" }}
                >
                  Moderators
                </Text>
                <Text
                  style={{
                    marginTop: -30,
                    alignSelf: "center",
                    fontSize: 24,
                    color: "red",
                  }}
                >
                  {this.state.moderators}
                </Text>
              </View>

              <Image
                source={require("../../../assets/moderator.png")}
                style={styles.images}
              />
            </View>

            <View
              style={{
                marginTop: 10,
                backgroundColor: "white",
                alignItems: "center",
                paddingTop: 10,
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "orange" }}
              >
                Social Media Links
              </Text>
            </View>
            <View style={styles.socialContainer}>
              <TouchableOpacity>
                <Image
                  source={require("../../../assets/facebook.png")}
                  style={styles.socialIcons}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={require("../../../assets/instagram.png")}
                  style={styles.socialIcons}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={require("../../../assets/twitter.png")}
                  style={styles.socialIcons}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: 10,
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 10,
              }}
            >
              <Text style={{ color: "gray" }}>
                Copyright {"\u00A9"} 2021 AGL-LEARNING.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
