const getPitchData = window.generatePitchData;

/*
 * Pitch visualization
 * Displays a heatmap of pitch distributions from zones 1 through 13:
 *
 *        10
 *     1  2  3
 * 13  4  5  6  11
 *     7  8  9
 *        12
 *  Zones 10 through 13 are ball zones
 */

(() => {
  const dataset = getPitchData(); // TODO: Swap this out for data returned from service
  const width = 660; // use full width for side length of zones graphic square
  const margin = 5;
  const infoHeight = 50; // height for both title and legend sections
  const gradientHeight = 20;
  const height = width + (infoHeight + margin) + (infoHeight + margin);
  const s = width / 5; // side length of an individual, non-ball zone square

  // use lineupbuilder blue (low) and red (high) colors
  const lowColor = d3.lab('rgba(0, 148, 217, 1)');
  const highColor = d3.lab('rgba(191, 49, 0, 1)');
  const colorInterpolator = d3.interpolateLab(lowColor, highColor);

  // get top left corner x anchor for a zone
  function getZoneX(zoneIndex) {
    if (zoneIndex === 10 || zoneIndex === 12) {
      return s;
    }
    if (zoneIndex === 13) {
      return 0;
    }
    if (zoneIndex === 11) {
      return 4 * s;
    }
    return s + (((zoneIndex - 1) % 3) * s);
  }

  // get top left corner y anchor for a zone
  function getZoneY(zoneIndex) {
    const yOffset = infoHeight + margin;
    if (zoneIndex === 10 || zoneIndex === 11 || zoneIndex === 13) {
      return yOffset;
    }
    if (zoneIndex === 12) {
      return yOffset + (4 * s);
    }
    return yOffset + s + (Math.floor((zoneIndex - 1) / 3) * s);
  }

  function getZoneWidth(zoneIndex) {
    if (zoneIndex === 10 || zoneIndex === 12) {
      return 3 * s;
    }
    return s;
  }

  function getZoneHeight(zoneIndex) {
    if (zoneIndex === 11 || zoneIndex === 13) {
      return 5 * s;
    }
    return s;
  }

  const svg = d3.select('#app')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  const linearGradient = svg.append('defs')
  .append('linearGradient')
  .attr('id', 'linear-gradient');
  linearGradient.attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%');
  linearGradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', lowColor);
  linearGradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', highColor);

  // Add zones colored by pitch totals
  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', (d, i) => getZoneX(i + 1))
    .attr('y', (d, i) => getZoneY(i + 1))
    .attr('width', (d, i) => getZoneWidth(i + 1))
    .attr('height', (d, i) => getZoneHeight(i + 1))
    .style('fill', d => colorInterpolator(d.colorPct))
    .style('stroke', 'rgba(20, 20, 20, 0.1)');

  // Add zone-specific pitch rates
  svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(d => `${(100 * d.pitchRate).toFixed(2)}%`)
    .attr('x', (d, i) => getZoneX(i + 1) + (getZoneWidth(i + 1) / 2))
    .attr('y', (d, i) => getZoneY(i + 1) + (getZoneHeight(i + 1) / 2))
    .attr('font-size', '1.3em')
    .style('fill', 'white')
    .style('text-anchor', 'middle')
    .style('alignment-baseline', 'central');

  // Add pitcher name
  svg.append('text')
    .text('Jon Lester')
    .attr('x', width / 2)
    .attr('y', infoHeight - margin)
    .attr('font-size', '1.8em')
    .attr('font-weight', 300)
    .style('text-anchor', 'middle')
    .style('text-transform', 'uppercase');

  // Add legend
  svg.append('text')
    .text('Low Frequency')
    .attr('x', 0)
    .attr('y', height - margin);
  svg.append('text')
    .text('High Frequency')
    .attr('x', width / 2)
    .attr('y', height - margin)
    .style('text-anchor', 'end');
  svg.append('rect')
    .attr('x', 0)
    .attr('y', height - infoHeight)
    .attr('width', width / 2)
    .attr('height', gradientHeight)
    .style('fill', 'url(#linear-gradient)');


  // Shared text styles
  svg.selectAll('text')
    .attr('font-family', 'Helvetica Neue, Helvetica, Arial, san-serif')
    .attr('font-weight', 300)
    .attr('fill', 'grey');
})();
