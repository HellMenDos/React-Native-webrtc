import * as React from 'react';
import { Text, View } from 'react-native';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals
} from 'react-native-webrtc';

class CallScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {streamDevice: ''}
  } 

  componentDidMount() {
    let isFront = true;
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            mandatory: {
              minWidth: 500,
              minHeight: 300,
              minFrameRate: 60,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then((stream) => {
        
          /*
            WebSocket Section to send video stream to backend
          */
          this.setState({streamDevice:stream.toURL()})
          
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  render() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <RTCView streamURL={this.state.streamDevice} style={{width: 200, height: 300}} />
        <RTCView streamURL={this.state.streamDevice} style={{width: 200, height: 300}} />
    </View>
  );
}
}
