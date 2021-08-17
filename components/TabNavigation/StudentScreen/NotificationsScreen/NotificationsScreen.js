import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  ToastAndroid,
  StatusBar,
  Image,
} from "react-native";

import {
  Appbar,
  TextInput,
  List,
  Button,
  Subheading,
  Card,
  Paragraph,
} from "react-native-paper";

import axios from "axios";
import styles from "./styles";
import config from "../../../../config";

export default class NotificationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, data: null };
  }

  componentDidMount() {
    this.getAllData();
  }

  async getAllData() {
    this.setState({ loading: true });
    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    await axios
      .get(`${config.uri}/api/getAllNotificationsStudent`, head)
      .then((e) => {
        if (e.data.status == "success") {
          this.setState({ data: e.data.data.notifications, loading: false });
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
            <Appbar.Content title="Notifications" />
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
            <Appbar.Content title="Files" />
          </Appbar.Header>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: "#dcdee3",
            alignItems: "center",
          }}
        >
          <View style={{ ...styles.NotificationContainer, marginBottom: 15 }}>
            <Text style={styles.heading}>Notifications</Text>
            <View
              style={{
                flex: 1,
                alignItems: "center",
              }}
            >
              {this.state.data.map((obj, key) => (
                <Card
                  key={key}
                  style={{
                    width: "100%",
                    borderRadius: 6,
                    borderWidth: 1,
                    borderColor: "purple",
                    marginTop: 10,
                  }}
                >
                  <Card.Title title={obj.Subject} />
                  <Card.Content>
                    <Subheading style={{ marginTop: -10 }}>
                      {(obj.Board == "Everyone" ? "All Boards" : obj.Board) +
                        ", " +
                        (obj.ClassData == "Everyone"
                          ? "All Classes"
                          : "Class " + obj.ClassData)}
                    </Subheading>
                    <Paragraph>{obj.Description}</Paragraph>
                  </Card.Content>

                  <Card.Actions></Card.Actions>
                </Card>
              ))}
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
            <Appbar.Content title="Notifications" />
          </Appbar.Header>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            style={{ width: 280, height: 280 }}
            source={require("../../../../assets/noNotifications.png")}
          />
          <Text style={{ fontSize: 20, color: "gray" }}>
            No Notifications Yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}
