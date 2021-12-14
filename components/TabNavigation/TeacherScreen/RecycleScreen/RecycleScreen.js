import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  StatusBar,
  Dimensions,
  BackHandler,
} from "react-native";
import { Appbar, TextInput, List, Button } from "react-native-paper";

import YoutubePlayer from "react-native-youtube-iframe";

import axios from "axios";
import styles from "./styles";
import config from "../../../../config";

export default class RecycleScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      description: "",
      video_url: "",
      board: "Everyone",
      classData: "Everyone",
      class: "Everyone",
      data: "no_data",
      uploadingData: false,
      deletingData: false,
      boardExpanded: false,
      classExpanded: false,
    };
  }

  componentDidMount() {
    this.getData();
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

  setClass(txt, grade) {
    this.setState({
      class: txt,
      classData: grade,
      classExpanded: !this.state.classExpanded,
    });
  }

  setBoard(board) {
    this.setState({ board, boardExpanded: !this.state.boardExpanded });
  }

  resetState() {
    this.setState({
      loading: false,
      description: "",
      video_url: "",
      board: "Everyone",
      classData: "Everyone",
      class: "Everyone",
      uploadingData: false,
      deletingData: false,
      boardExpanded: false,
      classExpanded: false,
    });
  }

  async deleteContent(id) {
    this.setState({ deletingData: true });

    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
      params: { id },
    };

    await axios
      .get(`${config.uri}/api/deleteRecycleData`, head)
      .then((e) => {
        if (e.data.status == "success") {
          this.resetState();
          this.getData();
        } else {
          this.resetState();
          return ToastAndroid.show(
            "Error : Unable to delete content.",
            ToastAndroid.SHORT
          );
        }
      })
      .catch((err) => {
        this.resetState();
        return ToastAndroid.show(
          "Error : Unable to delete content.",
          ToastAndroid.SHORT
        );
      });
  }

  async getData() {
    this.setState({ loading: true });

    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    await axios
      .get(`${config.uri}/api/getAllRecycleData`, head)
      .then((e) => {
        if (e.data.status == "success") {
          this.setState({ data: e.data.data.documents, loading: false });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  }

  async postContent() {
    this.setState({ uploadingData: true });
    let description = this.state.description;
    let videoUrl = this.state.video_url;

    if (!description || !videoUrl) {
      this.setState({ uploadingData: false });
      return ToastAndroid.show(
        "Error : All fields are required.",
        ToastAndroid.SHORT
      );
    }

    description = description.trim().toString();
    videoUrl = videoUrl.trim().toString();
    let classData = this.state.classData;
    let board = this.state.board;

    if (!description || !videoUrl) {
      this.setState({ uploadingData: false });
      return ToastAndroid.show(
        "Error : All fields are required.",
        ToastAndroid.SHORT
      );
    }

    const VID_REGEX =
      /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    try {
      videoUrl = videoUrl.match(VID_REGEX)
        ? videoUrl.match(VID_REGEX)[1]
        : null;
    } catch (error) {
      videoUrl = null;
    }

    if (!videoUrl) {
      this.setState({ uploadingData: false });
      return ToastAndroid.show(
        "Error : Video URL is incorrect.",
        ToastAndroid.SHORT
      );
    }

    let dataToBePosted = {
      description,
      videoUrl,
      classData,
      board,
    };

    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    await axios
      .post(`${config.uri}/api/uploadRecycleContent`, dataToBePosted, head)
      .then((e) => {
        if (e.data.status == "success") {
          this.resetState();
          this.getData();
        } else {
          this.setState({ uploadingData: false });
          return ToastAndroid.show(
            "Error : Unable to post content, try again later.",
            ToastAndroid.SHORT
          );
        }
      })
      .catch((err) => {
        this.setState({ uploadingData: false });
        return ToastAndroid.show(
          "Error : Unable to post content, try again later.",
          ToastAndroid.SHORT
        );
      });
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
            <Appbar.Content title="Recycle" />
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
            <Appbar.Content title="Recycle" />
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
            <View style={styles.mainContainer}>
              <Text style={styles.heading}>Post Content</Text>
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

              <TextInput
                placeholder="Description"
                mode="outlined"
                value={this.state.description}
                onChangeText={(text) => this.setState({ description: text })}
                multiline={true}
                numberOfLines={4}
              />

              <TextInput
                mode="outlined"
                label="Youtube Video URL"
                value={this.state.video_url}
                onChangeText={(text) => this.setState({ video_url: text })}
              />

              <Button
                loading={this.state.uploadingData}
                disabled={this.state.uploadingData}
                style={{ marginTop: 10 }}
                mode="contained"
                onPress={() => this.postContent()}
              >
                Post
              </Button>
            </View>

            <View style={{ ...styles.mainContainer, marginBottom: 15 }}>
              <Text style={styles.heading}>Your Posts</Text>

              {this.state.data == "no_data" ? (
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ color: "gray", fontSize: 17 }}>
                    YOU HAVEN'T POSTED ANYTHING
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    marginTop: -15,
                  }}
                >
                  {this.state.data.map((obj, key) => (
                    <View key={key} style={{ marginTop: 15 }}>
                      <Text
                        style={{
                          width: 0.9 * Dimensions.get("window").width,
                          backgroundColor: "#9cada9",
                          fontWeight: "bold",
                        }}
                      >
                        {obj.Description}
                      </Text>
                      <YoutubePlayer
                        height={0.51 * Dimensions.get("window").width}
                        width={0.9 * Dimensions.get("window").width}
                        play={false}
                        videoId={obj.VideoUrl}
                      />
                      <Button
                        onPress={() => this.deleteContent(obj._id)}
                        loading={this.state.deletingData}
                        disabled={this.state.deletingData}
                        style={{ backgroundColor: "#dc3545" }}
                        icon="trash-can"
                        mode="contained"
                        marginTop={8}
                        marginBottom={10}
                      >
                        Delete
                      </Button>
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
