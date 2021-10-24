import { StyleSheet, Dimensions } from "react-native";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
  heading: {
    fontSize: 24,
    marginTop: 20,
    marginLeft: 15,
    marginBottom: -80,
    fontWeight: "bold",
  },
  OTPImg: {
    width: winWidth,
    height: winHeight * 0.34,
  },
  textInputContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 4,
  },
});

export default styles;
