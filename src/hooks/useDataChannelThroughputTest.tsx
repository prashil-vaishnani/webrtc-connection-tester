import { useEffect, useRef, useState } from "react";
import { Call, createCall } from "../utils/createCall";

const useDataChannelThroughputTest = (iceServers: RTCIceServer[]) => {
  const startTimeRef = useRef<Date | null>(null);
  const sentPayloadBytesRef = useRef<number>(0);
  const receivedPayloadBytesRef = useRef<number>(0);
  const stopSendingRef = useRef<boolean>(false);
  const samplePacketRef = useRef<string>("");
  const maxNumberOfPacketsToSend = 1;
  const bytesToKeepBuffered = 1024 * maxNumberOfPacketsToSend;
  const lastBitrateMeasureTimeRef = useRef<Date | null>(null);
  const lastReceivedPayloadBytes = useRef<number>(0);
  let call: Call | null;
  let senderChannel: RTCDataChannel;
  let receiveChannel: RTCDataChannel | null = null;

  const [message, setMessage] = useState<string[]>([]);

  useEffect(() => {
    const start = (config: RTCConfiguration) => {
      call = createCall(config, "relay");
      senderChannel = call.pc1.createDataChannel("ch2");
      senderChannel.addEventListener("open", sendingStep);

      call.pc2.addEventListener("datachannel", onReceiverChannel);

      call.establishConnection();
    };

    const onReceiverChannel = (event: { channel: RTCDataChannel }) => {
      receiveChannel = event.channel;
      receiveChannel.addEventListener("message", onMessageReceived);
    };

    const sendingStep = () => {
      const now = new Date();
      if (!startTimeRef.current) {
        startTimeRef.current = now;
        lastBitrateMeasureTimeRef.current = now;
      }

      for (let i = 0; i !== maxNumberOfPacketsToSend; ++i) {
        if (senderChannel.bufferedAmount >= bytesToKeepBuffered) {
          break;
        }
        sentPayloadBytesRef.current += samplePacketRef.current.length;
        senderChannel.send(samplePacketRef.current);
      }

      if (
        now.getTime() -
          (startTimeRef.current ? startTimeRef.current.getTime() : 0) >=
        1000 * 5
      ) {
        stopSendingRef.current = true;
      } else {
        setTimeout(sendingStep, 1);
      }
    };

    const onMessageReceived = (event: { data: string | ArrayBuffer }) => {
      receivedPayloadBytesRef.current += event.data.toString().length;
      const now = new Date();
      if (
        now.getTime() -
          (lastBitrateMeasureTimeRef.current
            ? lastBitrateMeasureTimeRef.current.getTime()
            : 0) >=
        1000
      ) {
        const bitrate =
          (receivedPayloadBytesRef.current - lastReceivedPayloadBytes.current) /
          (now.getTime() - lastBitrateMeasureTimeRef.current!.getTime());
        const roundedBitrate = Math.round(bitrate * 1000 * 8) / 1000;
        setMessage((prevMessage) => [
          ...prevMessage,
          `Transmitting at ${roundedBitrate} kbps.`,
        ]);
        lastReceivedPayloadBytes.current = receivedPayloadBytesRef.current;
        lastBitrateMeasureTimeRef.current = now;
      }
      if (
        stopSendingRef.current &&
        sentPayloadBytesRef.current === receivedPayloadBytesRef.current
      ) {
        call?.close();
        call = null;

        const elapsedTime =
          Math.round((now.getTime() - startTimeRef.current!.getTime()) * 10) /
          10000.0;
        const receivedKBits = (receivedPayloadBytesRef.current * 8) / 1000;
        setMessage((prevMessage) => [
          ...prevMessage,
          `Total transmitted: ${receivedKBits} kilo-bits in ${elapsedTime} seconds.`,
        ]);
        setMessage((prevMessage) => [...prevMessage, "Test done:"]);
      }
    };

    // Initialize samplePacket
    for (let i = 0; i !== 1024; ++i) {
      samplePacketRef.current += "h";
    }
    const turnConfig: RTCConfiguration = {
      iceServers,
    };
    start(turnConfig);

    return () => {};
  }, []);

  return { message };
};

export default useDataChannelThroughputTest;
