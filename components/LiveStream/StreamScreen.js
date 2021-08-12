import React from "react";
import JitsiMeet, { JitsiMeetView } from "react-native-jitsi-meet";

export default class StreamScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      joinRoom: false,
      showJitsi: true,
    };
  }

  async componentDidMount() {
    const url = "https://jitsi.aglofficial.com/AGL-LEARNING";
    const userInfo = {
      displayName: this.props.info.username,
      email: this.props.info.email,
      avatar: `https://ipsicon.io/${this.props.info.username}.png`,
    };
    JitsiMeet.call(url, userInfo);
  }

  onConferenceTerminated(nativeEvent) {
    /* Conference terminated event */
    console.log("Conference terminated event");
    JitsiMeet.endCall();
    this.props.stopStream();
  }

  onConferenceJoined(nativeEvent) {
    /* Conference joined event */
    this.setState({ showJitsi: false });
    setTimeout(() => {
      this.setState({ showJitsi: true });
    }, 100);
    console.log("Someone is joined");
  }

  onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
    console.log("Someone will join");
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
