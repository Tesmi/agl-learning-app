import React, { Component } from "react";
import { Text, View, Button } from "react-native";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text>Home Screen</Text>
        <Button
          title={"Start stream"}
          onPress={this.props.startStream}
        ></Button>
      </View>
    );
  }
}
