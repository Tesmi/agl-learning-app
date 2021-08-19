import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  classesContainer: {
    backgroundColor: "white",
    marginTop: 10,
    width: "100%",
    borderRadius: 6,
    borderWidth: 2.2,
    borderColor: "#036363",
    padding: 10,
  },
  heading: {
    color: "#036363",
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 10,
  },
  dataContainer: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#e0e0e0",
    borderBottomWidth: 0,
    shadowColor: "#e0e0e0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
  },
  imageContainer: {
    borderRadius: 6,
    backgroundColor: "white",
    marginTop: 10,
    flex: 1,
  },
  images: {
    marginTop: 30,
    marginBottom: 30,
    width: 140,
    height: 140,
  },
  centeredContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 24,
  },
  numberTxt: {
    fontSize: 24,
    color: "red",
  },
  socialContainer: {
    borderRadius: 6,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-evenly",
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  socialIcons: {
    width: 55,
    height: 55,
  },
});

export default styles;
