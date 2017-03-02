import d3 from 'd3';
import d3plusText from 'd3plus-text';
import d3Legend from 'd3-svg-legend/no-extend';

import './box-chart.less!';
import {moveToFront} from './chart.utils';
import box from './box';

export default function BoxChart (opts) {
  opts = opts || {};

  const margin = opts.margin || {top: 20, right: 20, bottom: 30, left: 40};
  let width = opts.width ? opts.width - margin.left - margin.right : null;
  const height = (opts.height || 500) - margin.top - margin.bottom;
  let title = opts.title || null;
  const value = opts.value || (d => Number(d.value));

  // let fmt = d3.format('e');

  const color = d3.scale.linear()
    .domain([-5, 0, 5])
    .range(['blue', 'white', 'red']);

  const fdr = d => d.differential_expression_values ? d.differential_expression_values.fdr : 'NS';
  const fc = d => d.differential_expression_values ? d.differential_expression_values.log2FC : 'NS';

  function boxQuartiles (d) {
    return [
      d3.quantile(d, 0.25),
      d3.quantile(d, 0.5),
      d3.quantile(d, 0.75)
    ];
  }

  const quartiles = iqr(1.5);

  const oneBox = box()
    .value(d => d.expression)
    .whiskers(quartiles);  // 1.5 IQR

  const y1 = d3.scale.log().base(2);
  const yAxis = d3.svg.axis();
  // let x1 = d3.scale.ordinal();
  // let x2 = d3.scale.ordinal();

  function boxChart (selection) {
    selection.each(data => {
      if (width === null) {
        width = selection[0][0].clientWidth - margin.left - margin.right;
      }

      let min = Infinity;
      let max = -Infinity;

      const N = data.length;
      let M = -Infinity;
      let MM = 0;

      let fmin = Infinity;
      let fmax = -Infinity;

      data.forEach(subplot => {  // subplots
        subplot.MM = MM;

        const s = subplot.values.length;
        if (s > M) {
          M = s;
        }

        MM += s;

        subplot.values.forEach((d, i) => {  // groups
          const _d = d.expression.map(value).sort(d3.ascending);

          d.centerLabel = centerLineLabel(d, i);
          d.quartiles = boxQuartiles(_d);

          if (i === 0) {
            subplot.medianLine = d.quartiles[1];
          }

          const s = Number(fdr(d));
          if (s > fmax) {
            fmax = s;
          }
          if (s < fmin) {
            fmin = s;
          }

          d.expression.forEach(d => {
            const s = value(d);
            if (s > max) {
              max = s;
            }
            if (s < min) {
              min = s;
            }
          });
        });
      });

      const boxGap = 3;
      const boxWidth = (width - (N * boxGap)) / MM;
      const topPadding = 50;
      const boxHeight = height - topPadding;

      const DX = 50 / boxHeight * (max - min);
      max += DX;

      oneBox
        .width(boxWidth * 3 / 4)
        .height(boxHeight)
        .domain([min, max])
        .value(value);

      // color
      //  .domain([fmin, fmax]);

      y1
        .domain([min, max])
        .range([height - topPadding, 0]);

      yAxis
        .scale(y1)
        .orient('left');

      // x1
      //   .domain(d3.range(N))
      //   .rangeBands([0, width], 0.1, 0);

      // x2
      //   .domain(d3.range(M))
      //   .rangeBands([0, x1.rangeBand()], 0.5);

      selection.selectAll('svg').remove(); // improve this, use transitions

      const svg = selection.append('svg')
        .attr('class', 'boxPlot')
        .attr('title', `${title}`)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
          .attr('transform', `translate(${margin.left},${margin.top})`);

      svg.append('text')
        .attr('class', 'title')
        .attr('transform', `translate(${width / 2},0)`)
        .attr('text-anchor', 'middle')
        .text(title);

      svg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(-5,50)')
        .call(yAxis)
        .append('text')
          .attr('transform', 'rotate(-90)')
          .attr('y', -50)
          .attr('x', -height / 2)
          .style('text-anchor', 'middle')
          .text('Expression CPM');

      const subplot = svg.selectAll('.subPlot')
          .data(data)
        .enter().append('g')
          .attr('class', 'subPlot')
          .attr('transform', (d, i) => `translate(${(d.MM * boxWidth) + (boxGap * i)},5)`);

      subplot.append('rect')
        .attr('transform', `translate(0,45)`)
        .attr('width', d => d.values.length * boxWidth)
        .attr('height', height - topPadding)
        .style('fill', 'none');

      subplot.append('line')
        .attr('class', 'center')
        .style('stroke-dasharray', '3, 3')
        .style('visability', d => min < d.medianLine && max > d.medianLine ? 'visible' : 'hidden')
        .attr('x1', 0)
        .attr('y1', d => y1(d.medianLine) + 40)
        .attr('x2', width)
        .attr('y2', d => y1(d.medianLine) + 40);

      const box = d3plusText.box()
        .textAnchor('middle')
        .fontSize(14)
        .fontMax(14)
        .fontResize(true)
        .width(d => (d.values.length * boxWidth) - 6)
        .text(d => d.key.replace(/_/g, ' '))
        .height(45);

      subplot.append('g')
        .attr('class', 'boxLabelText')
        .attr('transform', 'translate(3,3)')
        .each(function (d) {
          box
            .data([d])
            .select(this)();
        });

      // subplot.selectAll('.boxLabelText').call(wrap, (d, i) => d.values.length * boxWidth / 4);

      const group = subplot.selectAll('group')
          .data(d => d.values)
        .enter().append('g')
          .attr('class', 'group')
          // .style('fill', d => { return color(fdr(d)); })
          .attr('transform', (d, i) => `translate(${(i + (1 / 8)) * boxWidth},20)`)
          ;

      group.append('text')
        .attr('transform', `translate(${boxWidth / 2},${height - 20}) rotate(-45)`)
        .attr('text-anchor', 'end')
        .text(d => d.sample_group_name);

      group.append('rect')
        .attr('height', 2 * height)
        .attr('width', boxWidth)
        .attr('transform', `translate(${-boxWidth / 8},${-height / 2})`)
        .style('fill', 'none')
        .style('stroke', 'none')
        .style('opacity', 1);

      // console.log(color.domain(), color.range());

      group.append('g')
        .attr('class', 'box')
        .attr('transform', 'translate(0,20)')
        .call(oneBox.fillColor(d => color(fc(d))));

      /* group.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${boxWidth / 2 - boxWidth / 8}, 20)`)
        .text(d => fdr(d) === 'NS' ? '' : '*'); */

      /* const g = group.append('g')
        .attr('class', 'pvalue_group')
        .style('visibility', (d, i) => (i === 0) ? 'hidden' : 'visible')
        .attr('alignment-baseline', 'hanging')
        .attr('transform', (d, i) => `translate(${boxWidth * (1 / 4 - i)},${y1(max) + margin.top})`);

      g.append('line')
        .attr('class', 'center pvalue')
        .attr('x1', 0)
        .attr('x2', (d, i) => (i * boxWidth));

      g.append('line')
        .attr('class', 'tick')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('y2', 6);

      g.append('line')
        .attr('class', 'tick')
        .attr('x1', (d, i) => (i * boxWidth))
        .attr('x2', (d, i) => (i * boxWidth))
        .attr('y1', 0)
        .attr('y2', 6); */

      svg.append('g')
        .attr('class', 'legendQuant')
        .attr('transform', 'translate(70,10)');

      const legend = d3Legend.color()
        .labelFormat(d3.format('.1f'))
        .shapeWidth(30)
        .orient('horizontal')
        .scale(color);

      svg.select('.legendQuant')
        .call(legend);

      svg.append('text')
        .attr('class', 'legend')
        .attr('transform', `translate(20,20)`)
        .attr('text-anchor', 'start')
        .text('log2FC');

      // group.selectAll('.pvalue_group-0').remove();

      subplot.on('mouseover', moveToFront);
      group.on('mouseover', moveToFront);
    });
  }

  boxChart.title = function (_) {
    if (!arguments.length) {
      return title;
    }
    title = _;
    return boxChart;
  };

  return boxChart;
}

function iqr (k) {
  return function (d) {
    const q1 = d.quartiles[0];
    const q3 = d.quartiles[2];
    const iqr = (q3 - q1) * k;
    let i = -1;
    let j = d.length;

    while (d[++i] < q1 - iqr) {
      // noop
    }
    while (d[--j] > q3 + iqr) {
      // noop
    }
    return [i, j];
  };
}

function centerLineLabel (d, i) {
  if (i === 0) {
    return 'REF';
  }
  if (!d.differential_expression_values) {
    return '';
  }
  const fdr = d.differential_expression_values.fdr;
  if (fdr <= 0.001) {
    return '***';
  }
  if (fdr <= 0.01) {
    return '**';
  }
  if (fdr <= 0.05) {
    return '*';
  }
  return '';
}
