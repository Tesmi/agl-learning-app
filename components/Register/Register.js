import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import { TextInput, ToggleButton } from "react-native-paper";
import { styles, TextInputStyle } from "./styles";
import Icon from "react-native-vector-icons/AntDesign";

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: "",
      email: "",
      contact: "",
      gender: "male",
      accountType: "",
      grade: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
    };
  }

  icon = (name) => {
    return (
      <TextInput.Icon
        name={name}
        style={{
          marginTop: 11,
        }}
        size={26}
        color="#fff"
      />
    );
  };

  register = () => {
    console.log(this.state);
  };

  render() {
    const showPasswordIcon = (
      <TextInput.Icon name="lock-outline" size={26} color="#fff" />
    );

    return (
      <SafeAreaView style={styles.contentArea}>
        <View style={{ flex: 10 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <StatusBar animated={true} backgroundColor="#242033" />
            <TouchableOpacity
              style={{ padding: 15 }}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <Icon size={30} color={"#aeabb8"} name="arrowleft"></Icon>
            </TouchableOpacity>
            <View style={styles.headingContainer}>
              <Text style={styles.headingTxt}>Create Account</Text>
            </View>
            <View style={styles.mainContentContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  left={this.icon("account-outline")}
                  label="Full Name"
                  theme={TextInputStyle}
                  underlineColorAndroid="transparent"
                  style={{ ...styles.input, backgroundColor: "#242033" }}
                  onChangeText={(fullname) => this.setState({ fullname })}
                />
                <View style={styles.coverInputBorder} />

                <TextInput
                  left={this.icon("email-outline")}
                  label="Email"
                  theme={TextInputStyle}
                  underlineColorAndroid="transparent"
                  style={{ ...styles.input, backgroundColor: "#242033" }}
                  onChangeText={(email) => this.setState({ email })}
                />
                <View style={styles.coverInputBorder} />

                <TextInput
                  left={this.icon("cellphone-android")}
                  label="Contact"
                  keyboardType="number-pad"
                  theme={TextInputStyle}
                  underlineColorAndroid="transparent"
                  style={{ ...styles.input, backgroundColor: "#242033" }}
                  onChangeText={(contact) => this.setState({ contact })}
                />
                <View style={styles.coverInputBorder} />

                <View style={styles.selectorContainer}>
                  <View style={styles.selectorHeaderContainer}>
                    <Text style={{ fontSize: 19, color: "#918D9B" }}>
                      Gender
                    </Text>
                  </View>
                  <View style={styles.selectorContentContainer}>
                    <TouchableOpacity
                      onPress={() => this.setState({ gender: "male" })}
                      style={{
                        ...styles.selectorContent,
                        backgroundColor:
                          this.state.gender == "male" ? "#e6edea" : "#222232",
                        borderTopLeftRadius: 9,
                        borderBottomLeftRadius: 9,
                      }}
                    >
                      <Text
                        style={{
                          ...styles.selectorTxt,
                          color:
                            this.state.gender == "male" ? "#222232" : "#fff",
                        }}
                      >
                        Male
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.setState({ gender: "female" })}
                      style={{
                        ...styles.selectorContent,
                        backgroundColor:
                          this.state.gender == "female" ? "#e6edea" : "#222232",
                        borderTopEndRadius: 9,
                        borderBottomEndRadius: 9,
                      }}
                    >
                      <Text
                        style={{
                          ...styles.selectorTxt,
                          color:
                            this.state.gender == "female" ? "#222232" : "#fff",
                        }}
                      >
                        Female
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TextInput
                  secureTextEntry={this.state.showPassword ? false : true}
                  left={showPasswordIcon}
                  right={
                    <TextInput.Icon
                      name={
                        this.state.showPassword
                          ? "eye-outline"
                          : "eye-off-outline"
                      }
                      color="#fff"
                      size={25}
                      onPress={() =>
                        this.setState({
                          showPassword: !this.state.showPassword,
                        })
                      }
                    />
                  }
                  label="Password"
                  value={this.state.password}
                  theme={TextInputStyle}
                  underlineColorAndroid="transparent"
                  onChangeText={(password) => this.setState({ password })}
                  style={{ ...styles.input, backgroundColor: "#242033" }}
                />
                <View style={styles.coverInputBorder} />

                <TextInput
                  secureTextEntry={this.state.showPassword ? false : true}
                  left={showPasswordIcon}
                  label="Confirm Password"
                  value={this.state.confirmPassword}
                  theme={TextInputStyle}
                  underlineColorAndroid="transparent"
                  onChangeText={(confirmPassword) =>
                    this.setState({ confirmPassword })
                  }
                  style={{ ...styles.input, backgroundColor: "#242033" }}
                />
                <View style={styles.coverInputBorder} />
              </View>
              <TouchableOpacity
                onPress={() => this.register()}
                style={styles.register}
              >
                <View>
                  <Text style={styles.registerTxt}>Sign Up</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.termsAndServiceNormal}>
                By creating an account you accept our
              </Text>
              <TouchableOpacity>
                <Text style={styles.termsAndServiceBold}>
                  Terms & Conditions
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerTxt1}>Already have an account? </Text>
          <TouchableOpacity>
            <Text
              style={styles.footerTxt2}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
