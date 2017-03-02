/* eslint camelcase: ["error", {properties: "never"}] */
import universe from 'universe';

import {
  internalLinkTemplate,
  filterTemplate,
  externalLinkTemplate,
  gridDefaults,
  getLinkText,
  headerCellTemplate
} from 'common/services/grid/grid.utils';

import {mapToArray} from '../common';
import {strings} from '../strings';

controller.$inject = ['$scope', 'dataPackage', '$routeParams'];
function controller ($scope, dataPackage, $routeParams) {
  const $ctrl = this;

  $scope.dataPackage = dataPackage;

  // ontology data
  const ontology = dataPackage.resources[0].data;
  ontology.ontology_id = $routeParams.id;
  ontology.sample_info_byId = ontology.sample_info;
  ontology.sample_info = mapToArray(ontology.sample_info_byId);

  ontology.trait_enrichment_byId = ontology.trait_enrichment;
  ontology.trait_enrichment = mapToArray(ontology.trait_enrichment_byId);

  ontology.sample_list = ontology.sample_info.map(d => d.description);

  ontology.samples = ontology.sample_list.join('; ');

  // gene data
  const genes = dataPackage.resources[1].data;

  const searchFields = [
    'geneID',
    'geneName',
    'geneClass',
    'geneCategory',
    'traitStr'
  ];

  const annotations = {
    ENSG: 'Known',
    CATG: 'Novel'
  };

  const generatedColumns = {
    annotation: d => annotations[d.geneID.slice(0, 4)],
    search: d => searchFields.map(f => d[f]).join(';').toUpperCase()
  };

  const facets = [
    {
      key: 'annotation',
      description: strings.gene_list_refine_Annotation
    },
    {
      key: 'geneClass',
      description: strings.ontology_list_refine_Ontology_Type
    },
    {
      key: 'geneCategory',
      description: strings.ontology_list_refine_Ontology_Type
    }
  ];

  universe(genes, {generatedColumns})
    .then(async service => {
      $ctrl.universe = service;

      facets.forEach(facet => {
        facet.universe = service;
      });

      await $ctrl.universe.column('geneID');  // main data list
      $ctrl.id = $ctrl.universe.column.find('geneID').dimension;

      service.onFilter(update);
      update();
    })
    .catch(console.error.bind(console)); // eslint-disable-line no-console

  // grids
  const grids = {
    traits: {
      ...gridDefaults,
      columnDefs: [
        {
          name: 'id',
          displayName: 'Trait ID',
          cellTemplate: internalLinkTemplate('traits'),
          headerTooltip: strings.ontology_indiv_trait_table_traitID,
          headerCellTemplate
        },
        {
          name: 'trait_name',
          headerTooltip: strings.ontology_indiv_trait_table_traitname,
          headerCellTemplate
        },
        {
          name: 'number_of_genes',
          displayName: '# of Genes',
          type: 'number',
          cellTemplate: filterTemplate,
          headerTooltip: strings.ontology_indiv_trait_table_numGene,
          headerCellTemplate
        },
        {
          name: 'odds_ratio',
          type: 'number',
          headerTooltip: strings.ontology_indiv_trait_table_odds_ratio,
          headerCellTemplate
        },
        {
          name: 'fdr',
          displayName: 'FDR',
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.ontology_indiv_trait_table_fdr,
          headerCellTemplate
        },
        {
          name: 'literature_support',
          cellTemplate: externalLinkTemplate,
          headerTooltip: strings.ontology_indiv_trait_table_literature,
          headerCellTemplate
        }
      ],
      data: ontology.trait_enrichment
    },

    genes: {
      ...gridDefaults,
      columnDefs: [
        {
          name: 'geneID',
          displayName: 'Gene ID',
          cellTemplate: internalLinkTemplate('genes'),
          headerTooltip: strings.ontology_indiv_gene_table_GeneID,
          headerCellTemplate
        },
        {
          name: 'geneName',
          displayName: 'Gene Name',
          headerTooltip: strings.ontology_indiv_gene_table_Gene_Name,
          headerCellTemplate
        },
        {
          name: 'geneClass',
          displayName: 'Gene Class',
          headerTooltip: strings.ontology_indiv_gene_table_Gene_Class,
          headerCellTemplate
        },
        {
          name: 'geneCategory',
          headerTooltip: strings.ontology_indiv_gene_table_Gene_Category,
          headerCellTemplate
        },
        {
          name: 'mann_whitney_pval',
          displayName: 'P-value',
          type: 'number',
          headerTooltip: strings.ontology_indiv_gene_table_p_val,
          headerCellTemplate
        },
        {
          name: 'fold',
          type: 'number',
          sort: {direction: 'desc'},
          headerTooltip: strings.ontology_indiv_gene_table_fold,
          headerCellTemplate
        },
        {
          name: 'max_rle_cpm',
          displayName: 'Max RLE CPM',
          type: 'number',
          visible: false
        },
        {
          name: 'mean_rle_cpm',
          displayName: 'Mean RLE CPM',
          type: 'number',
          visible: false
        },
        {
          name: 'traitStr',
          displayName: 'Trait List',
          visible: false
        }
      ],
      data: genes
    }
  };

  return Object.assign($ctrl, {
    ontology,
    genes,
    editorOptions: {
      data: dataPackage,
      enableOpen: false,
      enableSvgDownload: false,
      enablePngDownload: false
    },
    facets,
    grids,
    getLinkText,
    filterValue: '',
    searchFilter,
    filter (value) {
      $ctrl.filterValue = value;
      searchFilter(value);
    },
    clearAll () {
      $ctrl.filterValue = '';
      $ctrl.universe.filterAll();
    }
  });

  function update () {
    $scope.$applyAsync(() => {
      grids.genes.data = $ctrl.id.top(Infinity);
    });
  }

  function searchFilter (value) {
    const fn = (!value || value === '') ? undefined : r => r.indexOf(value.toUpperCase()) > -1;

    return $ctrl.universe
      .filter('search', fn, false, true)
      .catch(console.error.bind(console)); // eslint-disable-line no-console
  }
}

export default controller;
