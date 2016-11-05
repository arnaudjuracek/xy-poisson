'use strict';

/**
 * @see http://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf
 * @param {Number} R [distance between samples]
 * @param {Number} width [width of the domain]
 * @param {Number} height [height of the domain]
 * @param {Number} k [limit of sample candidates]
 */
 function Poisson(R, width, height, k = 30) {

  const size = R / Math.sqrt(2);
  const cols = Math.floor(width / size);
  const rows = Math.floor(height / size);

  let grid = [];
  let active = []; // array of samples indexes

  (function() {
    let x = width / 2;
    let y = height / 2;
    let i = Math.floor(x / size);
    let j = Math.floor(y / size);

    let index = i + j * cols;
    let sample = [x, y];
    active.push(index);
    grid[index] = sample;
  })();

  sampling:
  while (active.length > 0) {
    let index = Math.floor(active.length * Math.random());

    for (let m = 0; m < k; m++) {
      let theta = Math.random() * Math.PI * 2;
      let r = Math.random() * R + R;
      let candidate = [
        grid[active[index]][0] + Math.cos(theta) * r,
        grid[active[index]][1] + Math.sin(theta) * r
      ];

      let col = Math.floor(candidate[0] / size);
      let row = Math.floor(candidate[1] / size);
      candidate:
      if (col > -1 && row > -1 && col < cols && row < rows && !grid[col + row * cols]) {
        let valid = false;
        for (let i = Math.max(col - 2, 0); i <= Math.min(col + 2, width); i++) {
          for (let j = Math.max(row - 2, 0); j <= Math.min(row + 2, height); j++) {
            let neighbor = grid[i + j * cols];
            if (neighbor) {
              let distSq = (candidate[0] - neighbor[0]) * (candidate[0] - neighbor[0]) + (candidate[1] - neighbor[1]) * (candidate[1] - neighbor[1]);
              if (distSq > R * R) valid = true;
              else break candidate;
            }
          }
        }
        if (valid) {
          let index = col + row * cols;
          if (active.indexOf(index) < 0) {
            active.push(index);
            grid[index] = candidate;
            continue sampling;
          }
        }
      }
    }
    active.splice(index, 1);
  }

  return grid;
}

module.exports = Poisson;