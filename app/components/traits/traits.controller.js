import universe from 'universe';

import {internalLinkTemplate, gridDefaults, headerCellTemplate} from 'common/services/grid/grid.utils';
import {strings} from '../strings';

controller.$inject = ['$log', '$scope', 'dataPackage', '$timeout'];
function controller ($log, $scope, dataPackage, $timeout) {
  const $ctrl = this;

  // data
  const raw = dataPackage.resources[0].data;

  const searchFields = ['traitID', 'traitName', 'description'];

  const generatedColumns = {
    'Trait Type': d => d.traitID.split(':')[0],
    'SNPs': d => {
      const x = [
        d.num_lead_GWAS_SNP > 0 ? 'GWAS Lead' : '',
        d.num_proxy_GWAS_SNP > 0 ? 'GWAS Proxy' : '',
        d.num_fine_mapped_SNP > 0 ? 'Fine Mapped' : '']
        .filter(d => d.length > 0);
      if (x.length === 1) {
        return `${x[0]} only`;
      }
      return x.join(' & ');
    },
    'Enriched Ontologies': d => d.num_enriched_ontology > 0 ? 'yes' : 'no',
    'search': d => searchFields.map(f => d[f]).join(';').toUpperCase()
  };

  const facets = [
    {
      key: 'Trait Type',
      description: strings.trait_list_refine_Trait_Type
    },
    {
      key: 'SNPs',
      displayName: 'SNPs',
      description: strings.trait_list_refine_SNPs
    },
    {
      key: 'Enriched Ontologies',
      description: strings.trait_list_refine_Enriched_Ontologies
    }
  ];

  universe(raw, {generatedColumns})
    .then(async service => {
      $ctrl.universe = service;
      $ctrl.universe.onFilter(update);

      facets.forEach(facet => {
        facet.universe = service;
      });

      await $ctrl.universe.column('traitID');  // main data list
      $ctrl.id = $ctrl.universe.column.find('traitID').dimension;

      update();
    })
    .catch($log.error);

  // grids
  const columnDefs = [
    {
      name: 'traitID',
      displayName: 'Trait ID',
      cellTemplate: internalLinkTemplate('traits'),
      enableHiding: false,
      enableColumnMenu: false,
      headerTooltip: strings.trait_list_table_traitID,
      headerCellTemplate
    },
    {
      name: 'traitName',
      displayName: 'Trait Name',
      headerTooltip: strings.trait_list_table_traitname,
      headerCellTemplate
    },
    {
      name: 'description',
      displayName: 'Description',
      headerTooltip: strings.trait_list_table_description,
      headerCellTemplate
    },
    {
      name: 'num_lead_GWAS_SNP',
      displayName: 'Lead GWAS SNPs',
      type: 'number',
      visible: false,
      headerTooltip: strings.trait_list_table_lead_GWAS_SNP,
      headerCellTemplate
    },
    {
      name: 'num_proxy_GWAS_SNP',
      displayName: 'Proxy GWAS SNPs',
      type: 'number',
      visible: false,
      headerTooltip: strings.trait_list_table_proxy_GWAS_SNP,
      headerCellTemplate
    },
    {
      name: 'num_fine_mapped_SNP',
      displayName: 'Fine Mapped SNPs',
      type: 'number',
      visible: false,
      headerTooltip: strings.trait_list_table_fina_mapped_SNP,
      headerCellTemplate
    },
    {
      name: 'num_associated_gene',
      displayName: 'Associated Genes',
      type: 'number',
      headerTooltip: strings.trait_list_table_associated_genes,
      headerCellTemplate
    },
    {
      name: 'num_enriched_ontology',
      displayName: 'Enriched Ontologies',
      type: 'number', sort: {
        direction: 'desc'
      },
      headerTooltip: strings.trait_list_table_enriched_ontologies,
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
    exporterCsvFilename: 'traits.csv',
    exporterMenuPdf: false,
    exporterMenuAllData: false,
    onRegisterApi: gridApi => {
      this.gridApi = gridApi;
    }
  };

  // finialize
  return Object.assign($ctrl, {
    loadState: 0,
    editorOptions: {
      data: dataPackage,
      enableOpen: false,
      enableSvgDownload: false,
      enablePngDownload: false
    },
    facets,
    title: 'Traits',
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
    $ctrl.loadState = 2;
    $timeout(() => {
      $ctrl.gridOpts.data = $ctrl.data = $ctrl.id.top(Infinity);
      $ctrl.loadState = 0;
    }, 16);
  }

  function searchFilter (value) {
    const fn = (!value || value === '') ? undefined : r => r.indexOf(value.toUpperCase()) > -1;

    return $ctrl.universe
      .filter('search', fn, false, true)
      .catch($log.error);
  }
}

export default controller;
