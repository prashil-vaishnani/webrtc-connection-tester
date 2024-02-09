// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createStatisticsAggregate } from "./AggregateFn";
import { reportType } from "./type";

export const reportStats = (stats1: RTCStatsReport, stats2: RTCStatsReport) => {
  let gatheredStatsReport: reportType = {
    videoStats: [0, 0],
    nackCount: -1,
    pliCount: -1,
    qpSum: -1,
    packetsSent: -1,
    packetsReceived: -1,
    framesEncoded: -1,
    framesDecoded: -1,
    framesSent: -1,
    bytesSent: -1,
    RoundTripTime: 0,
    bandwidth_estimate_average: 0,
    bandwidth_estimate_max: 0,
  };
  const statsArray = Array.from(stats1.values());
  const statsArray2 = Array.from(stats2.values());

  console.log(statsArray, "aaaarrrayyy", statsArray2);
  const videoStats = statsArray.find(
    (report) => report.type === "inbound-rtp" && report.kind === "video"
  );
  const bweStats = statsArray.find(
    (report) => report.type === "candidate-pair"
  );
  const bweStats2 = statsArray2.find(
    (report) => report.type === "candidate-pair"
  );
  const packetsSent = statsArray.find(
    (report) => report.type === "outbound-rtp" && report.kind === "video"
  );
  const packetsReceived = statsArray2.find(
    (report) => report.type === "inbound-rtp" && report.kind === "video"
  );
  const nackCount = statsArray2.find(
    (report) => report.type === "inbound-rtp" && report.kind === "video"
  );
  const pliCount = statsArray2.find(
    (report) => report.type === "inbound-rtp" && report.kind === "video"
  );
  const qpSum = statsArray2.find(
    (report) => report.type === "inbound-rtp" && report.kind === "video"
  );
  const framesEncoded = statsArray.find(
    (report) => report.type === "outbound-rtp" && report.kind === "video"
  );
  const framesDecoded = statsArray2.find(
    (report) => report.type === "inbound-rtp" && report.kind === "video"
  );

  let userAgentString = navigator.userAgent;

  // Detect Chrome
  let chromeAgent = userAgentString.indexOf("Chrome") > -1;
  // Detect Firefox
  let firefoxAgent = userAgentString.indexOf("Firefox") > -1;
  // Report the statistics
  if (chromeAgent) {
    console.log("chrome");
    if (videoStats) {
      gatheredStatsReport["videoStats"] = [
        videoStats.frameWidth,
        videoStats.frameHeight,
      ];
    }
    if (bweStats || bweStats2) {
      let RoundTripTime = 0;
      RoundTripTime = Math.max(
        bweStats?.totalRoundTripTime,
        bweStats2?.totalRoundTripTime
      );
      gatheredStatsReport.RoundTripTime = RoundTripTime;
      const statisticsAggregate = createStatisticsAggregate(1500000);

      statisticsAggregate.add(
        bweStats.timestamp,
        bweStats?.availableOutgoingBitrate
          ? bweStats.availableOutgoingBitrate
          : 0
      );

      statisticsAggregate.add(
        bweStats2?.timestamp,
        bweStats2?.availableOutgoingBitrate
          ? bweStats2.availableOutgoingBitrate
          : 0
      );
      gatheredStatsReport.bandwidth_estimate_average =
        statisticsAggregate.getAverage() / 1000;
      gatheredStatsReport.bandwidth_estimate_max =
        statisticsAggregate.getMax() / 1000;
      console.log(
        "Send bandwidth estimate average:",
        statisticsAggregate.getAverage() / 1000,
        "kbps"
      );
      console.log(
        "Send bandwidth estimate max:",
        statisticsAggregate.getMax() / 1000,
        "kbps"
      );
      console.log("Send bandwidth ramp-up time:", RoundTripTime, "sec");
    }
    if (packetsSent) {
      console.log("Packets sent:", packetsSent.packetsSent);
      gatheredStatsReport.packetsSent = packetsSent.packetsSent;
    }
    if (packetsReceived) {
      console.log("Packets received:", packetsReceived.packetsReceived);
      gatheredStatsReport.packetsReceived = packetsReceived.packetsReceived;
    }
    if (nackCount) {
      console.log("NACK count:", nackCount.nackCount);
      gatheredStatsReport.nackCount = nackCount.nackCount;
    }
    if (pliCount) {
      console.log("Picture loss indications:", pliCount.pliCount);
      gatheredStatsReport.pliCount = pliCount.pliCount;
    }
    if (qpSum) {
      console.log("Quality predictor sum:", qpSum.qpSum);
      gatheredStatsReport.qpSum = qpSum.qpSum;
    }
    if (framesEncoded) {
      console.log("Frames encoded:", framesEncoded.framesEncoded);
      gatheredStatsReport.framesEncoded = framesEncoded.framesEncoded;
    }
    if (framesDecoded) {
      console.log("Frames decoded:", framesDecoded.framesDecoded);
      gatheredStatsReport.framesDecoded = framesDecoded.framesDecoded;
    }
  } else if (firefoxAgent) {
    console.log("firefox");
    if (videoStats) {
      gatheredStatsReport["videoStats"] = [videoStats.width, videoStats.height];
    }
    if (bweStats || bweStats2) {
      let RoundTripTime = 0;
      RoundTripTime = Math.max(bweStats?.mozRtt, bweStats2?.mozRtt);
      gatheredStatsReport.RoundTripTime = RoundTripTime;
      const statisticsAggregate = createStatisticsAggregate(1500000);

      statisticsAggregate.add(
        bweStats.timestamp,
        bweStats?.mozAvailableOutgoingBitrate
          ? bweStats.mozAvailableOutgoingBitrate
          : 0
      );

      statisticsAggregate.add(
        bweStats2?.timestamp,
        bweStats2?.mozAvailableOutgoingBitrate
          ? bweStats2.mozAvailableOutgoingBitrate
          : 0
      );
      gatheredStatsReport.bandwidth_estimate_average =
        statisticsAggregate.getAverage() / 1000;
      gatheredStatsReport.bandwidth_estimate_max =
        statisticsAggregate.getMax() / 1000;
      console.log(
        "Send bandwidth estimate average:",
        statisticsAggregate.getAverage() / 1000,
        "kbps"
      );
      console.log(
        "Send bandwidth estimate max:",
        statisticsAggregate.getMax() / 1000,
        "kbps"
      );
      console.log("Send bandwidth ramp-up time:", RoundTripTime, "sec");
    }
    if (packetsSent) {
      console.log("Packets sent:", packetsSent.packetsSent);
      gatheredStatsReport.packetsSent = packetsSent.packetsSent;
    }
    if (packetsReceived) {
      console.log("Packets received:", packetsReceived.packetsReceived);
      gatheredStatsReport.packetsReceived = packetsReceived.packetsReceived;
    }
    if (nackCount) {
      console.log("NACK count:", nackCount.nackCount);
      gatheredStatsReport.nackCount = nackCount.nackCount;
    }
    if (pliCount) {
      console.log("Picture loss indications:", pliCount.pliCount);
      gatheredStatsReport.pliCount = pliCount.pliCount;
    }
    if (qpSum) {
      console.log("Quality predictor sum:", qpSum.qpSum);
      gatheredStatsReport.qpSum = qpSum.qpSum;
    }
    if (framesEncoded) {
      console.log("Frames encoded:", framesEncoded.framesEncoded);
      gatheredStatsReport.framesEncoded = framesEncoded.framesEncoded;
    }
    if (framesDecoded) {
      console.log("Frames decoded:", framesDecoded.framesDecoded);
      gatheredStatsReport.framesDecoded = framesDecoded.framesDecoded;
    }
  } else {
    console.log("please open in firefox or chrome");
  }

  return gatheredStatsReport;
};
