class UniformDistribution {
  constructor() {
    const values = {
      a: +document.querySelector('.a').value,
      b: +document.querySelector('.b').value,
    };
    this.a = values.a;
    this.b = values.b;
    this.name = 'uniform';
  }

  getCumulativeDistribution(randomNumber) {
    return (randomNumber - this.a) / (this.b - this.a);
  }

  getDistribution(randomNumber) {
    return [randomNumber, this.getCumulativeDistribution(randomNumber)];
  }

  getDensity(randomNumber) {
    return [randomNumber, 1 / (this.b - this.a)];
  }

  getM() {
    return (this.a + this.b) / 2;
  }

  getD() {
    return ((this.b - this.a) ** 2) / 12;
  }
}

class ExponentialDistribution {
  constructor() {
    this.lambda = +document.querySelector('.lambda').value;
    this.name = 'exponential';
  }

  getCumulativeDistribution(randomNumber) {
    return 1 - (Math.E ** (-this.lambda * randomNumber));
  }

  getDistribution(randomNumber) {
    return [randomNumber, this.getCumulativeDistribution(randomNumber)];
  }

  getDensity(randomNumber) {
    return [
      randomNumber,
      this.lambda * (Math.E ** (-this.lambda * randomNumber)),
    ];
  }

  getM() {
    return 1 / this.lambda;
  }

  getD() {
    return this.lambda ** -2;
  }
}

function* multipleCongruent(count = 100, m = 2 ** 48, k = 252149039177, begin = 1) {
  let A = begin;
  for (let i = 0; i < count; i += 1) {
    A = (k * A) % m;
    yield A / m;
  }
}

function redrawCharts() {
  [new UniformDistribution(), new ExponentialDistribution()].forEach((distribution) => {
    const histogramData = [...multipleCongruent(10000)]
      .map(randomNumber => distribution.getCumulativeDistribution(randomNumber));
    Plotly.newPlot(`${distribution.name}-histogram`, [{
      x: histogramData,
      type: 'histogram',
    }]);

    const distributionData = [...multipleCongruent(10000)]
      .map(randomNumber => distribution.getDistribution(randomNumber));
    Plotly.newPlot(`${distribution.name}-distribution`, [{
      x: distributionData.map(arr => arr[0]),
      y: distributionData.map(arr => arr[1]),
      type: 'scatter',
      mode: 'markers',
    }]);

    const densityData = [...multipleCongruent(10000)]
      .map(randomNumber => distribution.getDensity(randomNumber));
    Plotly.newPlot(`${distribution.name}-density`, [{
      x: densityData.map(arr => arr[0]),
      y: densityData.map(arr => arr[1]),
      type: 'scatter',
      mode: 'markers',
    }]);

    document.querySelector(`.${distribution.name}-distribution .M`).innerText = distribution.getM();
    document.querySelector(`.${distribution.name}-distribution .D`).innerText = distribution.getD();
  });
}

redrawCharts();

