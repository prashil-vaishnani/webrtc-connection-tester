<div align="center">
    <h1>📦 webrtc-connection-tester 📦</h1>
    <p>npm package containing a set of custom hooks for your next WebRTC+React project.</p>
</div>
<br />


## 🧰 Installation

### Using npm or yarn 📦

```bash
# Using npm
npm install webrtc-connection-tester

# Using yarn
yarn add webrtc-connection-tester
```

# 📄 Documentation

## 📗 Index

- [useConnectivityTest](#-useConnectivityTest)
- [useDataChannelThroughputTest](#-useDataChannelThroughputTest)
- [useNetworkTest](#-useNetworkTest)
- [useVideoBandwidth](#-useVideoBandwidth)

</br>

## useConnectivityTest
This React custom hook facilitates testing WebRTC connectivity.

### Usage

```JSX
import React from 'react';
import {useConnectivityTest} from 'webrtc-connection-tester';

const MyComponent = () => {
  const { message } = useConnectivityTest('srflx', [
    {
      credential: "your turn server password",
      urls: ['your turn servers urls'],
      username: "your turn servers username",
    },
  ],);

  return (
    <div>
      {message.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  );
};
```
### Props

- type: ('relay' | 'srflx' | 'host') Defines the preferred ICE candidate type.
- iceServers: (RTCIceServer[]) An array of ICE servers for connectivity.

### Return Value

- message: (string[]) An array of messages logging test progress and results.

### Example Output
```
Gathered candidate of Type: host Protocol: udp Address: 192.168.1.100
Gathered candidate of Type: host Protocol: udp Address: 2402:8100:24aa:d2f4:bb3:49bc:3797:c28a
Data successfully transmitted between peers.
Test done:
```


## useDataChannelThroughputTest
This React custom hook measures WebRTC data channel throughput.

### Usage

```JSX
import React from 'react';
import {useDataChannelThroughputTest} from 'webrtc-connection-tester';

const MyComponent = () => {
  const { message } = useDataChannelThroughputTest([
    {
      credential: "your turn server password",
      urls: ['your turn servers urls'],
      username: "your turn servers username",
    },
  ]);

  return (
    <div>
      {message.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  );
};
```
### Props

- iceServers : (RTCIceServer[]) An array of ICE servers for connectivity.

### Return Value

- message: (string[]) An array of messages logging test progress and results.

### Example Output

```
Transmitting at 1234 kbps.
...
Total transmitted: 5678 kilo-bits in 1.23 seconds.
Test done.
```


## useNetworkTest

This React custom hook gathers WebRTC ICE candidates based on a specified protocol.

### Usage

```JSX
import React from 'react';
import {useNetworkTest} from 'webrtc-connection-tester';

const MyComponent = () => {
  const { message } = useNetworkTest('tcp', [
    {
      credential: "your turn server password",
      urls: ['your turn servers urls'],
      username: "your turn servers username",
    },
  ]);

  return (
    <div>
      {message.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
    </div>
  );
};
```
### Props

- protocol: ('tcp' | 'udp') The protocol to filter ICE candidates for.
- iceServers: (RTCIceServer[]) An array of ICE servers for connectivity.

### Return Value

- message: (string[]) An array of messages logging test progress and results.

### Example Output
```
Gathered candidate of Type: host Protocol: tcp Address: 192.168.1.100
Test done.
```

## useVideoBandwidth
This React custom hook measures video bandwidth using WebRTC.

### Usage

```JSX
import React from 'react';
import {useVideoBandwidth} from 'webrtc-connection-tester';

const MyComponent = () => {
  const gatheredStatsReport = useVideoBandwidth([
    {
      credential: "your turn server password",
      urls: ['your turn servers urls'],
      username: "your turn servers username",
    },
  ]);

  // Access and display the gatheredStatsReport data here
  // ...

  return (
    <div>
      {gatheredStatsReport ? (
        <ul>
          <li>Round Trip Time: {gatheredStatsReport.RoundTripTime} sec</li>
          <li>
            Bandwidth Estimate Average:{" "}
            {gatheredStatsReport.bandwidth_estimate_average} kbps
          </li>
          <li>
            Bandwidth Estimate Max: {gatheredStatsReport.bandwidth_estimate_max}{" "}
            kbps
          </li>
          <li>Packets Sent: {gatheredStatsReport.packetsSent}</li>
          <li>Packets Received: {gatheredStatsReport.packetsReceived}</li>
          <li>NACK Count: {gatheredStatsReport.nackCount}</li>
          <li>PLI Count: {gatheredStatsReport.pliCount}</li>
          <li>QP Sum: {gatheredStatsReport.qpSum}</li>
          <li>Frames Encoded: {gatheredStatsReport.framesEncoded}</li>
          <li>Frames Decoded: {gatheredStatsReport.framesDecoded}</li>
        </ul>
      ) : null}
    </div>
  );
};
```
### Props

- iceServers: (RTCIceServer[]) An array of ICE servers for connectivity.

### Return Value

- reportType | null: An object containing video bandwidth statistics if successful, otherwise null.

### Example Output
```
  Round Trip Time: 0.123 sec
  Bandwidth Estimate Average: 1234 kbps
  Bandwidth Estimate Max: 5678 kbps
  Packets Sent: 1024
  Packets Received: 987
  NACK Count: 5
  PLI Count: 2
  QP Sum: 12345
  Frames Encoded: 100
  Frames Decoded: 99

```
## ✍🏻 Creator

[prashil vaishnani](https://www.linkedin.com/in/prashil-vaishnani/)