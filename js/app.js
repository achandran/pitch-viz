const getPitchData = window.generatePitchData;

(() => {
  const dataset = getPitchData();
  const s = 660; // side length of main grid square
  const margin = 5;
  const titleHeight = 50;
  const legendAreaHeight = 90;
  const lowColor = { r: 0, g: 148, b: 217 };
  const highColor = { r: 191, g: 49, b: 0 };

  // calculate coordinates for circle centers
  const getCx = (d, i) => ((2 * (i % 3)) + 1) * (s / 6);
  const getCy = (d, i) => (((2 * Math.floor(i / 3)) + 1) * (s / 6)) + titleHeight;
  // TODO: Experiment with different color interpolation
  const interpolate = (a, b, p) => Math.round(a + (p * p * (b - a)));
  const toRGBA = color => `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
  // use lineup builder colors (red and blue) and interpolate
  const getColor = (d) => {
    const p = d.colorPct;
    const outputColor = {};
    outputColor.r = interpolate(lowColor.r, highColor.r, p);
    outputColor.g = interpolate(lowColor.g, highColor.g, p);
    outputColor.b = interpolate(lowColor.b, highColor.b, p);
    return toRGBA(outputColor);
  };

  const svg = d3.select('#app')
    .append('svg')
    .attr('width', s)
    .attr('height', s + (titleHeight + margin) + (legendAreaHeight + margin));

  // Append a linearGradient element to the defs and give it a unique id
  const linearGradient = svg.append('defs')
    .append('linearGradient')
    .attr('id', 'linear-gradient');

  linearGradient.attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%');

  // Set the color for the start (0%)
  linearGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', toRGBA(lowColor));

  // Set the color for the end (100%)
  linearGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', toRGBA(highColor));

  // Add colored rectangles to display pitch distribution
  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', (d, i) => ((i % 3) * s) / 3)
    .attr('y', (d, i) => titleHeight + ((Math.floor(i / 3) * s) / 3))
    .attr('width', s / 3)
    .attr('height', s / 3)
    .style('fill', getColor)
    .style('stroke', 'rgba(20, 20, 20, 0.1)');

  // Add pitch percentage text
  svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(d => `${(100 * d.pitchRate).toFixed(2)}%`)
    .attr('x', getCx)
    .attr('y', getCy)
    .attr('font-family', 'Helvetica Neue, Helvetica, Arial, san-serif')
    .attr('font-size', '1.3em')
    .attr('font-weight', 300)
    .style('fill', 'white')
    .style('text-anchor', 'middle')
    .style('alignment-baseline', 'central')
    .style('text-transform', 'uppercase');

  // Add pitcher name
  svg.append('text')
    .text('Jon Lester')
    .attr('x', s / 2)
    .attr('y', titleHeight - margin)
    .attr('font-family', 'Helvetica Neue, Helvetica, Arial, san-serif')
    .attr('font-size', '1.8em')
    .attr('font-weight', 300)
    .style('fill', 'grey')
    .style('text-anchor', 'middle')
    .style('text-transform', 'uppercase');

  // Add legend
  svg.append('text')
    .text('Low Frequency')
    .attr('x', 0)
    .attr('y', s + legendAreaHeight);

  svg.append('text')
    .text('High Frequency')
    .attr('x', 300)
    .attr('y', s + legendAreaHeight)
    .style('text-anchor', 'end');


  svg.append('rect')
    .attr('x', 0)
    .attr('y', s + legendAreaHeight + margin)
    .attr('width', 300)
    .attr('height', 20)
    .style('fill', 'url(#linear-gradient)');
})();