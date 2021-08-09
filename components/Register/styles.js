import { StyleSheet, Dimensions } from "react-native";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

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
    paddingLeft: 10,
    marginTop: 10,
    flexDirection: "row",
  },
  selectorHeaderContainer: {
    flexDirection: "row",
    width: "33%",
  },
  selectorContentContainer: {
    flexDirection: "row",
    width: "65%",
  },
  selectorContent: {
    justifyContent: "center",
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
    marginBottom: 10,
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
  modalContainer: {
    backgroundColor: "#00000080",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 20,
    width: winWidth * 0.85,
    height: winHeight * 0.65,
  },
  modalHeading: {
    width: winWidth * 0.85,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopEndRadius: 20,
    backgroundColor: "#2cc7a5",
    alignItems: "center",
  },
  modalFooter: {
    width: winWidth * 0.85,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flex: 2,
    flexDirection: "row",
  },
  modalBtn: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
  listItem: {
    width: "92%",
    padding: 8,
    marginTop: 3,
    alignItems: "center",
  },
  listTxt: {
    fontSize: 18,
    color: "white",
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
