import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  Image,
  ScrollView,
  BackHandler,
} from "react-native";
import { Appbar, Button } from "react-native-paper";

import VideoPlayer from "react-native-video-player";

import styles from "./styles";
import axios from "axios";
import config from "../../../../config";

export default class RecVidScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: null,
      vidUrl: null,
    };
  }

  componentDidMount() {
    this.getAllVideos();
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = () => {
    if (this.state.vidUrl != null) {
      this.state.vidUrl = null;
      this.props.showBottomTab();
    }
  };

  async getAllVideos() {
    this.setState({ loading: true });

    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    await axios
      .get(`${config.uri}/api/getAllRecordedVideos_Teacher`, head)
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
    return this.state.vidUrl ? (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          justifyContent: "center",
        }}
      >
        <StatusBar hidden />

        <VideoPlayer
          resizeMode="contain"
          showDuration={true}
          autoplay={true}
          disableControlsAutoHide={true}
          video={{
            uri: this.state.vidUrl,
          }}
          videoHeight={900}
        />
      </View>
    ) : this.state.loading ? (
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
            <Appbar.Content title="Recorded Videos" />
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
            <Appbar.Action
              icon="menu"
              onPress={() => this.props.navigation.openDrawer()}
            />
            <Appbar.Content title="Recorded Videos" />
          </Appbar.Header>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "#f2f5f0" }}
        >
          <View style={{ alignItems: "center" }}>
            <View style={{ ...styles.recordedContainer, marginBottom: 15 }}>
              <Text style={styles.heading}>Archive</Text>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                }}
              >
                {this.state.data.map((obj, key) => (
                  <View style={styles.dataContainer} key={key}>
                    <View style={{ flex: 10, flexDirection: "row" }}>
                      <View style={{ flex: 4, flexDirection: "column" }}>
                        <Image
                          source={require("../../../../assets/vid-icon.png")}
                          style={{ width: 100, height: 100, marginLeft: 20 }}
                        />
                      </View>
                      <View
                        style={{
                          flex: 6,
                          flexDirection: "column",
                          paddingTop: 20,
                        }}
                      >
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                          Lecture Name : {obj.LectureName}
                        </Text>
                        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                          By : {obj.NameOfTeacher}
                        </Text>
                      </View>
                    </View>
                    <Button
                      onPress={() => {
                        this.props.hideBottomTab();
                        this.setState({
                          vidUrl:
                            config.uri +
                            "/public/streamVideo?vidName=" +
                            obj.VideoName,
                        });
                      }}
                      icon="play-circle-outline"
                      color="#218838"
                      style={{
                        marginLeft: 15,
                        marginRight: 15,
                        marginBottom: 15,
                      }}
                      compact={true}
                      mode="contained"
                    >
                      Play Video
                    </Button>
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
            <Appbar.Action
              icon="menu"
              onPress={() => this.props.navigation.openDrawer()}
            />
            <Appbar.Content title="Recorded Videos" />
          </Appbar.Header>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            style={{ width: 280, height: 280 }}
            source={require("../../../../assets/noVideos.png")}
          />
          <Text style={{ fontSize: 20, color: "gray" }}>
            No video is recorded from your class.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}
