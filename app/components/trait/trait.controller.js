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

controller.$inject = ['$log', '$scope', 'dataPackage', '$routeParams'];
function controller ($log, $scope, dataPackage, $routeParams) {
  const $ctrl = this;

  // data
  const trait = dataPackage.resources[0].data;
  const genes = dataPackage.resources[1].data;

  /* const cf = crossfilter(genes);
  const id = cf.dimension(d => d.geneID); */

  const annotations = {
    ENSG: 'Known',
    CATG: 'Novel'
  };

  const searchFields = [
    'geneID',
    'geneName',
    'geneClass',
    'ontologyStr'
  ];

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
      description: strings.trait_indiv_refine_Class
    },
    {
      key: 'geneCategory',
      description: strings.trait_indiv_refine_Category
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
    .catch($log.error);

  trait.trait_id = $routeParams.id;

  trait.ontology_enrichment_byId = trait.ontology_enrichment;
  trait.ontology_enrichment = mapToArray(trait.ontology_enrichment_byId);

  trait.literature_traits = trait.literature_trait.join('; ');

  const grids = {
    // Ontology enrichment
    ontology: {
      ...gridDefaults,
      columnDefs: [
        {
          name: 'id',
          displayName: 'Ontology ID',
          cellTemplate: internalLinkTemplate('ontologies'),
          headerTooltip: strings.trait_indiv_ontology_table_ontologyID,
          headerCellTemplate
        },
        {
          name: 'ontology_name',
          headerTooltip: strings.trait_indiv_ontology_table_ontologyname,
          headerCellTemplate
        },
        {
          name: 'number_of_genes',
          displayName: '# of Genes',
          type: 'number',
          cellTemplate: filterTemplate,
          headerTooltip: strings.trait_indiv_ontology_table_numGene,
          headerCellTemplate
        },
        {
          name: 'fdr',
          displayName: 'FDR',
          type: 'number',
          sort: {
            direction: 'asc'
          },
          headerTooltip: strings.trait_indiv_ontology_table_fdr,
          headerCellTemplate
        },
        {
          name: 'odds_ratio',
          type: 'number',
          headerTooltip: strings.trait_indiv_ontology_table_odds_ratio,
          headerCellTemplate
        },
        {
          name: 'literature_support',
          cellTemplate: externalLinkTemplate,
          headerTooltip: strings.trait_indiv_ontology_table_literature,
          headerCellTemplate
        }
      ],
      data: trait.ontology_enrichment
    },

    // Gene association
    genes: {
      ...gridDefaults,
      columnDefs: [
        {
          name: 'geneID',
          displayName: 'Gene ID',
          cellTemplate: internalLinkTemplate('genes'),
          headerTooltip: strings.trait_indiv_gene_table_GeneID,
          headerCellTemplate
        },
        {
          name: 'geneName',
          headerTooltip: strings.trait_indiv_gene_table_Gene_Name,
          headerCellTemplate
        },
        {
          name: 'geneClass',
          headerTooltip: strings.trait_indiv_gene_table_Gene_Class,
          headerCellTemplate
        },
        {
          name: 'geneCategory',
          headerTooltip: strings.trait_indiv_gene_table_Gene_Category,
          headerCellTemplate
        },
        {
          name: 'best_pval',
          displayName: 'Best P-value',
          type: 'number',
          sort: {
            direction: 'asc'
          },
          headerTooltip: strings.trait_indiv_gene_table_p_val,
          headerCellTemplate
        },
        {
          name: 'ontologyStr',
          visible: false
        }
      ],
      data: genes
    }
  };

  return Object.assign($ctrl, {
    editorOptions: {
      data: dataPackage,
      enableOpen: false,
      enableSvgDownload: false,
      enablePngDownload: false
    },
    trait,
    genes,
    grids,
    getLinkText,
    filterValue: '',
    facets,
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
      .catch($log.error);
  }
}

export default controller;
