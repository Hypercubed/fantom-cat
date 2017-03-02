/* eslint max-params: 0 */
import universe from 'universe';

import {internalLinkTemplate, gridDefaults, headerCellTemplate} from 'common/services/grid/grid.utils';
import {strings} from '../strings';

controller.$inject = ['$log', '$scope', 'dataPackage', 'cfpLoadingBar', '$timeout'];
function controller ($log, $scope, dataPackage, cfpLoadingBar, $timeout) {
  const $ctrl = this;

  cfpLoadingBar.start();

  const raw = dataPackage.resources[0].data;

  const searchFields = ['geneID', 'gene name', 'alias symbol', 'gene category', 'gene class'];

  const associations = {
    ENSG: 'Known',
    CATG: 'Novel'
  };

  const generatedColumns = {
    // 'json': d => ({...d}),
    'annotation': d => associations[d.geneID.slice(0, 4)],
    'TIR conservation': d => d['TIR conservation[RS score]'] ? 'yes' : 'no',
    'Exon Conservation': d => d['exon conservation[RS score]'] ? 'yes' : 'no',
    'Trait vs Cell Enrichment': d => d['trait vs cell enrichment[fdr]'] ? 'yes' : 'no',
    'eQTL mRNA Coexpression': d => d['eQTL mRNA coexpression[fdr]'] ? 'yes' : 'no',
    'Dynamic Expression': d => d['dynamic expression[fdr]'] ? 'yes' : 'no',
    'search': d => searchFields.map(f => d[f]).join(';').toUpperCase()
  };

  const facets = [
    {
      key: 'annotation',
      description: strings.gene_list_refine_Annotation
    },
    {
      key: 'gene category',
      displayName: 'Category',
      description: strings.gene_list_refine_Category
    },
    {
      key: 'gene class',
      displayName: 'Class',
      description: strings.gene_list_refine_Class
    },
    {
      key: 'DHS support',
      displayName: 'DHS support',
      description: strings.gene_list_refine_DHS_support
    },
    {
      key: 'TIR conservation',
      displayName: 'TIR conservation',
      collapsed: true,
      description: strings.gene_list_refine_TIR_Conservation
    },
    {
      key: 'Exon Conservation',
      displayName: 'Exon Conservation',
      collapsed: true,
      description: strings.gene_list_refine_Exon_Conservation
    },
    {
      key: 'Trait vs Cell Enrichment',
      displayName: 'Trait vs Cell Enrichment',
      collapsed: true,
      description: strings.gene_list_refine_Trait_vs_Cell_Enrichment
    },
    {
      key: 'eQTL mRNA Coexpression',
      displayName: 'eQTL mRNA Coexpression',
      collapsed: true,
      description: strings.gene_list_refine_eQT_mRNA_Coexpression
    },
    {
      key: 'Dynamic Expression',
      displayName: 'Dynamic Expression',
      collapsed: true,
      description: strings.gene_list_refine_Dynamic_Expression
    }
  ];

  universe(raw, {generatedColumns})
    .then(async service => {
      $ctrl.universe = service;
      $ctrl.universe.onFilter(update);

      await $ctrl.universe.column(facets.map(d => d.key));

      facets.forEach(facet => {
        facet.universe = service;
      });

      await $ctrl.universe.column('geneID');  // main data list
      $ctrl.id = $ctrl.universe.column.find('geneID').dimension;
      update();
    })
    .catch($log.error);

  // grids
  const columnDefs = [
    {
      name: 'geneID',
      displayName: 'GeneID',
      cellTemplate: internalLinkTemplate('genes'),
      enableHiding: false,
      sort: {
        direction: 'desc'
      },
      headerTooltip: strings.gene_list_table_GeneID,
      headerCellTemplate
    },
    {
      name: 'gene name',
      headerTooltip: strings.gene_list_table_Gene_Name,
      headerCellTemplate
    },
    {
      name: 'alias symbol',
      visible: false,
      headerTooltip: strings.gene_list_table_Alias_Symbol,
      headerCellTemplate
    },
    {
      name: 'gene category',
      headerTooltip: strings.gene_list_table_Gene_Category,
      headerCellTemplate
    },
    {
      name: 'gene class',
      headerTooltip: strings.gene_list_table_Gene_Class,
      headerCellTemplate
    },
    {
      name: 'DHS support',
      displayName: 'DHS Support',
      headerTooltip: strings.gene_list_table_DHS_Support,
      headerCellTemplate
    },
    // {name: 'lncRNA?', displayName: 'lncRNA?', enableFiltering: false},
    // {name: 'functional evidence', displayName: 'Count of functional evidence', type: 'number', visible: false, enableFiltering: false},
    {
      name: 'TIR conservation[RS score]',
      type: 'number',
      displayName: 'TIR Conservation [RS score]',
      enableFiltering: false,
      visible: false,
      headerTooltip: strings.gene_list_table_TIR_Conservation,
      headerCellTemplate
    },
    {
      name: 'exon conservation[RS score]',
      type: 'number',
      displayName: 'Exon Conservation [RS score]',
      enableFiltering: false,
      visible: false,
      headerTooltip: strings.gene_list_table_Exon_Conservation,
      headerCellTemplate
    },
    {
      name: 'trait vs cell enrichment[fdr]',
      type: 'number',
      displayName: 'Trait vs Cell Enrichment [FDR]',
      enableFiltering: false,
      visible: false,
      headerTooltip: strings.gene_list_table_Trait_vs_Cell_Enrichment,
      headerCellTemplate
    },
    {
      name: 'eQTL mRNA coexpression[fdr]',
      type: 'number',
      displayName: 'eQTL mRNA Coexpression [FDR]',
      enableFiltering: false,
      visible: false,
      headerTooltip: strings.gene_list_table_eQT_mRNA_Coexpression,
      headerCellTemplate
    },
    {
      name: 'dynamic expression[fdr]',
      type: 'number',
      displayName: 'Dynamic Expression [FDR]',
      enableFiltering: false,
      visible: false,
      headerTooltip: strings.gene_list_table_Dynamic_Expression,
      headerCellTemplate
    }
  ];

  const gridOpts = {
    ...gridDefaults,
    columnDefs,
    enableColumnResizing: true,
    enablePaginationControls: false,
    flatEntityAccess: true,
    enableFiltering: false,
    data: raw,
    exporterCsvFilename: 'genes.csv',
    exporterMenuPdf: false,
    exporterMenuAllData: false
  };

  return Object.assign($ctrl, {
    editorOptions: {
      data: dataPackage,
      enableOpen: false,
      enableSvgDownload: false,
      enablePngDownload: false
    },
    gridOpts,
    // facets,
    facets,
    /* setFilter: (type, value) => {
      cfpLoadingBar.start();
      $timeout(() => {
        cfpLoadingBar.inc();
        setFilter(facets, type, value);
        cfpLoadingBar.inc();
        update();
      }, 32);
    }, */
    // reset,
    filterValue: '',
    title: 'Genes',
    data: raw,
    raw,
    searchFilter,
    clearAll () {
      $ctrl.filterValue = '';
      $ctrl.universe.filterAll();
    }
  });

  function update () {
    cfpLoadingBar.start();
    $scope.$applyAsync(() => {
      $ctrl.gridOpts.data = $ctrl.data = $ctrl.id.top(Infinity);
      $timeout(() => {
        cfpLoadingBar.complete();
      }, 32);
    });
  }

  function searchFilter (value) {
    cfpLoadingBar.start();

    const fn = (!value || value === '') ? undefined : r => r.indexOf(value.toUpperCase()) > -1;

    return $ctrl.universe
      .filter('search', fn, false, true)
      .catch($log.error);
  }

  /* function reset () {
    filterGrid(null);
  } */

  /* function filterGrid (value) {
    cfpLoadingBar.start();
    $timeout(() => {
      if (!value || value === '') {
        searchDimension.filter(null);
      } else {
        const matcher = new RegExp(value, 'i');
        searchDimension.filterFunction(r => {
          return r.some(v => v.match(matcher));
        });
      }
      update();
    }, 32);
  } */
}

export default controller;
