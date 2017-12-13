const matrixContainer = document.querySelector('.matrix tbody');

function getXYCounts() {
  return {
    xCount: parseInt(document.querySelector('label:first-child input').value, 10),
    yCount: parseInt(document.querySelector('label:nth-child(2) input').value, 10),
  };
}

function computeMatX(values) {
  let result = 0;
  for (let i = 0; i < values.x.length; i += 1) {
    for (let j = 0; j < values.y.length; j += 1) {
      result += values.x[i] * values.P[i][j];
    }
  }
  return result;
}
function computeMatY(values) {
  let result = 0;
  for (let i = 0; i < values.x.length; i += 1) {
    for (let j = 0; j < values.y.length; j += 1) {
      result += values.y[j] * values.P[i][j];
    }
  }
  return result;
}

function computeDispX(values) {
  let result = 0;
  for (let i = 0; i < values.x.length; i += 1) {
    for (let j = 0; j < values.y.length; j += 1) {
      result += (values.x[i] ** 2) * values.P[i][j];
    }
  }
  return result - (computeMatX(values) ** 2);
}
function computeDispY(values) {
  let result = 0;
  for (let i = 0; i < values.x.length; i += 1) {
    for (let j = 0; j < values.y.length; j += 1) {
      result += (values.y[j] ** 2) * values.P[i][j];
    }
  }
  return result - (computeMatY(values) ** 2);
}

function computeKorrX(values) {
  return Math.sqrt(computeDispX(values));
}

function computeKorrY(values) {
  return Math.sqrt(computeDispY(values));
}

function computeCorrKoef(values) {
  let result = -computeMatX(values) * computeMatY(values);
  for (let i = 0; i < values.x.length; i += 1) {
    for (let j = 0; j < values.y.length; j += 1) {
      result += values.x[i] * values.y[j] * values.P[i][j];
    }
  }
  return result / (computeKorrX(values) * computeKorrY(values));
}

function computeFy(values) {
  const result = new Array(values.y.length).fill(0);
  for (let i = 0; i < values.y.length; i += 1) {
    for (let j = 0; j < values.x.length; j += 1) {
      result[i] += values.P[j][i];
    }
  }
  return result.map((value, index) => result.slice(0, index + 1).reduce((a, b) => a + b));
}

function computeFx(values) {
  const result = new Array(values.x.length).fill(0);
  for (let i = 0; i < values.x.length; i += 1) {
    for (let j = 0; j < values.y.length; j += 1) {
      result[i] += values.P[i][j];
    }
  }
  return result.map((value, index) => result.slice(0, index + 1).reduce((a, b) => a + b));
}

function rollX(series, values) {
  const x = [];
  const fx = computeFx(values);
  series.forEach((randomX) => {
    const randomXIndex = fx.findIndex(value => value >= randomX);
    x.push(values.x[randomXIndex]);
  });
  return {
    x: values.x,
    y: values.x.map(value => x.filter(anotherValue => anotherValue === value).length),
  };
}

function rollY(series, values) {
  const y = [];
  const fy = computeFy(values);
  series.forEach((randomY) => {
    const randomYIndex = fy.findIndex(value => value >= randomY);
    y.push(values.y[randomYIndex]);
  });
  return {
    x: values.y,
    y: values.y.map(value => y.filter(anotherValue => anotherValue === value).length),
  };
}

function rollXY(series, values) {
  const y = new Array(values.x.length * values.y.length).fill(0);
  const fx = computeFx(values);
  const fy = computeFy(values);
  for (let i = 0; i < series.length - 1; i += 2) {
    const [randomX, randomY] = series.slice(i, i + 2);
    const randomXIndex = fx.findIndex(value => randomX <= value);
    const randomYIndex = fy.findIndex(value => randomY <= value);

    y[(randomXIndex * values.x.length) + randomYIndex] += 1;
  }
  const x = [];
  values.x.forEach((xValue) => {
    values.y.forEach((yValue) => {
      x.push(`x: ${xValue}, y: ${yValue}`);
    });
  });
  return {
    x,
    y,
  };
}

function rebuildMatrix() {
  matrixContainer.innerHTML = '';
  const { xCount, yCount } = getXYCounts();
  let body = '';
  for (let i = 0; i < xCount + 1; i += 1) {
    let row = '';
    for (let j = 0; j < yCount + 1; j += 1) {
      if (j !== 0 || i !== 0) {
        row += `<td><input type="number" value="${j === 0 || i === 0 ? Math.trunc(100 * Math.random()) : Math.random()}"></td>`;
      } else {
        row += '<td>X / Y</td>';
      }
    }
    body += `<tr>${row}</tr>`;
  }
  matrixContainer.insertAdjacentHTML('afterbegin', body);
}

function getValues() {
  const { xCount, yCount } = getXYCounts();
  const resultObj = {
    y: Array.from(matrixContainer.querySelectorAll('tr:first-child input')).map(e => parseFloat(e.value)),
    x: Array.from(matrixContainer.querySelectorAll('td:first-child input')).map(e => parseFloat(e.value)),
    P: [],
  };

  const values = Array.from(matrixContainer.querySelectorAll('tr:not(:first-child) > td:not(:first-child) input')).map(e => parseFloat(e.value));
  const normal = values.reduce((a, b) => a + b);
  for (let i = 0; i < xCount; i += 1) {
    resultObj.P[i] = [];
    for (let j = 0; j < yCount; j += 1) {
      resultObj.P[i][j] = values[(yCount * i) + j] / normal;
    }
  }

  return resultObj;
}

function compute() {
  const values = getValues();

  const [matX, matY] = [document.querySelector('.mat span:first-child'), document.querySelector('.mat span:last-child')];
  matX.innerText = computeMatX(values);
  matY.innerText = computeMatY(values);

  const [dispX, dispY] = [document.querySelector('.disp span:first-child'), document.querySelector('.disp span:last-child')];
  dispX.innerText = computeDispX(values);
  dispY.innerText = computeDispY(values);

  document.querySelector('.korr span').innerText = computeCorrKoef(values);

  const seriesCount = parseInt(document.querySelector('.seriesLength').value, 10);
  const series = new Array(seriesCount).fill(0).map(() => Math.random());
  Plotly.newPlot('x', [{
    ...rollX(series, values),
    type: 'bar',
  }], {
    title: 'Распределение составляющей X',
  });
  Plotly.newPlot('y', [{
    ...rollY(series, values),
    type: 'bar',
  }], {
    title: 'Распределение составляющей Y',
  });
  Plotly.newPlot('xy', [{
    ...rollXY(series, values),
    type: 'bar',
  }], {
    title: 'Распределение составляющей XY',
  });
}

rebuildMatrix();
