import React from "react";
import { BackHandler, Alert } from "react-native";
import JitsiMeet, { JitsiMeetView } from "react-native-jitsi-meet";

export default class StreamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joinRoom: false,
      showJitsi: true,
    };
  }

  backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to end call?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "YES",
        onPress: () => {
          JitsiMeet.endCall();
          this.props.stopStream();
        },
      },
    ]);
    return true;
  };

  async componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );

    const url = this.props.url;
    const userInfo = {
      displayName: this.props.info.username,
      email: this.props.info.email,
      avatar: `https://ipsicon.io/${this.props.info.username}.png`,
    };
    JitsiMeet.call(url, userInfo);
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  onConferenceTerminated(nativeEvent) {
    /* Conference terminated event */
    JitsiMeet.endCall();
    this.props.stopStream();
  }

  onConferenceJoined(nativeEvent) {
    /* Conference joined event */
    this.setState({ showJitsi: false });
    setTimeout(() => {
      this.setState({ showJitsi: true });
    }, 100);
  }

  onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
  }

  render() {
    return (
      this.state.showJitsi && (
        <JitsiMeetView
          onConferenceTerminated={(e) => this.onConferenceTerminated(e)}
          onConferenceJoined={(e) => this.onConferenceJoined(e)}
          onConferenceWillJoin={(e) => this.onConferenceWillJoin(e)}
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
          }}
        />
      )
    );
  }
}
