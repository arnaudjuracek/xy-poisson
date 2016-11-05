const path    = require('path');
const plotter = require('xy-plotter')();
const poisson = require('./poisson');

let margin = 5;
let radius = 6;
let points = poisson(radius, plotter.width - (margin * 2), plotter.height - (margin * 2), 30);

let job = plotter.Job('poisson-linear');
for (let i = 0; i < points.length; i++) {
  let p = points[i];
  if (p) job.circle(margin + p[0], margin + p[1], radius / 3, 9)
}

plotter.Server('xy-server.local').queue(job, () => console.log('queued'));