import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: "white",
    marginTop: 10,
    width: "97%",
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
  footerBtns: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
});

export default styles;
