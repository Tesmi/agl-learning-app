import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  ToastAndroid,
  StatusBar,
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

import styles from "./styles";
import axios from "axios";
import config from "../../../../config";

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subject: "",
      board: "Everyone",
      class: "Everyone",
      classData: "Everyone",
      data: "no_data",
      description: "",
      loading: false,
      posting: false,
      boardExpanded: false,
      classExpanded: false,
    };
  }

  componentDidMount() {
    this.getAllNotifications();
  }

  async getAllNotifications() {
    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };
    await axios
      .get(`${config.uri}/api/getAllNotificationsTeacher`, head)
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

  setBoard(board) {
    this.setState({ board, boardExpanded: !this.state.boardExpanded });
  }

  setClass(txt, grade) {
    this.setState({
      class: txt,
      classData: grade,
      classExpanded: !this.state.classExpanded,
    });
  }

  async postNotification() {
    try {
      this.setState({ posting: true });

      let subject = this.state.subject;
      let board = this.state.board;
      let classData = this.state.classData;
      let desc = this.state.description;

      if (!subject || !board || !classData || !desc) {
        ToastAndroid.show("All fields are required", ToastAndroid.SHORT);
        return this.reset();
      }

      subject = subject.toString().trim();
      board = board.toString().trim();
      classData = classData.toString().trim();
      desc = desc.toString().trim();

      if (!subject || !board || !classData || !desc) {
        ToastAndroid.show("All fields are required", ToastAndroid.SHORT);
        return this.reset();
      }

      let head = {
        headers: {
          authorization: `token ${this.props.token}`,
        },
      };

      let data = {
        subject,
        board,
        classData,
        desc,
      };

      axios
        .post(`${config.uri}/api/postNotification`, data, head)
        .then((e) => {
          if (e.data.status == "success") {
            ToastAndroid.show(
              "Notification posted successfully",
              ToastAndroid.SHORT
            );
            return this.reset("success");
          } else {
            ToastAndroid.show(
              "Error, can't post notification right now.",
              ToastAndroid.SHORT
            );
            return this.reset();
          }
        })
        .catch((err) => {
          ToastAndroid.show(
            "Can't post notification, check your internet",
            ToastAndroid.SHORT
          );
          return this.reset();
        });
    } catch (error) {
      ToastAndroid.show(
        "Unexpected error, try again later",
        ToastAndroid.SHORT
      );
      return this.reset();
    }
  }

  async deleteNotification(id) {
    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    this.setState({ loading: true });

    await axios
      .post(`${config.uri}/api/deleteNotifications`, { id }, head)
      .then((e) => {
        if (e.data.status == "success") {
          ToastAndroid.show("Deleted", ToastAndroid.SHORT);
          this.reset("success");
        } else {
          ToastAndroid.show("Error", ToastAndroid.SHORT);
          return this.reset();
        }
      })
      .catch((err) => {
        ToastAndroid.show("Error", ToastAndroid.SHORT);
        return this.reset();
      });
  }

  reset(key) {
    this.setState({
      subject: "",
      board: "Everyone",
      class: "Everyone",
      classData: "Everyone",
      description: "",
      loading: false,
      posting: false,
      boardExpanded: false,
      classExpanded: false,
    });

    if (key == "success") {
      this.setState({ loading: true });
      this.getAllNotifications();
    }
  }

  render() {
    const board = [
      "Everyone",
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

    const standard = [
      { Everyone: "Everyone" },
      { "Sixth Standard": 6 },
      { "Seventh Standard": 7 },
      { "Eighth Standard": 8 },
      { "Ninth Standard": 9 },
      { "Tenth Standard": 10 },
      { "Eleventh Standard": 11 },
      { "Twelfth Standard": 12 },
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
            <Appbar.Content title="Notifications" />
          </Appbar.Header>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "#f2f5f0" }}
        >
          <View style={{ alignItems: "center" }}>
            <View style={styles.notificationContainer}>
              <Text style={styles.heading}>Create Notifications</Text>
              <TextInput
                mode="outlined"
                label="Subject"
                value={this.state.subject}
                onChangeText={(text) => this.setState({ subject: text })}
              />
              <List.Section title="Select Class">
                <List.Accordion
                  title={this.state.class}
                  left={(props) => <List.Icon {...props} icon="school" />}
                  expanded={this.state.classExpanded}
                  onPress={() =>
                    this.setState({ classExpanded: !this.state.classExpanded })
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
              <List.Section title="Select Board">
                <List.Accordion
                  title={this.state.board}
                  left={(props) => <List.Icon {...props} icon="apps-box" />}
                  expanded={this.state.boardExpanded}
                  onPress={() =>
                    this.setState({ boardExpanded: !this.state.boardExpanded })
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
              <TextInput
                placeholder="Enter Message"
                mode="outlined"
                value={this.state.description}
                onChangeText={(text) => this.setState({ description: text })}
                multiline={true}
                numberOfLines={5}
              />

              <View style={styles.footerBtns}>
                <Button
                  style={{ marginTop: 10 }}
                  icon="email-send"
                  mode="contained"
                  loading={this.state.posting}
                  disabled={this.state.posting}
                  color={this.state.selectTime ? "#218838" : ""}
                  onPress={() => this.postNotification()}
                >
                  Post
                </Button>

                <Button
                  style={{ marginTop: 10 }}
                  color={"#036363"}
                  icon="lock-reset"
                  mode="contained"
                  loading={this.state.scheduleLoading}
                  onPress={() => this.reset()}
                >
                  Reset
                </Button>
              </View>
            </View>

            <View style={{ ...styles.notificationContainer, marginBottom: 15 }}>
              <Text style={styles.heading}>Notification By You</Text>
              {this.state.data == "no_data" ? (
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text
                    style={{ color: "gray", fontSize: 17, marginBottom: 10 }}
                  >
                    No Notification is posted by you.
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  {this.state.data.map((obj, key) => (
                    <Card key={key} style={{ width: "95%" }}>
                      <Card.Title title={obj.Subject} />
                      <Card.Content>
                        <Subheading style={{ marginTop: -10 }}>
                          {(obj.Board == "Everyone"
                            ? "All Boards"
                            : obj.Board) +
                            ", " +
                            (obj.ClassData == "Everyone"
                              ? "All Classes"
                              : "Class " + obj.ClassData)}
                        </Subheading>
                        <Paragraph>{obj.Description}</Paragraph>
                      </Card.Content>

                      <Card.Actions>
                        <Button
                          color="#c82333"
                          onPress={() => this.deleteNotification(obj._id)}
                          icon="delete"
                          compact={true}
                          mode="contained"
                        >
                          Delete This Notification
                        </Button>
                      </Card.Actions>
                    </Card>
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
