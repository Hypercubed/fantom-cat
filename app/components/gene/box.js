import d3 from 'd3';

import d3Tip from 'd3-tip';
import 'd3-tip/examples/example-styles.css!';
import {moveToFront} from './chart.utils';

// Inspired by http://informationandvisualization.de/blog/box-plot
export default function Box () {
  let width = 1;
  let height = 1;
  let duration = 0;
  let domain = null;
  let value = d => Number(d.value);
  let whiskers = boxWhiskers;
  let quartiles = boxQuartiles;
  let tickFormat = d3.format('.2e');
  let color = () => '#ccc';
  const dotColor = '#ccc';

  // For each small multiple…
  function box (g) {
    g.each(function (data, i) {
      const d = data.expression.map(value).sort(d3.ascending);

      const g = d3.select(this);
      const n = d.length;
      const min = d[0];
      const max = d[n - 1];

      const tip = d3Tip()
        .attr('class', 'd3-tip animate-top box')
        .direction('e')
        .offset([0, 10]);

      // Compute quartiles. Must return exactly 3 elements.
      const quartileData = d.quartiles = quartiles(d);

      // Compute whiskers. Must return exactly 2 elements, or null.
      const whiskerIndices = whiskers && whiskers.call(this, d, i);
      const whiskerData = whiskerIndices && whiskerIndices.map(i => d[i]);
      const lowerWhisker = whiskerData[0];
      const upperWhisker = whiskerData[1];

      // Compute outliers. If no whiskers are specified, all data are 'outliers'.
      // We compute the outliers as indices, so that we can join across transitions!
      const outlierIndices = whiskerIndices ?
          d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n)) :
          d3.range(n);

      // Compute the new x-scale.
      const x1 = d3.scale.log()
        // .base(2)
        .domain((domain && domain.call(this, d, i)) || [min, max])
        .range([height, 0]);

      // Compute the tick format.
      const format = tickFormat || x1.tickFormat(8);

      // Retrieve the old x-scale, if this is an update.
      const x0 = this.__chart__ || d3.scale.linear()
          .domain([0, Infinity])
          .range(x1.range());

      // Stash the new scale.
      this.__chart__ = x1;

      g.append('rect')
        .attr('height', height)
        .attr('width', width)
        .style('fill', 'white')
        .style('stroke', 'white')
        .style('opacity', 1e-3);

      const text = g.selectAll('text.center')
          .data(whiskerData ? [whiskerData] : []);

      text.enter().insert('text')
        .attr('text-anchor', 'middle')
        .attr('x', width / 2)
        .attr('y', d => x0(d[1]) - 5)
        .text(data.centerLabel);

      text.transition()
          .duration(duration)
          .style('opacity', 1)
          .attr('y', d => x1(d[1]) - 5);

      text.exit().transition()
        .duration(duration)
        .style('opacity', 1e-6)
        .attr('y', d => x1(d[1]) - 5)
        .remove();

      // Update center line: the vertical line spanning the whiskers.
      const center = g.selectAll('line.center')
          .data(whiskerData ? [whiskerData] : []);

      center.enter().insert('line', 'rect')
          .attr('class', 'center')
          .attr('x1', width / 2)
          .attr('y1', d => x0(d[0]))
          .attr('x2', width / 2)
          .attr('y2', d => x0(d[1]))
          .style('opacity', 1e-6);

      center.transition()
          .duration(duration)
          .style('opacity', 1)
          .attr('y1', d => x1(d[0]))
          .attr('y2', d => x1(d[1]));

      center.exit().transition()
          .duration(duration)
          .style('opacity', 1e-6)
          .attr('y1', d => x1(d[0]))
          .attr('y2', d => x1(d[1]))
          .remove();

      // Update innerquartile box.
      const box = g.selectAll('rect.box')
        .data([quartileData]);

      box.enter().insert('rect', 'text')
        .attr('class', 'box')
        .style('fill', color(data))
        .attr('x', 0)
        .attr('y', d => x0(d[2]))
        .attr('width', width)
        .attr('height', d => x0(d[0]) - x0(d[2]));

      box.transition()
        .duration(duration)
        .attr('y', d => x1(d[2]))
        .attr('height', d => x1(d[0]) - x1(d[2]));

			// Update median line.
      const medianLine = g.selectAll('line.median')
        .data([quartileData[1]]);

      medianLine.enter().append('line')
        .attr('class', 'median')
        .attr('x1', 0)
        .attr('y1', x0)
        .attr('x2', width)
        .attr('y2', x0);

      medianLine.transition()
        .duration(duration)
        .attr('y1', x1)
        .attr('y2', x1);

      tip
        .html(i => {
          if (d[i]) {
            return `Outlier: ${tickFormat(d[i])} CPM`;
          }
          // Top tukey: 1.5 IQR of the upper quartile
          // Bottom tukey: 1.5 IQR of the lower quartile

          let html = `${data.plot_description}
            <hr>
              Top tukey: ${format(whiskerData[1])} CPM
              <br>Third quartile: ${format(quartileData[2])} CPM
              <br>Median: ${format(quartileData[1])} CPM
              <br>First quartile: ${format(quartileData[0])} CPM
              <br>Bottom tukey: ${format(whiskerData[0])} CPM`;

          if (data.differential_expression_values) {
            html += `<hr>fdr: ${format(data.differential_expression_values.fdr)}
                     <br>log2FC: ${format(data.differential_expression_values.log2FC)}`;
          }

          return html;
        });

      g.call(tip);

      setTimeout(() => {  // set initial position, after page finishes rendering
        tip.show({}, medianLine.node());
        tip.hide();
      }, 100);

      g.on('mousemove', mousemoved)
        .on('mouseout', tip.hide);

      // Update outliers.
      const outlier = g.selectAll('.outlier')
          .data(outlierIndices, Number);

      outlier.enter().insert('circle', 'text')
          .attr('class', 'outlier')
            .style('fill', dotColor)
            .attr('r', i => (d[i] < lowerWhisker || d[i] > upperWhisker) ? 3 : 2)
            .attr('x', 0)
            .attr('y', 0)
            .attr('cx', () => ((0.8 * Math.random()) + 0.1) * width)
            .attr('cy', i => x0(d[i]));

      outlier.transition()
        .duration(duration)
        .attr('cy', i => x1(d[i]));

      outlier.exit().transition()
        .duration(duration)
        .attr('cy', i => x1(d[i]))
        .remove();

      // outlier.append('text').text(i => tickFormat(d[i]));

      // outlier.each(tip.show);

      /* if (outlier[0].length > 0) {  // force initial d3-tip position
        console.log(outlier[0][0]);
        var n = outlier[0][0];
        tip.show(n.__data__, n);
        //tip.hide();
      } */

      // outlier.on('mouseover',moveToFront);

      // Update box ticks.
      /* var boxTick = g.selectAll('text.box')
          .data(quartileData);

      boxTick.enter().append('text')
          .attr('class', 'box box-tick')
          .attr('dy', '.3em')
          .attr('dx', function (d, i) { return i & 1 ? 6 : -6; })
          .attr('x', function (d, i) { return i & 1 ? width : 0; })
          .attr('y', x0)
          .attr('text-anchor', function (d, i) { return i & 1 ? 'start' : 'end'; });

      boxTick.transition()
          .duration(duration)
          .text(format)
          .attr('y', x1); */

      // Update whisker ticks. These are handled separately from the box
      // ticks because they may or may not exist, and we want don't want
      // to join box ticks pre-transition with whisker ticks post-.
      /* var whiskerTick = g.selectAll('text.whisker')
          .data(whiskerData || []);

      whiskerTick.enter().append('text')
          .attr('class', 'whisker whisker-tick')
          .attr('dy', '.3em')
          .attr('dx', 6)
          .attr('x', width)
          .attr('y', x0);

      whiskerTick.transition()
          .duration(duration)
          .text(format)
          .attr('y', x1);

      whiskerTick.exit().transition()
          .duration(duration)
          .attr('y', x1)
          .remove(); */

      /* var text = d3.selectAll('text');
      var rect = g.insert('rect', 'text')
          .attr('x', 0)
          .attr('y', fuction() { console.log(this); })
          .attr('width', 10)
          .attr('height', 10)
          .style('fill', 'red'); */

      function mousemoved () {
        const x = d3.mouse(this)[1];
        const node = closestOutlier(x, 20);

        tip.show(node.__data__, node);
        d3.select(node).each(moveToFront);
      }

      function closestOutlier (x, min) {
        let node = null;
        min = min || Infinity;

        outlier.each(function (i) {
          const xx = x1(d[i]);
          const r = Math.abs(xx - x);
          if (r < min) {
            min = r;
            node = this;
          }
        });

        return node || medianLine.node();
      }
    });
  }

  box.width = function (x) {
    if (!arguments.length) {
      return width;
    }
    width = x;
    return box;
  };

  box.height = function (x) {
    if (!arguments.length) {
      return height;
    }
    height = x;
    return box;
  };

  box.tickFormat = function (x) {
    if (!arguments.length) {
      return tickFormat;
    }
    tickFormat = x;
    return box;
  };

  box.duration = function (x) {
    if (!arguments.length) {
      return duration;
    }
    duration = x;
    return box;
  };

  box.domain = function (x) {
    if (!arguments.length) {
      return domain;
    }
    domain = x === null ? x : d3.functor(x);
    return box;
  };

  box.value = function (x) {
    if (!arguments.length) {
      return value;
    }
    value = x;
    return box;
  };

  box.whiskers = function (x) {
    if (!arguments.length) {
      return whiskers;
    }
    whiskers = x;
    return box;
  };

  box.quartiles = function (x) {
    if (!arguments.length) {
      return quartiles;
    }
    quartiles = x;
    return box;
  };

  box.fillColor = function (x) {
    if (!arguments.length) {
      return color;
    }
    color = x;
    return box;
  };

  return box;
}

function boxWhiskers (d) {
  return [0, d.length - 1];
}

function boxQuartiles (d) {
  return [
    d3.quantile(d, 0.25),
    d3.quantile(d, 0.5),
    d3.quantile(d, 0.75)
  ];
}
