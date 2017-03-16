// return a random integer between min and max inclusive
function getRandomInt(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

function genPitchZone(minPitchCount, maxPitchCount) {
  const numPitches = getRandomInt(minPitchCount, maxPitchCount);
  const successRate = getRandomInt(0, 100) / 100.0;
  return { numPitches, successRate };
}

window.generatePitchData = () => {
  const numZones = 9;
  const arr = [];
  const normalizedPitches = [];
  let totalPitches = 0;
  let maxPitches = 0;

  for (let i = 0; i < numZones; i += 1) {
    const pitchZone = genPitchZone(25, 50);
    if (pitchZone.numPitches > maxPitches) {
      maxPitches = pitchZone.numPitches;
    }
    totalPitches += pitchZone.numPitches;
    arr.push(pitchZone);
  }
  for (let j = 0; j < arr.length; j += 1) {
    normalizedPitches.push(
      {
        pitchRate: arr[j].numPitches / totalPitches,
        colorPct: arr[j].numPitches / maxPitches,
        successRate: arr[j].successRate,
      },
    );
  }
  return normalizedPitches;
};
