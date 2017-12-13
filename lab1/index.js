function* centerOfSquare(count = 100, initialValue = 1994) {
  let nextValue = initialValue;
  for (let i = 0; i < count; i += 1) {
    nextValue = parseInt((nextValue ** 2).toString().padStart(8, '0').slice(2, 6), 10);
    yield nextValue;
  }
}

function* multipleCongruent(count = 100, m = 73896873, k = 12334584, initialValue = 1) {
  let A = initialValue;
  for (let i = 0; i < count; i += 1) {
    A = (k * A) % m;
    yield A / m;
  }
}

function showSquaresNumbers() {
  const initialValue = parseInt(document.getElementById('square').value, 10);
  const values = [...centerOfSquare(10, initialValue)].join(', ');
  alert(values);
}

function showCongruentNumbers() {
  const initialValue = parseInt(document.getElementById('congA').value, 10);
  const m = parseInt(document.getElementById('congM').value, 10);
  const k = parseInt(document.getElementById('congK').value, 10);
  const values = [...multipleCongruent(10, m, k, initialValue)].join(', ');
  alert(values);
}

function checkIndependence(n = 100, s = 2) {
  const numbers = [...multipleCongruent(n)];
  let sum = 0;
  for (let i = 0; i < n - s; i += 1) {
    sum += numbers[i] * numbers[i + s];
  }
  alert(((12 * sum) / (n - s)) - 3);
}

checkIndependence(100);

Plotly.newPlot('firstChart', [{
  x: [...multipleCongruent()],
  type: 'histogram',
  histnorm: 'probability',
}]);

Plotly.newPlot('secondChart', [{
  x: [...multipleCongruent(10000)],
  type: 'histogram',
  histnorm: 'probability',
}]);
