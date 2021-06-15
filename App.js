import React from "react";
import { Text, View } from "react-native";

//Importing components
import CircularLoader from "./components/Loader/CircularLoader";
import SplashScreen from "./components/SplashScreen/SplashScreen";

export default class App extends React.Component {
  render() {
    return <SplashScreen />;
  }
}
