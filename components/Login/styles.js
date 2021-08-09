import { StyleSheet, Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  image: {
    width: 0.7 * windowWidth,
    height: 0.65 * windowWidth,
  },
  hr: {
    borderBottomWidth: 1,
    marginTop: 5,
    width: "89%",
    borderColor: "#5f5a73",
  },
  headerTxt: {
    fontFamily: "BoldKei-nRAWP",
    fontSize: 28,
    marginRight: "65%",
    marginTop: 25,
    color: "#fcfcfc",
  },
  secondaryTxt: {
    color: "#617B8F",
    fontSize: 15,
    marginLeft: -2,
  },
  inputContainer: {
    width: "90%",
    marginTop: 10,
  },
  input: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  coverInputBorder: {
    borderTopWidth: 4,
    borderColor: "#242033",
    zIndex: 4,
    marginTop: -2,
  },
  loginBtn: {
    marginTop: 30,
    width: "50%",
    alignItems: "center",
    borderColor: "#00DFC0",
    borderRadius: 26,
    backgroundColor: "#00DFC0",
    paddingTop: 13,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
  },
  loginBtnTxt: {
    color: "#222232",
    fontWeight: "bold",
    fontSize: 22,
  },
  forgetPassword: {
    marginTop: 7,
    marginBottom: 10,
    color: "#00DFC0",
    fontWeight: "bold",
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#242033",
    justifyContent: "center",
    alignItems: "center",
  },
  footerTxt1: {
    color: "#fff",
    fontSize: 18,
  },
  footerTxt2: {
    fontWeight: "bold",
    color: "#00DFC0",
    fontSize: 16,
  },
});

const TextInputStyle = {
  colors: {
    text: "#fcfcfc",
    primary: "#9f9da8",
    placeholder: "#9f9da8",
  },
};

module.exports = { TextInputStyle, styles };
