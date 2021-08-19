import React, { Component } from "react";

import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  Alert,
  StatusBar,
  Image,
  Modal,
} from "react-native";
import {
  Appbar,
  Button,
  Headline,
  Subheading,
  Caption,
  Paragraph,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RNFetchBlob from "rn-fetch-blob";
import styles from "./styles";
import axios from "axios";
import config from "../../../../config";

function DownloadStartedModal() {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={this.state.fileDownloading}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{ ...styles.modalText, fontSize: 19 }}>
            Downloading File
          </Text>
          <ActivityIndicator size={"large"} />
        </View>
      </View>
    </Modal>
  );
}

export default class FilesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      files: null,
      fileDownloading: false,
    };
    DownloadStartedModal = DownloadStartedModal.bind(this);
  }

  componentDidMount() {
    this.getAllFiles();
  }

  async getAllFiles() {
    this.setState({ loading: true });

    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    await axios
      .get(`${config.uri}/api/getAllFilesStudent`, head)
      .then((e) => {
        if (e.data.status == "success") {
          this.setState({ files: e.data.data.files, loading: false });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  }

  async prepareDownload(downloadDir, Filename) {
    this.setState({ fileDownloading: true });
    if (Platform.OS === "ios") {
      this.startDownload(downloadDir, Filename);
    } else {
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "storage title",
            message: "storage_permission",
          }
        ).then((granted) => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //Once user grant the permission start downloading
            this.startDownload(downloadDir, Filename);
          } else {
            this.setState({ fileDownloading: false });
            //If permission denied then show alert 'Storage Permission Not Granted'
            return ToastAndroid.show(
              " Error : Stogare Permission Denied.",
              ToastAndroid.SHORT
            );
          }
        });
      } catch (error) {
        this.setState({ fileDownloading: false });
        return ToastAndroid.show(
          " Error : Stogare Permission Denied.",
          ToastAndroid.SHORT
        );
      }
    }
  }

  async startDownload(downloadDir, Filename) {
    let DocumentDir = RNFetchBlob.fs.dirs.DownloadDir;
    let date = new Date();

    try {
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          //Related to the Android only
          useDownloadManager: true,
          notification: true,
          path:
            DocumentDir +
            "/" +
            Filename +
            "_" +
            Math.floor(date.getTime() + date.getSeconds() / 2) +
            ".pdf",
          description: "Downloading File",
        },
      };

      RNFetchBlob.config(options)
        .fetch(
          "GET",
          config.uri + "/api/DownloadFile?downloadUrl=" + downloadDir,
          {
            authorization: "token " + this.props.token,
          }
        )
        .then((res) => {
          this.setState({ fileDownloading: false });
          return Alert.alert(
            "Success",
            "File downloaded successfully in downloads folder."
          );
        })
        .catch((err) => {
          this.setState({ fileDownloading: false });
          return Alert.alert("Error", "Can't Download File");
        });
    } catch (error) {
      this.setState({ fileDownloading: false });
      return Alert.alert("Error", "Can't Download File");
    }
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
            <Appbar.Content title="Files" />
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
    ) : this.state.files ? (
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
            backgroundColor: "#f2f5f0",
            alignItems: "center",
          }}
        >
          <View style={{ ...styles.FileContainer, marginBottom: 15 }}>
            <Text style={styles.heading}>All Documents</Text>
            <View
              style={{
                flex: 1,
                alignItems: "center",
              }}
            >
              {this.state.files.map((obj, key) => (
                <View key={key} style={styles.filesContainer}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "70%" }}>
                      <Headline
                        style={{
                          marginLeft: 12,
                          marginTop: 10,
                          fontWeight: "bold",
                        }}
                      >
                        {obj.FileName}
                      </Headline>
                      <Paragraph
                        style={{
                          marginLeft: 15,
                        }}
                      >
                        {obj.Description}
                      </Paragraph>

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
                          {obj.ClassName == "Everyone"
                            ? "All Classes"
                            : "Class " + obj.ClassName}
                        </Subheading>
                      </View>

                      <Caption style={{ marginLeft: 15, marginBottom: 10 }}>
                        {new Date(obj.Date).toDateString()}
                      </Caption>

                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Button
                          style={{ marginBottom: 10, width: "90%" }}
                          icon="cloud-download"
                          mode="contained"
                          onPress={() =>
                            this.prepareDownload(obj.DownloadDir, obj.FileName)
                          }
                        >
                          Download
                        </Button>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "30%",
                        backgroundColor: "#dee3e1",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon name="file-pdf" size={80} color="#ad0b00"></Icon>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            {DownloadStartedModal()}
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
            <Appbar.Content title="Files" />
          </Appbar.Header>
        </View>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            style={{ width: 280, height: 280 }}
            source={require("../../../../assets/noFiles.png")}
          />
          <Text style={{ fontSize: 20, color: "gray" }}>
            Files are not listed for you yet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}
