import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  contentArea: {
    flex: 11,
    backgroundColor: "#242033",
  },
  headingContainer: {
    paddingLeft: 20,
  },
  headingTxt: {
    fontSize: 35,
    color: "#E9E7EC",
    fontWeight: "600",
  },
  mainContentContainer: {
    alignItems: "center",
  },
  inputContainer: {
    marginTop: 10,
    width: "90%",
  },
  input: {
    marginTop: 10,
  },
  coverInputBorder: {
    borderTopWidth: 4,
    borderColor: "#242033",
    zIndex: 4,
    marginTop: -2,
  },
  selectorContainer: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 15,
    marginTop: 10,
    flexDirection: "row",
  },
  selectorHeaderContainer: {
    width: "26%",
  },
  selectorContentContainer: {
    flexDirection: "row",
    width: "70%",
  },
  selectorContent: {
    padding: 3,
    width: "50%",
    borderColor: "#e6edea",
    borderWidth: 1,
  },
  selectorTxt: {
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 17,
  },

  register: {
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
  registerTxt: {
    color: "#222232",
    fontWeight: "bold",
    fontSize: 22,
  },
  termsAndServiceNormal: {
    marginTop: 13,
    marginBottom: 3,
    fontSize: 16,
    color: "#E9E7EC",
  },
  termsAndServiceBold: {
    fontSize: 15,
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
