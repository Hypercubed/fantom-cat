import d3 from 'd3';
// import d3plusText from 'd3plus-text';
import d3Legend from 'd3-svg-legend/no-extend';

import './area-chart.less!';

import d3Tip from 'd3-tip';
import 'd3-tip/examples/example-styles.css!';

export default function AreaChart (opts) {
  opts = opts || {};

  const barHeight = 20;
  const margin = opts.margin || {top: 20, right: 20, bottom: 30, left: 40};
  let width = opts.width ? opts.width - margin.left - margin.right : null;
  const height = (opts.height || 500) - margin.top - margin.bottom - barHeight;
  let title = opts.title || null;
  let limit = opts.limit || 20;
  // var brush = opts.brush || false;
  let ontology = null;

  const yTickFormat = d3.format('.1e');
  const titleFormat = d3.format('.2e');
  // var xTickFormat = d3.format('%');

  const xValue = opts.xValue || (d => d.rank); // data -> value
  const xScale = d3.scale.linear().range([0, width]); // value -> display
  const xMap = (d, i) => xScale(xValue(d, i)); // data -> display
  const xAxis = d3.svg.axis().scale(xScale).orient('bottom'); // .tickFormat(function(d) { return xTickFormat(d/600); }); //.tickSize([3,3]); //.tickFormat(function() { return ''; });

  const yValue = opts.yValue || (d => d.value); // data -> value
  const yScale = d3.scale.linear().range([height, 0]); // value -> display
  const yMap = (d, i) => yScale(yValue(d, i)); // data -> display
  const yAxis = d3.svg.axis().scale(yScale).orient('left').tickFormat(yTickFormat);

  const area = d3.svg.area()
    .x(xMap)
    .y0(height)
    .y1(yMap);

  function rnd10 (x) {
    return Math.round(x / 10) * 10;
  }

  const brush = bars.brush = d3.svg.brush()
    .x(xScale)
    .on('brush.snap', function () {
      const extent0 = brush.extent();
      let extent1;

      // if dragging, preserve the width of the extent
      if (d3.event.mode === 'move') {
        const d0 = rnd10(extent0[0]);
        const d1 = d0 + rnd10((extent0[1] - extent0[0]));
        extent1 = [d0, d1];
      } else {
        extent1 = extent0.map(rnd10);
        // if (extent1[0] >= extent1[1]) {
        //  extent1[1] = extent1[0]+10;
        // }
      }

      d3.select(this).call(brush.extent(extent1));
    });

  const tip = d3Tip()
    .attr('class', 'd3-tip animate text-center bg-info')
    .offset([-10, 0])
    .html(d => `<p>${d.sample_name}</p><span style='color: #b0c4de'>${titleFormat(d.rle_cpm)} CPM</span>`);

  function bars (selection) {
    selection.each(function (d) {
      if (width === null) {
        width = selection[0][0].clientWidth - margin.left - margin.right;
        xScale.range([0, width]);
      }

      d3.select(this).selectAll('svg').remove(); // improve this, use transitions

      const svg = d3.select(this).append('svg')
        .attr('title', title)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + barHeight)
        .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

      svg.call(tip);

      // xAxis.tickFormat(function(_) { return xTickFormat(_/d.length); });
      xScale.domain(d3.extent(d, xValue));
      yScale.domain(d3.extent(d, yValue));

      // brush.extent([0,limit]);

      if (title) {
        svg.append('g')
        .attr('class', 'title')
        .attr('transform', `translate(${width / 2},0)`)
        .append('text')
          .attr('text-anchor', 'middle')
          .attr('class', 'title')
          .text(title);
      }

      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height + 10 + barHeight})`)
        .call(xAxis)
        .append('text')
          .attr('transform', 'rotate(0)')
          .attr('x', width / 2)
          .attr('dy', 30)
          .style('text-anchor', 'middle')
          .text('Sample Rank');

      svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(-5,0)')
        .call(yAxis)
        .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', -50)
          .attr('x', -height / 2)
          .style('text-anchor', 'middle')
          .text('Expression CPM');

      svg.append('path')
        .datum(d)
        .attr('class', 'area')
        .attr('d', area);

      const bar = svg.append('g')
        .attr('transform', `translate(0,${height + 5})`);

      bar.append('rect')
        .attr('class', 'bar')
        .attr('width', width)
        .attr('height', barHeight)
        .on('mousemove', mousemoved)
        .on('mouseout', tip.hide);

      const b = d.filter(d => {
        return (ontology === null) ? false : ontology.sampleIds.indexOf(d.sampleID) > -1;
      });

      const bars = bar.selectAll('.sample').data(b);

      bars.enter()
          .append('rect')
            .attr('class', 'sample')
            .attr('x', xMap)
            .attr('y', 0)
            .attr('height', barHeight)
            .attr('width', xScale(1))
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
            // .append('title')
            //   .text(d => `${d.sampleID} (${titleFormat(d.rle_cpm)})`);

      if (bars[0].length > 0) {  // force initial d3-tip position
        const n = bars[0][0];
        tip.show(n.__data__, n);
        tip.hide();
      }

      if (ontology) {
        /* svg.append('g')
        .attr('class', 'title')
        .attr('transform', `translate(${2 * width / 3},20)`)
        .append('text')
          .attr('text-anchor', 'start')
          .attr('class', 'title')
          .text(title); */

        const ordinal = d3.scale.ordinal()
          .domain([
            `samples of ${ontology.ontologyName} (n = ${b.length})`,
            `other samples (n = ${d.length - b.length})`
          ])
          .range(['sample', 'bar']);

        svg.append('g')
          .attr('class', 'legendQuant')
          .attr('transform', `translate(${2 * width / 3},${2 * height / 3})`);

        const colorLegend = d3Legend.color()
          .useClass(true)
          .labelAlign('end')
          .scale(ordinal);

        svg.select('.legendQuant')
          .call(colorLegend);
      }

      /* const box = d3plusText.box()
        .fontSize(10)
        .width(margin.left)
        .data([{text: ontology ? ontology.ontologyName : ''}]);

      if (ontology) {
        svg.append('g')
          .attr('transform', `translate(${-margin.left},${height + 5})`)
          .each(function () {
            box
              .select(this)();
          });
      } */

      if (!brush) {
        svg.append('g')
            .attr('class', 'x brush')
            .call(brush)
          .selectAll('rect')
            .attr('y', 0)
            .attr('height', height);
      }

      function mousemoved () {
        const x = d3.mouse(this)[0];
        const node = closestBar(x);

        if (node) {
          tip.show(node.__data__, node);
        }
      }

      function closestBar (x) {
        let min = Infinity;
        let node = null;

        bars.each(function (d) {
          const r = Math.abs(xMap(d) - x);
          if (r < min) {
            min = r;
            node = this;
          }
        });

        return node;
      }
    });
  }

  bars.title = function (_) {
    if (!arguments.length) {
      return title;
    }
    title = _;
    return bars;
  };

  bars.limit = function (_) {
    if (!arguments.length) {
      return limit;
    }
    limit = _;
    return bars;
  };

  bars.ontology = function (_) {
    if (!arguments.length) {
      return ontology;
    }
    ontology = _;
    return bars;
  };

  d3.rebind(bars, brush, 'on');

  return bars;
}
