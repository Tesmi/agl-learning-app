import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
} from "react-native";

export default function CircularLoader() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated={true} backgroundColor="#5999ab" hidden={false} />
      <ActivityIndicator style={styles.loader} size="large" color="#1c4f4c" />
      <Text style={styles.loadingTxt}>Loading</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#5999ab",
    flex: 1,
    justifyContent: "center",
  },
  loader: {
    zIndex: 2,
    transform: [{ scale: 1.45 }],
  },
  loadingTxt: {
    position: "relative",
    color: "#fefefe",
    alignSelf: "center",
    top: 20,
    fontSize: 18,
    fontFamily: "monospace",
  },
});
