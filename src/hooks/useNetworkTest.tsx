import { useEffect, useState } from "react";
import { iceCandidateFilter, parseCandidate } from "../utils/callerFn";

const useNetworkTest = (
  protocol: "tcp" | "udp",
  iceServers: RTCIceServer[]
) => {
  const [message, setMessage] = useState<string[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const result = start();
        console.log("two", result);
      } catch (error) {
        setMessage((prevState) => [...prevState, ...["Error: " + error]]);
      }
    };

    const start = () => {
      let turnConfig = {
        iceServers,
      };
      filterConfig(turnConfig, protocol);
      gatherCandidates(turnConfig);
      return;
    };

    const filterConfig = (config: any, protocol: string) => {
      const transport = "transport=" + protocol;
      const newIceServers = [];
      for (let i = 0; i < config.iceServers?.length; ++i) {
        const iceServer = config.iceServers[i];
        const newUrls = [];
        for (let j = 0; j < iceServer.urls.length; ++j) {
          const uri = iceServer.urls[j];
          if (uri.indexOf(transport) !== -1) {
            newUrls.push(uri);
          } else if (
            uri.indexOf("?transport=") === -1 &&
            uri.startsWith("turn")
          ) {
            newUrls.push(uri + "?" + transport);
          }
        }
        if (newUrls.length !== 0) {
          iceServer.urls = newUrls;
          newIceServers.push(iceServer);
        }
      }
      config.iceServers = newIceServers;
    };

    const gatherCandidates = (config: RTCConfiguration) => {
      let pc: RTCPeerConnection | null;
      try {
        pc = new RTCPeerConnection(config);
      } catch (error) {
        setMessage((prevState) => [
          ...prevState,
          ...["Failed to create peer connection: " + error],
        ]);
        setMessage((prevState) => [...prevState, ...["Test done: "]]);
        return;
      }

      pc.addEventListener("icecandidate", (e: RTCPeerConnectionIceEvent) => {
        const pcEvent = e.target as RTCPeerConnection;

        if (pcEvent && pcEvent.signalingState === "closed") {
          return;
        }

        if (e.candidate) {
          const parsed = parseCandidate(e.candidate.candidate);
          if (iceCandidateFilter(parsed, "host")) {
            setMessage((prevState) => [
              ...prevState,
              ...[
                "Gathered candidate of Type: " +
                  parsed.type +
                  " Protocol: " +
                  parsed.protocol +
                  " Address: " +
                  parsed.address,
              ],
            ]);

            if (pc) pc.close();
            pc = null;
            setMessage((prevState) => [...prevState, ...["Test done: "]]);
          }
        } else {
          if (pc) pc.close();
          pc = null;

          setMessage((prevState) => [
            ...prevState,
            ...["Failed to gather specified candidates"],
          ]);
          setMessage((prevState) => [...prevState, ...["Test done: "]]);
        }
      });

      createAudioOnlyReceiveOffer(pc);
    };

    const createAudioOnlyReceiveOffer = (pc: any) => {
      const createOfferParams = { offerToReceiveAudio: 1 };
      pc.createOffer(createOfferParams).then((offer: any) => {
        pc.setLocalDescription(offer).then(noop, noop);
      }, noop);
      function noop() {}
    };

    run();

    return () => {};
  }, []);
  return { message };
};

export default useNetworkTest;
