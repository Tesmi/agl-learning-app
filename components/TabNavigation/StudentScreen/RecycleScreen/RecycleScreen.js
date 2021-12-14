import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  BackHandler,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";

import { Appbar } from "react-native-paper";
import styles from "./styles";
import axios from "axios";
import config from "../../../../config";

export default class RecycleScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { loading: false, data: null };
  }

  componentDidMount() {
    this.getAllData();
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

  async getAllData() {
    this.setState({ loading: true });

    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    await axios
      .get(`${config.uri}/api/getAllRecycleDataStudent`, head)
      .then((e) => {
        if (e.data.status == "success") {
          this.setState({ data: e.data.data.recycle, loading: false });
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
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: "#dcdee3",
            alignItems: "center",
          }}
        >
          <View style={{ ...styles.RecycleContainer, marginBottom: 15 }}>
            <Text style={styles.heading}>Contents</Text>
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
                </View>
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
          <Image
            style={{ width: 280, height: 280 }}
            source={require("../../../../assets/noVideos.png")}
          />
          <Text style={{ fontSize: 20, color: "gray" }}>
            No Recycle Content Yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}
