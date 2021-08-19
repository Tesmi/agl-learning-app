import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  ToastAndroid,
  Image,
} from "react-native";
import DatePicker from "react-native-date-picker";
import {
  Appbar,
  TextInput,
  List,
  Button,
  Subheading,
  Caption,
  Headline,
} from "react-native-paper";

import styles from "./styles";
import axios from "axios";
import config from "../../../../config";
import Clipboard from "@react-native-clipboard/clipboard";

export default class ScheduleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
    };
  }

  componentDidMount() {
    this.getAllClassesData();
  }

  copyUrl(url) {
    Clipboard.setString(url.toString());
    return ToastAndroid.show("URL Copied", ToastAndroid.SHORT);
  }

  joinStream(url) {
    this.props.changeURL(url);
    this.props.startStream();
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

  async getAllClassesData() {
    this.setState({ loading: true });

    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };
    await axios
      .get(`${config.uri}/api/getAllClassesDataStudent`, head)
      .then((e) => {
        if (e.data.status == "success") {
          this.setState({ data: e.data.data.document, loading: false });
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
            <Appbar.Content title="Schedules" />
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
    ) : this.state.data ? (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar
          animated={true}
          barStyle={"light-content"}
          backgroundColor="#6200ee"
        />
        <View>
          <Appbar.Header>
            <Appbar.Content title="Schedules" />
          </Appbar.Header>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "#f2f5f0" }}
        >
          <View style={{ alignItems: "center" }}>
            <View style={{ ...styles.scheduleContainer, marginBottom: 15 }}>
              <Text style={styles.heading}>Scheduled Classes</Text>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                }}
              >
                {this.state.data.map((obj, key) => (
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
                            {obj.Board == "Everyone" ? "All Boards" : obj.Board}
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
          </View>
        </ScrollView>
      </SafeAreaView>
    ) : (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar
          animated={true}
          barStyle={"light-content"}
          backgroundColor="#6200ee"
        />
        <View>
          <Appbar.Header>
            <Appbar.Content title="Schedules" />
          </Appbar.Header>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            style={{ width: 280, height: 280 }}
            source={require("../../../../assets/noSchedules.png")}
          />
          <Text style={{ fontSize: 20, color: "gray" }}>
            No classes scheduled for you.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}
