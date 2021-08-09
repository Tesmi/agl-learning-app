import React from "react";
import { NavigationContainer } from "@react-navigation/native";

//Importing components
import { navigationRef } from "./components/TabNavigation/TabNavRef";
import StudentRootNav from "./components/TabNavigation/StudentRootNav";
import MainStackNav from "./components/StackNavigation/MainStackNav";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: "null",
    };
  }

  render() {
    return (
      <NavigationContainer ref={navigationRef}>
        {this.state.token !== null ? <StudentRootNav /> : <MainStackNav />}
      </NavigationContainer>
    );
  }
}
