import React from "react";
import {
  View,
  SafeAreaView,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { TextInput } from "react-native-paper";
import { styles, TextInputStyle } from "./styles";

export default function Login(props) {
  let [username, setUserName] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [showPassword, setShowPassword] = React.useState(false);

  const LoginImage = require("../../assets/3094352.png");
  const emailIcon = (
    <TextInput.Icon
      name="email-outline"
      style={{ marginTop: 12 }}
      size={25}
      color="#fff"
    />
  );
  const showPasswordIcon = (
    <TextInput.Icon name="lock-outline" size={25} color="#fff" />
  );

  return (
    <SafeAreaView style={{ flex: 11, backgroundColor: "#242033" }}>
      <View style={{ flex: 10 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <StatusBar animated={true} backgroundColor="#242033" />
          <Image source={LoginImage} style={styles.image} />
          <View style={styles.hr} />
          <View style={styles.headerTxtContainer}>
            <Text style={styles.headerTxt}>Login</Text>
            <Text style={styles.secondaryTxt}>Please sign in to continue.</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              left={emailIcon}
              label="Email"
              value={username}
              theme={TextInputStyle}
              underlineColorAndroid="transparent"
              onChangeText={(username) => setUserName(username)}
              style={{ ...styles.input, backgroundColor: "#242033" }}
            />
            <View style={styles.coverInputBorder} />

            <TextInput
              secureTextEntry={showPassword ? false : true}
              left={showPasswordIcon}
              right={
                <TextInput.Icon
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  color="#fff"
                  size={25}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              label="Password"
              value={password}
              theme={TextInputStyle}
              underlineColorAndroid="transparent"
              onChangeText={(password) => setPassword(password)}
              style={{ ...styles.input, backgroundColor: "#242033" }}
            />
            <View style={styles.coverInputBorder} />
          </View>
          <TouchableOpacity style={styles.loginBtn}>
            <View>
              <Text style={styles.loginBtnTxt}>Login</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgetPassword}>Forget Password?</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerTxt1}>Don't have an account? </Text>
        <TouchableOpacity>
          <Text
            style={styles.footerTxt2}
            onPress={() => props.navigation.navigate("Register")}
          >
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
