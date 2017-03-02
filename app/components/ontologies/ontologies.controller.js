import universe from 'universe';

import {internalLinkTemplate, gridDefaults, headerCellTemplate} from 'common/services/grid/grid.utils';
import {strings} from '../strings';

controller.$inject = ['$log', '$scope', 'dataPackage'];
function controller ($log, $scope, dataPackage) {
  const $ctrl = this;

  // data
  const raw = dataPackage.resources[0].data;

  const searchFields = ['ontologyID', 'ontologyName', 'description'];

  const generatedColumns = {
    'Ontology Type': d => d.ontologyID.split(':')[0],
    'Enriched Traits': d => d.num_enriched_trait > 0 ? 'yes' : 'no',
    'search': d => searchFields.map(f => d[f]).join(';').toUpperCase()
  };

  const facets = [
    {
      key: 'Ontology Type',
      description: strings.ontology_list_refine_Ontology_Type
    },
    {
      key: 'Enriched Traits',
      description: strings.ontology_list_refine_Enriched_Traits
    }
  ];

  universe(raw, {generatedColumns})
    .then(async service => {
      $ctrl.universe = service;
      $ctrl.universe.onFilter(update);

      facets.forEach(facet => {
        facet.universe = service;
      });

      await $ctrl.universe.column('ontologyID');  // main data list
      $ctrl.id = $ctrl.universe.column.find('ontologyID').dimension;

      // update();
    })
    .catch($log.error);

  // grids
  const columnDefs = [
    {
      name: 'ontologyID',
      displayName: 'Ontology ID',
      cellTemplate: internalLinkTemplate('ontologies'),
      headerTooltip: strings.ontology_list_table_ontologyID,
      headerCellTemplate
    },
    {
      name: 'ontologyName',
      displayName: 'Ontology Name',
      headerTooltip: strings.ontology_list_table_ontologyname,
      headerCellTemplate
    },
    {
      name: 'description',
      headerTooltip: strings.ontology_list_table_description,
      headerCellTemplate
    },
    {
      name: 'num_sample',
      type: 'number',
      displayName: 'Samples',
      headerTooltip: strings.ontology_list_table_samples,
      headerCellTemplate
    },
    {
      name: 'num_associated_gene',
      type: 'number',
      displayName: 'Associated Genes',
      sort: {
        direction: 'desc'
      },
      headerTooltip: strings.ontology_list_table_associated_genes,
      headerCellTemplate
    },
    {
      name: 'num_enriched_trait',
      type: 'number',
      displayName: 'Enriched Traits',
      headerTooltip: strings.ontology_list_table_enriched_traits,
      headerCellTemplate
    }
  ];

  const gridOpts = {
    ...gridDefaults,
    columnDefs,
    enableColumnResizing: true,
    enablePaginationControls: true,
    paginationPageSize: 25,
    enableFiltering: false,
    data: raw,
    onRegisterApi: gridApi => {
      this.gridApi = gridApi;
    },
    exporterCsvFilename: 'ontologies.csv',
    exporterMenuPdf: false,
    exporterMenuAllData: false,
  };

  // finialize
  return Object.assign($ctrl, {
    editorOptions: {
      data: dataPackage,
      enableOpen: false,
      enableSvgDownload: false,
      enablePngDownload: false
    },
    facets,
    title: 'Ontologies',
    data: raw,
    raw,
    gridOpts,
    searchFilter,
    filterValue: '',
    clearAll () {
      $ctrl.filterValue = '';
      $ctrl.universe.filterAll();
    }
  });

  function update () {
    $scope.$applyAsync(() => {
      $ctrl.gridOpts.data = $ctrl.data = $ctrl.id.top(Infinity);
    });
  }

  function searchFilter (value) {
    const fn = (!value || value === '') ? undefined : r => r.indexOf(value.toUpperCase()) > -1;

    return $ctrl.universe
      .filter('search', fn, false, true)
      .catch($log.error);
  }
}

/* class Ctrl {
  constructor ($scope, dataPackage) {
    super($scope, dataPackage);

    const hyperlinkCellTemplate = '<div class="ui-grid-cell-contents" title="TOOLTIP"><a href="#/ontologies/{{COL_FIELD}}" target="_self">{{COL_FIELD}}</a></div>';

    this.columnDefs = [
      {name: 'ontologyID', displayName: 'Ontology ID', cellTemplate: hyperlinkCellTemplate},
      {name: 'ontologyName', displayName: 'Ontology Name'},
      {name: 'description'},
      {name: 'num_sample', type: 'number', displayName: 'Samples'},
      {name: 'num_associated_gene', type: 'number', displayName: 'Associated Genes', sort: {
        direction: 'desc'
      }},
      {name: 'num_enriched_trait', type: 'number', displayName: 'Enriched Traits'}
    ];

    this.searchFields = [
      'ontologyID',
      'ontologyName',
      'description'
    ];

    this.$onInit();
  }
}
Ctrl.$inject = ['$scope', 'dataPackage']; */

export default controller;
