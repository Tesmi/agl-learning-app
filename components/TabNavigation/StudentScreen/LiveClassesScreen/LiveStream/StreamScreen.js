import React from "react";
import JitsiMeet, { JitsiMeetView } from "react-native-jitsi-meet";

export default class StreamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joinRoom: false,
    };
  }

  componentDidMount() {
    const url = "https://jitsi.aglofficial.com/AGL-LEARNING";
    const userInfo = {
      displayName: "User",
      email: "user@example.com",
      avatar: "https:/gravatar.com/avatar/tushar",
      password: "password",
    };
    JitsiMeet.call(url, userInfo);
  }

  onConferenceTerminated(nativeEvent) {
    /* Conference terminated event */
    console.log("Conference terminated event");
    JitsiMeet.endCall();
  }

  onConferenceJoined(nativeEvent) {
    /* Conference joined event */
    console.log("Someone is joined");
  }

  onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
    console.log("Someone will join");
  }

  render() {
    return (
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
    );
  }
}
