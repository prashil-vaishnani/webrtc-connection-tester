export function createStatisticsAggregate(rampUpThreshold?: number) {
  const state = {
    startTime: 0,
    sum: 0,
    count: 0,
    max: 0,
    rampUpThreshold: rampUpThreshold ? rampUpThreshold : 0,
    rampUpTime: Infinity,
  };

  function add(time: number, datapoint: number) {
    if (state.startTime === 0) {
      state.startTime = time;
    }
    state.sum += datapoint;
    state.max = Math.max(state.max, datapoint);
    if (state.rampUpTime === Infinity && datapoint > state?.rampUpThreshold) {
      state.rampUpTime = time;
    }
    state.count++;
  }

  function getAverage() {
    if (state.count === 0) {
      return 0;
    }
    return Math.round(state.sum / state.count);
  }

  function getMax() {
    return state.max;
  }

  function getRampUpTime() {
    return Math.round(state.rampUpTime - state.startTime);
  }

  return {
    add,
    getAverage,
    getMax,
    getRampUpTime,
  };
}
