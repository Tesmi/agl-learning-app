import React from "react";
import axios from "axios";
const config = require("../../../config");

import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
  Image,
  ToastAndroid,
} from "react-native";
import OTPTextView from "react-native-otp-textinput";

import {
  verifyInputs,
  verifyTeacherKey,
  sendOTP,
} from "./registerHelperMethods";

import { TextInput } from "react-native-paper";
import { styles, TextInputStyle } from "./styles";
import Icon from "react-native-vector-icons/AntDesign";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";

function closeModal() {
  this.setState({
    accountType: "",
    selectBoard: false,
    showModal: false,
    grade: "",
    board: "",
  });
}

function closeOtpModal() {
  this.setState({
    showOTPModal: false,
    registerProcessStarted: false,
  });
}

async function verifyOTP() {
  let userOTP = this.state.userOTP;
  let validOTP = this.state.validOTP;

  if (userOTP == validOTP) {
    ToastAndroid.show(
      "Verification complete, please wait...",
      ToastAndroid.SHORT
    );
    this.setState({ registerProcessStarted: true });

    await axios
      .post(`${config.uri}/public/registerUser`, {
        fullname: this.state.fullname,
        email: this.state.email,
        contact: this.state.contact,
        gender: this.state.gender,
        accountType: this.state.accountType,
        password: this.state.password,
        teacherKey: this.state.teacherKey,
        grade: this.state.grade,
        board: this.state.board,
      })
      .then((e) => {
        if (e.data.status == "success") {
          Alert.alert(
            e.data.status,
            `Registration successfull your username is ${e.data.data.username}`,
            [
              {
                text: "OK",
                onPress: () => afterRegistration(),
              },
            ],
            {
              cancelable: true,
              onDismiss: () => afterRegistration(),
            }
          );
        } else {
          Alert.alert(e.data.status, e.data.msg);
          this.setState({ registerProcessStarted: false });
        }
      })
      .catch((err) => {
        this.setState({ registerProcessStarted: false });
        Alert.alert("error", "Registration failed due network error.");
      });
  } else {
    ToastAndroid.show("Incorrect OTP", ToastAndroid.SHORT);
  }
}

function afterRegistration() {
  //setting state back to dafault
  this.setState({
    fullname: "",
    email: "",
    contact: "",
    gender: "",
    accountType: "",
    grade: "",
    board: "",
    password: "",
    confirmPassword: "",
    teacherKey: "",
    validOTP: "",
    userOTP: "",
    OTPTimer: 45,
    showPassword: false,
    showOTPModal: false,
    resendOTP: false,
    showModal: false,
    selectBoard: false,
    registerProcessStarted: false,
  });
  //navigating to login screen
  this.props.navigation.navigate("Login");
}

function resendOTP() {
  this.otpRef.clear();
  let otp = Math.floor(100000 + Math.random() * 900000);
  this.setState({
    resendOTP: !this.state.resendOTP,
    validOTP: otp,
    userOTP: "",
  });
  sendOTP(this.state.email, this.state.fullname, otp);
  startOTPCountDown();
  ToastAndroid.show("OTP Sent", ToastAndroid.SHORT);
}

function startOTPCountDown() {
  let OTPTimer = setInterval(() => {
    this.setState({ OTPTimer: this.state.OTPTimer - 1 });
    if (this.state.OTPTimer == 0) {
      this.setState({ resendOTP: !this.state.resendOTP });
      this.setState({ OTPTimer: 45 });
      clearInterval(OTPTimer);
    }
  }, 1000);
}

function showNextModal() {
  if (this.state.grade) {
    this.setState({ selectBoard: true });
  } else {
    Alert.alert("Error", "Please select class to proceed.");
  }
}

function exitModal() {
  if (this.state.board) {
    this.setState({ showModal: false, selectBoard: false });
  } else {
    Alert.alert("Error", "Please select board to proceed.");
  }
}

function selectGradeComponent() {
  const standard = [
    { "Sixth Standard": 6 },
    { "Seventh Standard": 7 },
    { "Eighth Standard": 8 },
    { "Ninth Standard": 9 },
    { "Tenth Standard": 10 },
    { "Eleventh Standard": 11 },
    { "Twelth Standard": 12 },
  ];

  const board = [
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

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={this.state.showModal}
      onRequestClose={() => closeModal()}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modal}>
          <View style={styles.modalHeading}>
            <Text
              style={{ fontSize: 22, fontWeight: "bold", color: "#092e26" }}
            >
              {this.state.selectBoard ? "Selct Board" : "Select Class"}
            </Text>
          </View>
          <View style={{ flex: 15 }}>
            <View style={{ flex: 13 }}>
              {this.state.selectBoard ? (
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  {board.map((board, key) => (
                    <TouchableHighlight
                      key={key}
                      activeOpacity={1}
                      underlayColor="#464555"
                      onPress={() => {
                        this.setState({ board });
                      }}
                      style={{
                        ...styles.listItem,
                        backgroundColor:
                          this.state.board == board ? "#464555" : "#93979e",
                      }}
                    >
                      <View>
                        <Text style={styles.listTxt}>{board}</Text>
                      </View>
                    </TouchableHighlight>
                  ))}
                </ScrollView>
              ) : (
                <ScrollView
                  contentContainerStyle={{
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {standard.map((grade, key) => (
                    <TouchableHighlight
                      key={key}
                      activeOpacity={1}
                      underlayColor="#464555"
                      onPress={() => {
                        this.setState({ grade: grade[Object.keys(grade)[0]] });
                      }}
                      style={{
                        ...styles.listItem,
                        backgroundColor:
                          this.state.grade == grade[Object.keys(grade)[0]]
                            ? "#464555"
                            : "#93979e",
                      }}
                    >
                      <View>
                        <Text style={styles.listTxt}>
                          {Object.keys(grade)[0]}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  ))}
                </ScrollView>
              )}
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={{
                  ...styles.modalBtn,
                  borderBottomLeftRadius: 20,
                  backgroundColor: "#2ba15c",
                }}
                onPress={() =>
                  this.state.selectBoard ? exitModal() : showNextModal()
                }
              >
                <Text style={styles.modalBtnTxt}>
                  {this.state.selectBoard ? "Done" : "Next"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => closeModal()}
                style={{
                  ...styles.modalBtn,
                  borderBottomRightRadius: 20,
                  backgroundColor: "#bd6222",
                }}
              >
                <Text style={styles.modalBtnTxt}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function enterOTP() {
  return (
    this.state.showOTPModal && (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.showOTPModal}
        onRequestClose={() => closeOtpModal()}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 10,
            backgroundColor: "#fff",
            justifyContent: "center",
          }}
        >
          <View style={styles.OTPHeadingContainer}>
            <TouchableOpacity
              onPress={() => closeOtpModal()}
              style={{ flex: 1, paddingLeft: 10 }}
            >
              <Icon name="arrowleft" style={styles.OTPBackIcon} />
            </TouchableOpacity>

            <Text style={styles.OTPHeading}>OTP Verification</Text>
            {/* Filler View */}
            <View style={{ flex: 1, paddingRight: 10 }}></View>
          </View>
          <View style={styles.OTPContainer}>
            <Image
              source={require("../../../assets/otp_screen_image.png")}
              style={styles.OTPImg}
              resizeMode="contain"
            />
            <Text style={styles.OTPSubHeading}>
              Please enter the OTP that we've sent to your email
            </Text>
            <Text style={styles.OTPEmail}>{this.state.email}</Text>
            <Text style={styles.OTPTimer}></Text>
            <OTPTextView
              handleTextChange={(e) => {
                this.setState({ userOTP: e });
              }}
              containerStyle={styles.textInputContainer}
              textInputStyle={styles.roundedTextInput}
              inputCount={6}
              inputCellLength={1}
              tintColor="#6d63ff"
              ref={(e) => (this.otpRef = e)}
            />

            {this.state.resendOTP ? null : (
              <View>
                <Text style={styles.OTPResendTxt}>
                  Resend OTP in {this.state.OTPTimer} seconds.
                </Text>
              </View>
            )}
            <View style={styles.OTPFooter}>
              <TouchableOpacity
                onPress={() => verifyOTP()}
                style={{
                  ...styles.OTPBtn,
                  borderColor: "#6D63FF",
                  backgroundColor: "#6D63FF",
                }}
              >
                <Text style={styles.OTPTxt}>Verify</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!this.state.resendOTP}
                onPress={() => resendOTP()}
                style={{
                  ...styles.OTPBtn,
                  borderColor: this.state.resendOTP ? "#d43756" : "#A0A5A3",
                  backgroundColor: this.state.resendOTP ? "#d43756" : "#A0A5A3",
                  marginLeft: "6%",
                }}
              >
                <Text style={styles.OTPTxt}>Resend</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    )
  );
}

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: "",
      email: "",
      contact: "",
      gender: "",
      accountType: "",
      grade: "",
      board: "",
      password: "",
      confirmPassword: "",
      teacherKey: "",
      validOTP: "",
      userOTP: "",
      OTPTimer: 45,
      showPassword: false,
      showOTPModal: false,
      resendOTP: false,
      showModal: false,
      selectBoard: false,
      registerProcessStarted: false,
    };

    this.otpRef = React.createRef();

    selectGradeComponent = selectGradeComponent.bind(this);
    closeModal = closeModal.bind(this);
    showNextModal = showNextModal.bind(this);
    exitModal = exitModal.bind(this);
    enterOTP = enterOTP.bind(this);
    closeOtpModal = closeOtpModal.bind(this);
    verifyOTP = verifyOTP.bind(this);
    resendOTP = resendOTP.bind(this);
    startOTPCountDown = startOTPCountDown.bind(this);
    afterRegistration = afterRegistration.bind(this);
  }

  componentDidMount() {
    this.setState({
      fullname: "tushar maurya",
      email: "tusharmaurya2001@gmail.com",
      contact: "7054122817",
      gender: "male",
      accountType: "teacher",
      grade: "",
      board: "",
      password: "T_M@2001q",
      confirmPassword: "T_M@2001q",
      teacherKey: "h08ZGTbv17mobcn8nkUC",
      validOTP: "",
      userOTP: "",
      OTPTimer: 45,
    });
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

  register = async () => {
    this.setState({ registerProcessStarted: true });

    const verifyInputsResult = verifyInputs(this.state);
    if (verifyInputsResult == true) {
      let otp = Math.floor(100000 + Math.random() * 900000);
      this.setState({ validOTP: otp });
      if (this.state.accountType == "student") {
        //send otp to user
        sendOTP(this.state.email, this.state.fullname, otp);
        //show otp modal
        this.setState({ showOTPModal: true });
        startOTPCountDown();
      } else if (this.state.accountType == "teacher") {
        const isKeyAvailable = await verifyTeacherKey(this.state.teacherKey);
        if (isKeyAvailable == true) {
          //send otp to user
          sendOTP(this.state.email, this.state.fullname, otp);
          //show otp modal
          this.setState({ showOTPModal: true });
          startOTPCountDown();
        } else {
          this.setState({ registerProcessStarted: false });
          Alert.alert("Error", isKeyAvailable);
        }
      } else {
        this.setState({ registerProcessStarted: false });
        Alert.alert("Error", "Account type is invalid");
      }
    } else {
      this.setState({ registerProcessStarted: false });
      Alert.alert("Error", verifyInputsResult);
    }
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
                  value={this.state.fullname}
                  left={this.icon("account-outline")}
                  label="Full Name"
                  theme={TextInputStyle}
                  underlineColorAndroid="transparent"
                  style={{ ...styles.input, backgroundColor: "#242033" }}
                  onChangeText={(fullname) => this.setState({ fullname })}
                />
                <View style={styles.coverInputBorder} />

                <TextInput
                  value={this.state.email}
                  left={this.icon("email-outline")}
                  label="Email"
                  theme={TextInputStyle}
                  underlineColorAndroid="transparent"
                  style={{ ...styles.input, backgroundColor: "#242033" }}
                  onChangeText={(email) => this.setState({ email })}
                />
                <View style={styles.coverInputBorder} />

                <TextInput
                  value={this.state.contact}
                  left={this.icon("cellphone-android")}
                  label="Contact"
                  keyboardType="number-pad"
                  theme={TextInputStyle}
                  underlineColorAndroid="transparent"
                  style={{ ...styles.input, backgroundColor: "#242033" }}
                  onChangeText={(contact) => this.setState({ contact })}
                />
                <View style={styles.coverInputBorder} />
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

                <View style={styles.selectorContainer}>
                  <View style={styles.selectorHeaderContainer}>
                    <Icon2
                      style={{ marginRight: 6 }}
                      size={26}
                      color="#fff"
                      name="gender-male-female"
                    />
                    <Text style={{ fontSize: 17, color: "#918D9B" }}>
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

                <View style={styles.selectorContainer}>
                  <View style={styles.selectorHeaderContainer}>
                    <Icon2
                      style={{ marginRight: 6 }}
                      size={25}
                      color="#fff"
                      name="account-tie-outline"
                    />
                    <Text
                      style={{
                        fontSize: 17,
                        color: "#918D9B",
                      }}
                    >
                      For
                    </Text>
                  </View>
                  <View style={styles.selectorContentContainer}>
                    <TouchableOpacity
                      onPress={() => this.setState({ accountType: "teacher" })}
                      style={{
                        ...styles.selectorContent,
                        backgroundColor:
                          this.state.accountType == "teacher"
                            ? "#e6edea"
                            : "#222232",
                        borderTopLeftRadius: 9,
                        borderBottomLeftRadius: 9,
                      }}
                    >
                      <Text
                        style={{
                          ...styles.selectorTxt,
                          color:
                            this.state.accountType == "teacher"
                              ? "#222232"
                              : "#fff",
                        }}
                      >
                        Teacher
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          accountType: "student",
                          showModal: true,
                        })
                      }
                      style={{
                        ...styles.selectorContent,
                        backgroundColor:
                          this.state.accountType == "student"
                            ? "#e6edea"
                            : "#222232",
                        borderTopEndRadius: 9,
                        borderBottomEndRadius: 9,
                      }}
                    >
                      <Text
                        style={{
                          ...styles.selectorTxt,
                          color:
                            this.state.accountType == "student"
                              ? "#222232"
                              : "#fff",
                        }}
                      >
                        Student
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {selectGradeComponent()}
                {enterOTP()}
                {this.state.accountType == "teacher" ? (
                  <>
                    <TextInput
                      secureTextEntry={this.state.showPassword ? false : true}
                      left={this.icon("account-key-outline")}
                      label="Enter Teacher's Key"
                      value={this.state.teacherKey}
                      theme={TextInputStyle}
                      underlineColorAndroid="transparent"
                      onChangeText={(teacherKey) =>
                        this.setState({ teacherKey })
                      }
                      style={{ ...styles.input, backgroundColor: "#242033" }}
                    />
                    <View style={styles.coverInputBorder} />
                  </>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={() => this.register()}
                style={styles.register}
                disabled={this.state.registerProcessStarted}
              >
                <View>
                  {this.state.registerProcessStarted ? (
                    <ActivityIndicator color="#222232" />
                  ) : (
                    <Text style={styles.registerTxt}>Sign Up</Text>
                  )}
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
