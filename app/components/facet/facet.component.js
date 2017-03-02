import d3 from 'd3';

import './facet.less!';

controller.$inject = ['$scope'];
function controller ($scope) {
  const $ctrl = this;
  const facet = $ctrl.facet;

  const minLimit = 5;
  const maxLimit = 100;

  const scale = d3.scale.linear()
    .range([0, 100]);

  Object.assign($ctrl, {
    minLimit,
    maxLimit,
    limit: minLimit,
    size: facet.group.size(),
    list: facet.group.top(minLimit),
    scale,
    toggle,
    toggleLimit,
    exists,
    clear,
    $onInit: setScale
  });

  $scope.$watchCollection(() => d3.max($ctrl.list, d => d.value), max => scale.domain([0, max]));

  function setScale () {
    scale
      .domain([0, d3.max($ctrl.list, d => d.value)]);
  }

  function clear () {
    $ctrl.setFilter(facet.key, null);
  }

  function exists (item) {
    return facet.filterTo.indexOf(item) > -1;
  }

  function toggle (item) {
    $ctrl.setFilter(facet.key, item);
  }

  function toggleLimit () {
    if ($ctrl.size > $ctrl.limit) {
      $ctrl.limit = $ctrl.maxLimit;
    } else {
      $ctrl.limit = $ctrl.minLimit;
    }
    $ctrl.list = $ctrl.facet.group.top($ctrl.limit);
  }
}

export default {
  controller,
  templateUrl: 'components/facet/facet.html',
  bindings: {
    facet: '<',
    setFilter: '<'
  }
};
