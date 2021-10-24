import React, { Component } from "react";
import { View, StyleSheet, ToastAndroid } from "react-native";
import { Avatar, Title, Caption, Paragraph, Drawer } from "react-native-paper";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import config from "../../../config";
import axios from "axios";

export default class DrawerContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggingOut: false,
      teachers: 0,
      students: 0,
      username: "user",
      fullname: "Undefined",
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    let head = {
      headers: {
        authorization: `token ${this.props.token}`,
      },
    };
    await axios
      .get(`${config.uri}/api/drawerData`, head)
      .then((e) => {
        if (e.data.status == "success") {
          let data = e.data.data.drawerData;

          this.setState({
            teachers: data.teachers,
            students: data.students,
            username: data.username,
            fullname: data.fullname,
          });
        }
      })
      .catch((err) => {
        return ToastAndroid.show(
          "Error : Cannot connect to server!",
          ToastAndroid.SHORT
        );
      });
  }

  async logout() {
    if (this.state.loggingOut) return;
    this.setState({ loggingOut: true });
    let refreshToken = null;
    //get the refresh token
    try {
      refreshToken = await AsyncStorage.getItem("REFRESH_TOKEN");
      return refreshToken != null ? JSON.parse(refreshToken) : null;
    } catch (e) {
      // read error
    }

    //post request to the server to delete token
    await axios
      .get(`${config.uri}/public/logout`, { params: { token: refreshToken } })
      .then((e) => {
        //delete the refresh token in async storage
      })
      .catch((err) => null);

    try {
      await AsyncStorage.removeItem("REFRESH_TOKEN");
      //remove access token from state of app.js
      this.props.removeAccessToken();
    } catch (e) {
      // remove error
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...this.props}>
          <View style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: "row", marginTop: 15 }}>
                <Avatar.Image
                  style={{ marginTop: 8 }}
                  source={require("../../../assets/user.png")}
                  size={50}
                />
                <View
                  style={{
                    marginLeft: 15,
                    flexDirection: "column",
                    width: "74%",
                  }}
                >
                  <Title style={styles.title}>{this.state.fullname}</Title>
                  <Caption style={styles.caption}>
                    @{this.state.username}
                  </Caption>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.section}>
                  <Paragraph style={[styles.paragraph, styles.caption]}>
                    {this.state.teachers}
                  </Paragraph>
                  <Caption style={styles.caption}>Teachers</Caption>
                </View>
                <View style={styles.section}>
                  <Paragraph style={[styles.paragraph, styles.caption]}>
                    {this.state.students}
                  </Paragraph>
                  <Caption style={styles.caption}>Students</Caption>
                </View>
              </View>
            </View>

            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon name="account-cog-outline" color={color} size={size} />
                )}
                label="Settings"
                onPress={() => {
                  this.props.navigation.navigate("settingsScreen");
                }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="account-check-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Support"
                onPress={() => {
                  this.props.navigation.navigate("supportScreen");
                }}
              />
            </Drawer.Section>
          </View>
        </DrawerContentScrollView>
        <Drawer.Section style={styles.bottomDrawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Icon name="exit-to-app" color={color} size={size} />
            )}
            label="Sign Out"
            onPress={() => {
              this.logout();
            }}
          />
        </Drawer.Section>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
