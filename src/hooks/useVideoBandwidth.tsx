import { useEffect, useState } from "react";
import { Call, createCall } from "../utils/createCall";
import { reportStats } from "../utils/reportStats";
import { reportType } from "../utils/type";

const useVideoBandwidth = (iceServers: RTCIceServer[]) => {
  const [gatheredStatsReport, setGatheredStatsReport] =
    useState<reportType | null>(null);
  let Call: Call;
  let localStream: MediaStream;
  let intervalId: string | number | NodeJS.Timeout | undefined;
  let response1: RTCStatsReport, response2: RTCStatsReport;

  const start = async (config: RTCConfiguration) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      localStream = stream;

      const videoTracks = localStream.getVideoTracks();
      const audioTracks = localStream.getAudioTracks();
      if (videoTracks.length > 0) {
        console.log(`Using video device: ${videoTracks[0].label}`);
      }
      if (audioTracks.length > 0) {
        console.log(`Using audio device: ${audioTracks[0].label}`);
      }
      Call = createCall(config, "relay");
      Call.pc2.addEventListener("track", gotRemoteStream);
      localStream
        .getTracks()
        .forEach((track) => Call.pc1.addTrack(track, localStream));

      Call.establishConnection();
      checker(Call.pc1, Call.pc2);
    } catch (e) {
      console.log(`getUserMedia() error:`, e);
    }
  };
  const gotRemoteStream = () => {
    console.log("pc2 received remote stream");
  };

  function checker(pc1: RTCPeerConnection, pc2: RTCPeerConnection) {
    intervalId = setInterval(() => {
      pc1.getStats().then((stats) => {
        response1 = stats;
      });
      pc2.getStats().then((stats) => {
        response2 = stats;
      });
    }, 1000);
  }

  const stopInterval = () => {
    clearInterval(intervalId);
    const updatedStatsReport = reportStats(response1, response2);
    setGatheredStatsReport(updatedStatsReport);
    Call.pc1.getSenders().forEach(function (sender) {
      const track = sender.track;
      if (track) {
        track.stop();
      }
    });
    Call.close();
  };

  useEffect(() => {
    const turnConfig: RTCConfiguration = {
      iceServers,
    };
    start(turnConfig);
    setTimeout(() => {
      stopInterval();
    }, 5000);
  }, []);

  return gatheredStatsReport;
};
export default useVideoBandwidth;
