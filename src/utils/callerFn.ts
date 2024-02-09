export const iceCandidateFilter = (
  candidate: { type: string },
  type: string
) => {
  return candidate.type === type;
};

export const parseCandidate = (text: string) => {
  const candidateStr = "candidate:";
  const pos = text.indexOf(candidateStr) + candidateStr.length;
  const fields = text.substring(pos).split(" ");
  return {
    type: fields[7],
    protocol: fields[2],
    address: fields[4],
  };
};

export const isReflexive = (candidate: { type: string }) => {
  return candidate.type === "srflx";
};

export const isRelay = (candidate: { type: string }) => {
  return candidate.type === "relay";
};

export const isHost = (candidate: { type: string }) => {
  return candidate.type === "host";
};
