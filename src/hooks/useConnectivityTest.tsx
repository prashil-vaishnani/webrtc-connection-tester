import { useEffect, useRef, useState } from "react";
import {
  parseCandidate,
  iceCandidateFilter,
  isReflexive,
} from "../utils/callerFn";
import { createCall, type Call } from "../utils/createCall";

interface parsedCandidatesType {
  type: string;
  protocol: string;
  address: string;
}

const useConnectivityTest = (type: string, iceServers: RTCIceServer[]) => {
  const [parsedCandidates, setParsedCandidates] = useState<
    parsedCandidatesType[]
  >([]);
  let Call: Call;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [message, setMessage] = useState<string[]>([]);

  const start = (config: RTCConfiguration) => {
    Call = createCall(config, type);
    Call?.pc1.addEventListener(
      "icecandidate",
      (event: RTCPeerConnectionIceEvent) => {
        if (event.candidate) {
          const parsedCandidate = parseCandidate(event.candidate.candidate);
          setParsedCandidates((prevCandidates) => [
            ...prevCandidates,
            parsedCandidate,
          ]);

          if (iceCandidateFilter(parsedCandidate, type)) {
            setMessage((prevMessage) => [
              ...prevMessage,
              `Gathered candidate of Type: ${parsedCandidate.type} Protocol: ${parsedCandidate.protocol} Address: ${parsedCandidate.address}`,
            ]);
          }
        }
      }
    );

    if (Call) {
      const ch1 = Call.pc1.createDataChannel("ch1");
      ch1.addEventListener("open", () => {
        ch1.send("hello");
      });
      ch1.addEventListener("message", (event: { data: string }) => {
        if (event.data !== "world") {
          setMessage((prevMessage) => [
            ...prevMessage,
            "Invalid data transmitted.",
          ]);
        } else {
          setMessage((prevMessage) => [
            ...prevMessage,
            "Data successfully transmitted between peers.",
          ]);
        }
        hangup("");
      });

      Call.pc2.addEventListener("datachannel", (event: { channel: any }) => {
        const ch2 = event.channel;
        ch2.addEventListener("message", (event: { data: string }) => {
          if (event.data !== "hello") {
            hangup("Invalid data transmitted.");
          } else {
            ch2.send("world");
          }
        });
      });

      Call.establishConnection();
      timeoutRef.current = setTimeout(() => hangup("Timed out"), 5000);
    }
  };

  const findParsedCandidateOfSpecifiedType = (
    candidateTypeMethod: (candidate: { type: string }) => boolean
  ) => {
    for (const candidate of parsedCandidates) {
      if (candidateTypeMethod(candidate)) {
        return candidateTypeMethod(candidate);
      }
    }
  };

  const hangup = (errorMessage: string) => {
    if (errorMessage) {
      if (
        errorMessage === "Timed out" &&
        iceCandidateFilter.toString() === isReflexive.toString() &&
        findParsedCandidateOfSpecifiedType(isReflexive)
      ) {
        setMessage((prevMessage) => [
          ...prevMessage,
          "Could not connect using reflexive candidates, likely due to the network environment/configuration.",
        ]);
      } else {
        setMessage((prevMessage) => [...prevMessage, `Error: ${errorMessage}`]);
      }
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    Call?.close();
    setMessage((prevMessage) => [...prevMessage, "Test done:"]);
  };

  useEffect(() => {
    const turnConfig: RTCConfiguration = {
      iceServers,
    };
    start(turnConfig);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { message };
};

export default useConnectivityTest;
