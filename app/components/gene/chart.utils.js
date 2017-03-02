import d3 from 'd3';

export function moveToFront () {
  const sel = d3.select(this);
  return sel.each(function () {
    this.parentNode.appendChild(this);
  });
}
