import { iceCandidateFilter, parseCandidate } from "./callerFn";

export type Call = {
  pc1: RTCPeerConnection;
  pc2: RTCPeerConnection;
  type: string;
  establishConnection: () => void;
  gotOffer: (offer: RTCSessionDescriptionInit) => void;
  gotAnswer: (answer: RTCSessionDescriptionInit) => void;
  close: () => void;
};

function createCall(config: RTCConfiguration, type: string) {
  const call: Call = {} as Call;

  call.pc1 = new RTCPeerConnection(config);
  call.pc2 = new RTCPeerConnection(config);
  call.type = type;

  call.pc1.addEventListener(
    "icecandidate",
    (event: RTCPeerConnectionIceEvent) =>
      onIceCandidate(call.pc2, call.type, event)
  );
  call.pc2.addEventListener(
    "icecandidate",
    (event: RTCPeerConnectionIceEvent) =>
      onIceCandidate(call.pc1, call.type, event)
  );

  (call.establishConnection = () => {
    call.pc1.createOffer().then(call.gotOffer);
  }),
    (call.gotOffer = (offer: RTCSessionDescriptionInit) => {
      call.pc1.setLocalDescription(offer);
      call.pc2.setRemoteDescription(offer);
      call.pc2.createAnswer().then(call.gotAnswer);
    }),
    (call.gotAnswer = (answer: RTCSessionDescriptionInit) => {
      call.pc2.setLocalDescription(answer);
      call.pc1.setRemoteDescription(answer);
    }),
    (call.close = () => {
      call.pc1.close();
      call.pc2.close();
    });
  return call;
}

function onIceCandidate(
  otherPeerConnection: RTCPeerConnection,
  type: string,
  event: RTCPeerConnectionIceEvent
) {
  if (event.candidate) {
    let parsed = parseCandidate(event.candidate.candidate);
    if (iceCandidateFilter(parsed, type)) {
      otherPeerConnection.addIceCandidate(event.candidate);
    }
  }
}

export { createCall };
