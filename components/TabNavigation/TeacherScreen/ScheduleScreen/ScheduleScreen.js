import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  ToastAndroid,
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
      lectureName: "",
      board: "Everyone",
      class: "Everyone",
      classData: "Everyone",
      hours: "",
      date: new Date(),
      data: "no_data",
      loading: true,
      selectTime: false,
      showDeleteDialog: false,
      scheduleLoading: false,
      boardExpanded: false,
      classExpanded: false,
      canSchedule: false,
    };
  }

  componentDidMount() {
    this.getAllClassesData();
  }

  resetState(str) {
    this.setState({
      lectureName: "",
      board: "Everyone",
      class: "Everyone",
      classData: "Everyone",
      hours: "",
      date: new Date(),
      loading: false,
      selectTime: false,
      showDeleteDialog: false,
      scheduleLoading: false,
      boardExpanded: false,
      classExpanded: false,
      canSchedule: false,
    });

    if (str == "success") {
      this.setState({ loading: true });
      this.getAllClassesData();
    }
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

  selectTime() {
    this.setState({ selectTime: !this.state.selectTime });
  }

  canSchedule() {
    this.setState({ selectTime: !this.state.selectTime, canSchedule: true });
  }

  scheduleClass() {
    let lectureName = this.state.lectureName;
    let board = this.state.board;
    let classData = this.state.classData;
    let date = this.state.date;
    let hours = this.state.hours;

    this.setState({ scheduleLoading: true });

    try {
      if (!lectureName || !board || !classData || !date || !hours) {
        this.setState({ scheduleLoading: false });
        return ToastAndroid.show("All fields are required", ToastAndroid.SHORT);
      }

      lectureName = lectureName.toString().trim();
      board = board.toString().trim();
      classData = classData.toString().trim();
      date = date.toString().trim();
      hours = hours.toString().trim();

      if (!lectureName || !board || !classData || !date || !hours) {
        this.setState({ scheduleLoading: false });
        return ToastAndroid.show("All fields are required", ToastAndroid.SHORT);
      }

      if (parseFloat(hours) >= 10 || parseFloat(hours) <= 0) {
        this.setState({ scheduleLoading: false });
        return ToastAndroid.show("Invalid hours for class", ToastAndroid.SHORT);
      }

      let head = {
        headers: {
          authorization: `token ${this.props.token}`,
        },
      };

      let data = {
        lectureName,
        board,
        classData,
        date: new Date(date).getTime(),
        endDate: new Date(date).getTime() + parseFloat(hours) * 60 * 60 * 1000,
      };

      axios
        .post(`${config.uri}/api/scheduleClass`, data, head)
        .then((e) => {
          if (e.data.status == "success") {
            this.setState({ scheduleLoading: false });
            ToastAndroid.show(
              "Class scheduled successfully",
              ToastAndroid.SHORT
            );
            return this.resetState("success");
          } else {
            this.setState({ scheduleLoading: false });
            return ToastAndroid.show(
              "Error, can't schedule class right now.",
              ToastAndroid.SHORT
            );
          }
        })
        .catch((err) => {
          this.setState({ scheduleLoading: false });
          return ToastAndroid.show(
            "Error, can't schedule class right now.",
            ToastAndroid.SHORT
          );
        });
    } catch (error) {
      this.setState({ scheduleLoading: false });
      return ToastAndroid.show(
        "Unexpected error, try again later",
        ToastAndroid.SHORT
      );
    }
  }

  async getAllClassesData() {
    this.setState({ loading: true });

    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };
    await axios
      .get(`${config.uri}/api/getAllClassesData`, head)
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

  copyUrl(url) {
    Clipboard.setString(url.toString());
    return ToastAndroid.show("URL Copied", ToastAndroid.SHORT);
  }

  async delete(url) {
    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    this.setState({ loading: true });

    await axios
      .post(`${config.uri}/api/deleteScheduledClass`, { fileUrl: url }, head)
      .then((e) => {
        if (e.data.status == "success") {
          ToastAndroid.show("Deleted", ToastAndroid.SHORT);
          this.resetState("success");
        } else {
          ToastAndroid.show("Error", ToastAndroid.SHORT);
          return this.resetState();
        }
      })
      .catch((err) => {
        ToastAndroid.show("Error", ToastAndroid.SHORT);
        return this.resetState();
      });
  }

  joinStream(url) {
    this.props.changeURL(url);
    this.props.startStream();
  }

  render() {
    const standard = [
      { Everyone: "Everyone" },
      { "Sixth Standard": 6 },
      { "Seventh Standard": 7 },
      { "Eighth Standard": 8 },
      { "Ninth Standard": 9 },
      { "Tenth Standard": 10 },
      { "Eleventh Standard": 11 },
      { "Twelfth Standard": 12 },
      { "Competitive Exams": "Competitive Exams" },
    ];

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

    const comp = [
      "Everyone",
      "DU Entrance",
      "UPSC",
      "SSC",
      "Railway",
      "PCS",
      "State Police",
      "IIT JAM",
      "IIT JEE",
      "ARMY",
      "BANK",
      "SSC GD",
      "NTPC",
      "Others",
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
            <Appbar.Content title="Schedules" />
          </Appbar.Header>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "#f2f5f0" }}
        >
          <View style={{ alignItems: "center" }}>
            <View style={styles.scheduleContainer}>
              <Text style={styles.heading}>Schedule Class</Text>

              <TextInput
                mode="outlined"
                label="Enter Lecture Name"
                value={this.state.lectureName}
                onChangeText={(text) => this.setState({ lectureName: text })}
              />

              <List.Section title="This lecture is for -">
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
              <List.Section>
                <List.Accordion
                  title={this.state.board}
                  left={(props) => <List.Icon {...props} icon="apps-box" />}
                  expanded={this.state.boardExpanded}
                  onPress={() =>
                    this.setState({ boardExpanded: !this.state.boardExpanded })
                  }
                >
                  {this.state.classData == "Competitive Exams" &&
                    comp.map((board, key) => (
                      <List.Item
                        onPress={() => this.setBoard(board)}
                        title={board}
                        key={key}
                      />
                    ))}

                  {this.state.classData != "Competitive Exams" &&
                    board.map((board, key) => (
                      <List.Item
                        onPress={() => this.setBoard(board)}
                        title={board}
                        key={key}
                      />
                    ))}
                </List.Accordion>
              </List.Section>

              {this.state.selectTime ? (
                <View style={styles.giveShadow}>
                  <Text style={styles.DatePickerTxt}>Start Time</Text>
                  <DatePicker
                    date={this.state.date}
                    onDateChange={(e) => this.setState({ date: e })}
                  />
                  <Text style={styles.DatePickerTxt}>For</Text>
                  <View style={{ flex: 1 }}>
                    <TextInput
                      value={this.state.hours}
                      onChangeText={(txt) => {
                        if (!(parseFloat(txt) >= 10)) {
                          this.setState({ hours: txt });
                        }
                      }}
                      mode="outlined"
                      style={{ marginBottom: 10, height: 40 }}
                      placeholder="Hours"
                      keyboardType={"numeric"}
                    />
                  </View>
                </View>
              ) : null}

              <View style={styles.footerBtns}>
                <Button
                  style={{ marginTop: 10 }}
                  icon="clock-time-two"
                  mode="contained"
                  color={this.state.selectTime ? "#218838" : ""}
                  onPress={() =>
                    this.state.selectTime
                      ? this.canSchedule()
                      : this.selectTime()
                  }
                >
                  {this.state.selectTime ? "Done" : "Select Time"}
                </Button>

                <Button
                  style={{ marginTop: 10 }}
                  color={"#036363"}
                  icon="arrow-up-bold-circle"
                  mode="contained"
                  loading={this.state.scheduleLoading}
                  disabled={
                    !this.state.canSchedule || this.state.scheduleLoading
                  }
                  onPress={() => this.scheduleClass()}
                >
                  Schedule
                </Button>
              </View>
            </View>

            <View style={{ ...styles.scheduleContainer, marginBottom: 15 }}>
              <Text style={styles.heading}>Already Scheduled Classes</Text>
              {this.state.data == "no_data" ? (
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text
                    style={{ color: "gray", fontSize: 17, marginBottom: 10 }}
                  >
                    NO CLASS IS SCHEDULED BY YOU
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
                                : "Class: " + obj.ClassData}
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
                              this.delete(obj.URL);
                            }}
                            icon="delete"
                            color="#c82333"
                            style={{ marginBottom: 7 }}
                            compact={true}
                            mode="contained"
                          >
                            Delete
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
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
