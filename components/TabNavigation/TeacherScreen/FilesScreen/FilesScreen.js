import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  Platform,
  PermissionsAndroid,
  Alert,
  StatusBar,
} from "react-native";
import {
  Appbar,
  TextInput,
  List,
  Button,
  Headline,
  Subheading,
  Caption,
  Paragraph,
} from "react-native-paper";

import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import axios from "axios";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import config from "../../../../config";
import styles from "./styles";

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
            Preparing Download
          </Text>
          <ActivityIndicator size={"large"} />
        </View>
      </View>
    </Modal>
  );
}

function DeleteFileModal() {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={this.state.fileDeleting}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={{ ...styles.modalText, fontSize: 19 }}>
            Deleting File
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
      filename: "",
      board: "Everyone",
      classData: "Everyone",
      description: "",
      class: "Everyone",
      fileURL: "",
      fileType: "",
      fileName: "",
      allfiles: "no_data",
      loading: true,
      canUpload: false,
      boardExpanded: false,
      classExpanded: false,
      uploading: false,
      fileDownloading: false,
      fileDeleting: false,
    };

    DownloadStartedModal = DownloadStartedModal.bind(this);
    DeleteFileModal = DeleteFileModal.bind(this);
  }

  componentDidMount() {
    this.getAllFiles();
  }

  setBoard(board) {
    this.setState({ board, boardExpanded: !this.state.boardExpanded });
  }

  resetState(str) {
    this.setState({
      loading: false,
      canUpload: false,
      filename: "",
      board: "Everyone",
      classData: "Everyone",
      description: "",
      class: "Everyone",
      fileURL: "",
      fileType: "",
      boardExpanded: false,
      classExpanded: false,
      uploading: false,
    });

    if (str == "success") {
      this.setState({ loading: true });
      this.getAllFiles();
    }
  }

  setClass(txt, grade) {
    this.setState({
      class: txt,
      classData: grade,
      classExpanded: !this.state.classExpanded,
    });
  }

  async getAllFiles() {
    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    await axios
      .get(`${config.uri}/api/getAllFilesTeacher`, head)
      .then((e) => {
        if (e.data.status == "success") {
          this.setState({ allfiles: e.data.data.document, loading: false });
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  }

  async uploadFile() {
    try {
      let filename = this.state.filename;
      let board = this.state.board;
      let classData = this.state.classData;
      let fileType = this.state.fileType;
      let fileURL = this.state.fileURL;
      let description = this.state.description;

      if (
        !filename ||
        !board ||
        !classData ||
        !description ||
        !fileType ||
        !fileURL
      ) {
        this.resetState();
        return ToastAndroid.show(
          "Error : All fields are required.",
          ToastAndroid.SHORT
        );
      }

      filename = filename.toString().trim();
      board = board.toString().trim();
      classData = classData.toString().trim();
      description = description.toString().trim();
      fileType = fileType.toString().trim();
      fileURL = fileURL.toString().trim();

      if (
        filename == "" ||
        board == "" ||
        classData == "" ||
        description == "" ||
        fileType == "" ||
        fileURL == ""
      ) {
        this.resetState();
        return ToastAndroid.show(
          "Error : All fields are required.",
          ToastAndroid.SHORT
        );
      }

      const data = new FormData();
      data.append("name", filename);
      data.append("board", board);
      data.append("classname", classData);
      data.append("description", description);
      data.append("fileData", {
        uri: fileURL,
        type: fileType,
        name: filename,
      });

      const configuration = {
        method: "POST",
        headers: {
          withCredentials: true,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          authorization: `token ${this.props.token}`,
        },
        body: data,
      };

      this.setState({ uploading: true });

      fetch(config.uri + "/api/uploadFile", configuration)
        .then((callbackdata) => callbackdata.json())
        .then((data) => {
          if (data.status == "success") {
            ToastAndroid.show("File uploaded successfully", ToastAndroid.SHORT);
            return this.resetState("success");
          } else {
            ToastAndroid.show(
              "Something went wrong, try again later",
              ToastAndroid.SHORT
            );
            return this.resetState();
          }
        });
    } catch (error) {
      this.resetState();
      return ToastAndroid.show(
        "Something went wrong, try again later",
        ToastAndroid.SHORT
      );
    }
  }

  async selectFile() {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.pdf],
      });
      if (!res.uri || !res.type || !res.name || !res.size) {
        return ToastAndroid.show("Invalid file", ToastAndroid.SHORT);
      }

      this.setState({
        canUpload: true,
        fileURL: res.uri,
        fileType: res.type,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        return ToastAndroid.show("No file selected", ToastAndroid.SHORT);
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        this.resetState();
        return ToastAndroid.show("Error: can't read files", ToastAndroid.SHORT);
      }
    }
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

  async deleteFile(downloadDir) {
    this.setState({ fileDeleting: true });

    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };

    let data = { file: downloadDir };

    axios
      .post(`${config.uri}/api/deleteFile`, data, head)
      .then((e) => {
        if (e.data.status == "success") {
          this.setState({ fileDeleting: false });
          ToastAndroid.show("File Deleted", ToastAndroid.SHORT);
          return this.resetState("success");
        } else {
          this.setState({ fileDeleting: false });
          ToastAndroid.show("Error in deleting file", ToastAndroid.SHORT);
          return this.resetState();
        }
      })
      .catch((err) => {
        ToastAndroid.show("Error in deleting file", ToastAndroid.SHORT);
        return this.resetState();
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
      { "Twelth Standard": 12 },
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
    ) : (
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
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, backgroundColor: "#f2f5f0" }}
        >
          <View style={{ alignItems: "center" }}>
            <View style={styles.uploadFileContainer}>
              <Text style={styles.heading}>Upload Document</Text>
              <TextInput
                mode="outlined"
                label="Document Name"
                value={this.state.filename}
                onChangeText={(text) => this.setState({ filename: text })}
              />

              <List.Section title="Select Board of Student">
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

              <List.Section title="Select Class of Student">
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
                placeholder="Description of file"
                mode="outlined"
                value={this.state.description}
                onChangeText={(text) => this.setState({ description: text })}
                multiline={true}
                numberOfLines={3}
              />

              <View style={styles.footerBtns}>
                <Button
                  style={{ marginTop: 10 }}
                  icon="folder"
                  mode="contained"
                  onPress={() => this.selectFile()}
                >
                  Select File
                </Button>

                <Button
                  style={{ marginTop: 10 }}
                  color={"#036363"}
                  icon="cloud-upload"
                  mode="contained"
                  loading={this.state.uploading}
                  disabled={!this.state.canUpload || this.state.uploading}
                  onPress={() => this.uploadFile()}
                >
                  Upload
                </Button>
              </View>
            </View>

            <View style={{ ...styles.uploadFileContainer, marginBottom: 15 }}>
              <Text style={styles.heading}>All Documents</Text>

              {this.state.allfiles == "no_data" ? (
                <View style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ color: "gray", fontSize: 17 }}>
                    NO FILES FOUND
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  {this.state.allfiles.map((obj, key) => (
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
                              {obj.Board == "Everyone"
                                ? "All Boards"
                                : obj.Board}
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
                              style={{ marginBottom: 7 }}
                              compact={true}
                              icon="cloud-download"
                              mode="contained"
                              onPress={() =>
                                this.prepareDownload(
                                  obj.DownloadDir,
                                  obj.FileName
                                )
                              }
                            >
                              Download
                            </Button>
                            <Button
                              style={{ marginBottom: 7 }}
                              color="#c82333"
                              compact={true}
                              icon="delete"
                              mode="contained"
                              onPress={() => this.deleteFile(obj.DownloadDir)}
                            >
                              Delete
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
                          <Icon
                            name="file-pdf"
                            size={80}
                            color="#ad0b00"
                          ></Icon>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
            {DownloadStartedModal()}
            {DeleteFileModal()}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
