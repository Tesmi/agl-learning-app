import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { Alert } from "react-native";
import PushNotification from "react-native-push-notification";

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    Alert.alert(
      "New Notification: " + notification.title,
      notification.message,
      [{}, { text: "OK", onPress: () => null }]
    );
  },
  senderID: "608362659825",
  popInitialNotification: true,
  requestPermissions: true,
});

AppRegistry.registerComponent(appName, () => App);
