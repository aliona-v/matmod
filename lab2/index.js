function getCumulativeDistribution({ randomNumber, a, b }) {
  return (randomNumber - a) / (b - a);
}

function getDistribution(obj) {
  return [getCumulativeDistribution(obj), obj.randomNumber];
}

function getDensity(obj) {
  return [getCumulativeDistribution(obj), 1 / (obj.b - obj.a)];
}

function getM({ a, b }) {
  return (a + b) / 2;
}

function getD({ a, b }) {
  return ((b - a) ** 2) / 12;
}

function* multipleCongruent(count = 100, m = 2 ** 48, k = 252149039177, begin = 1) {
  let A = begin;
  for (let i = 0; i < count; i += 1) {
    A = (k * A) % m;
    yield A / m;
  }
}

function redrawCharts() {
  const values = {
    a: +document.querySelector('.a').value,
    b: +document.querySelector('.b').value,
  };

  const histogramData = [...multipleCongruent(10000)]
    .map(randomNumber => getCumulativeDistribution({ randomNumber, ...values }));
  Plotly.newPlot('histogram', [{
    x: histogramData,
    type: 'histogram',
  }]);

  const distributionData = [...multipleCongruent(10000)]
    .map(randomNumber => getDistribution({ randomNumber, ...values }));
  Plotly.newPlot('distribution', [{
    x: distributionData.map(arr => arr[0]),
    y: distributionData.map(arr => arr[1]),
    type: 'scatter',
  }]);

  const densityData = [...multipleCongruent(10000)]
    .map(randomNumber => getDensity({ randomNumber, ...values }));
  Plotly.newPlot('density', [{
    x: densityData.map(arr => arr[0]),
    y: densityData.map(arr => arr[1]),
    type: 'scatter',
  }]);

  document.querySelector('.M').innerText = getM(values);
  document.querySelector('.D').innerText = getD(values);
}

redrawCharts();

