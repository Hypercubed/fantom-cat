/* eslint camelcase: ["error", {properties: "never"}] */
/* eslint max-params: 0 */
import './gene.css!';

import d3 from 'd3';
import _F from '_F';

import {
  internalLinkTemplate,
  externalLinkTemplate,
  gridDefaults,
  getLinkText,
  headerCellTemplate
} from 'common/services/grid/grid.utils';

import {strings} from '../strings';

import AreaChart from './area-chart';
import BoxChart from './box-chart';

const _value = _F('rle_cpm');
const _valueSort = _value.order().desc;

// const _fdr_sort = _F('fdr').order().asc;
const _corrSort = _F('fold').order().desc;
const _fdrSort = _F('p-value').order().asc;

const MINEXPR = 0; // ~ 2**-5;
const BOXADD = 3e-2;

controller.$inject = ['$scope', 'dataPackage', '$routeParams', '$log', '$uibModal', '$httpParamSerializer', '$timeout'];
function controller ($scope, dataPackage, $routeParams, $log, $uibModal, $httpParamSerializer, $timeout) {
  const page = this;
  // $scope.dataPackage = dataPackage;

  // get data sets
  const geneData = dataPackage.resources[0].data;
  const samples = dataPackage.$resourcesByName['sample.info.tsv'].data;
  let ontology = dataPackage.$resourcesByName['ontology.info.tsv'].data;
  const atlas = dataPackage.$resourcesByName['diffExpr.grouping.tsv'].data;

  // process ontologies
  ontology.forEach(d => {
    // console.log(d);
    d.sampleIds = d.sample_ID_str.split(';');
    delete d.sample_ID_str;
    d.num_sample = Number(d.num_sample);
  });

  ontology = d3.map(ontology, d => d.ontologyID);

  // process gene data
  geneData.expression = [];
  geneData.ZENBU_genome_browser = geneData.ZENBU_genome_browser ? geneData.ZENBU_genome_browser.replace('https://fantom5-collaboration.', 'http://fantom.') : '';

  // process samples
  samples.forEach(sample => {
    if (sample.display_in_ontology_plot !== 'no') {
      const key = sample.sample_ID;
      const item = geneData.expression_by_sample_ID[sample.sample_ID] || {rle_cpm: MINEXPR};
      Object.assign(item, sample);
      item.sampleID = key;
      geneData.expression.push(item);
    }
  });

  // sort and rank expression
  geneData.expression.sort(_valueSort);

  geneData.expression.forEach((d, i) => {
    d.rank = i;
  });

  // Sample Ontology Association
  geneData.enriched_ontology = [];
  for (const key in geneData.sample_ontology_association) {
    if (Object.prototype.hasOwnProperty.call(geneData.sample_ontology_association, key)) {
      const item = geneData.sample_ontology_association[key];
      item.ontologyID = key;
      item.ontology = ontology.get(key);
      geneData.enriched_ontology.push(item);
    }
  }

  // trnscpt_coding_potential
  geneData.trnscpt_coding_potentialById = geneData.trnscpt_coding_potential;
  geneData.trnscpt_coding_potential = [];
  for (const key in geneData.trnscpt_coding_potentialById) {
    if (Object.prototype.hasOwnProperty.call(geneData.trnscpt_coding_potentialById, key)) {
      const item = geneData.trnscpt_coding_potentialById[key];
      item.id = key;
      geneData.trnscpt_coding_potential.push(item);
    }
  }

  geneData.enriched_ontology.sort(_corrSort);
  geneData.dynamic_expression.sort(_fdrSort);
  geneData.description = Object.values(geneData.summary).join('; ');

  atlas.forEach(d => {
    d.differential_expression_values = geneData.differential_expression_values[d.sample_group_code];
    const ids = d.sample_ID_str.split(';');
    d.plot_group = d.plot_group.replace('_', ' ');
    d.expression = ids.map(d => {  // todo: objects
      return geneData.expression_by_sample_ID[d] ? geneData.expression_by_sample_ID[d] : {rle_cpm: MINEXPR};
    });
  });

  // setup charts
  const chart = new AreaChart({
    margin: {top: 20, right: 50, bottom: 50, left: 80},
    height: 250,
    width: null,
    yValue: _value
  });

  const boxChart = new BoxChart({
    margin: {top: 20, right: 30, bottom: 100, left: 80},
    height: 500,
    width: null,
    value: d => Number(d ? d.rle_cpm + BOXADD : BOXADD)
  });

  const grids = {

    ontology: {
      ...gridDefaults,
      enableFiltering: true,
      columnDefs: [
        {
          name: 'ontology.ontologyName',
          displayName: 'Ontology Name',
          headerTooltip: strings.gene_indiv_ontology_name,
          headerCellTemplate
        },
        {
          name: 'ontologyID',
          displayName: 'Ontology ID',
          cellTemplate: internalLinkTemplate('ontologies'),
          headerTooltip: strings.gene_indiv_ontology_ID,
          headerCellTemplate
        },
        {
          name: 'fold', type: 'number',
          enableFiltering: false,
          sort: {direction: 'desc'},
          headerTooltip: strings.gene_indiv_ontology_fold,
          headerCellTemplate
        },
        {
          name: 'p-value',
          displayName: 'P-value',
          type: 'number',
          enableFiltering: false,
          headerTooltip: strings.gene_indiv_ontology_p_val,
          headerCellTemplate
        },
        {
          name: 'fraction of ontology samples expressed',
          displayName: 'Fraction expressed',
          type: 'number',
          enableFiltering: false,
          headerTooltip: strings.gene_indiv_ontology_frac,
          headerCellTemplate
        },
        {
          name: 'mean cpm of ontology samples',
          displayName: 'Mean CPM',
          type: 'number',
          enableFiltering: false,
          headerTooltip: strings.gene_indiv_ontology_mean_cpm,
          headerCellTemplate
        }
      ],
      data: geneData.enriched_ontology,
      onRegisterApi: gridApi => {
        grids.ontology.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, row => {
          if (row.isSelected) {
            selectOntologyPlot(row.entity.ontology);
          } else {
            row.isSelected = true;
          }
        });
        $timeout(() => {
          grids.ontology.gridApi.selection.selectRow(grids.ontology.data[0]);
        });
      }
    },

    dynamic_expression: {
      ...gridDefaults,
      columnDefs: [
        {
          name: 'series name',
          headerTooltip: strings.gene_indiv_dynamic_seriesname,
          headerCellTemplate
        },
        {
          name: 'series_ID',
          displayName: 'Series ID',
          headerTooltip: strings.gene_indiv_dynamic_seriesID,
          headerCellTemplate
        },
        {
          name: 'maximum fold change',
          displayName: 'Max FC',
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_dynamic_maxFC,
          headerCellTemplate
        },
        {
          name: 'fdr',
          displayName: 'FDR',
          type: 'number',
          headerTooltip: strings.gene_indiv_dynamic_fdr,
          headerCellTemplate
        }
      ],
      data: geneData.dynamic_expression,
      onRegisterApi: gridApi => {
        grids.dynamic_expression.gridApi = gridApi;
        gridApi.selection.on.rowSelectionChanged($scope, row => {
          if (row.isSelected) {
            selectAtlasPlot(row.entity.series_ID);
          } else {
            row.isSelected = true;
          }
        });
        $timeout(() => {
          grids.dynamic_expression.gridApi.selection.selectRow(grids.dynamic_expression.data[0]);
        });
      }
    },

    traits: {
      ...gridDefaults,
      columnDefs: [
        {
          name: 'traitID',
          displayName: 'Trait ID',
          cellTemplate: internalLinkTemplate('traits'),
          headerTooltip: strings.gene_indiv_trait_traitID,
          headerCellTemplate
        },
        {
          name: 'trait name',
          headerTooltip: strings.gene_indiv_trait_traitname,
          headerCellTemplate
        },
        {
          name: 'number of SNP',
          displayName: '# of SNPs',
          type: 'number',
          headerTooltip: strings.gene_indiv_trait_num_snp,
          headerCellTemplate
        },
        {
          name: 'best SNP p-value',
          displayName: 'Best SNP P-value',
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_trait_p_val,
          headerCellTemplate
        }
      ],
      data: geneData.trait_association
    },

    trait_vs_sample_ontology_enrichment: {
      ...gridDefaults,
      columnDefs: [
        {
          name: 'traitID',
          displayName: 'Trait ID',
          cellTemplate: internalLinkTemplate('traits'),
          headerTooltip: strings.gene_indiv_traitcell_traitID,
          headerCellTemplate
        },
        {
          name: 'trait name',
          headerTooltip: strings.gene_indiv_traitcell_traitname,
          headerCellTemplate
        },
        {
          name: 'ontologyID',
          displayName: 'Ontology ID',
          cellTemplate: internalLinkTemplate('ontologies'),
          headerTooltip: strings.gene_indiv_traitcell_ontologyID,
          headerCellTemplate
        },
        {
          name: 'ontology name',
          headerTooltip: strings.gene_indiv_traitcell_ontologyname,
          headerCellTemplate
        },
        {
          name: 'odds ratio',
          type: 'number',
          headerTooltip: strings.gene_indiv_traitcell_odds_ratio,
          headerCellTemplate
        },
        {
          name: 'fdr',
          displayName: 'FDR',
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_traitcell_fdr,
          headerCellTemplate
        },
        {
          name: 'literature_support',
          cellTemplate: externalLinkTemplate,
          headerTooltip: strings.gene_indiv_traitcell_literature,
          headerCellTemplate
        }
      ],
      data: geneData.trait_vs_sample_ontology_enrichment
    },

    eQTL_mRNA_coexpression: {
      ...gridDefaults,
      columnDefs: [
        {
          name: 'mRNA geneID',
          displayName: 'mRNA geneID',
          cellTemplate: internalLinkTemplate('genes'),
          headerTooltip: strings.gene_indiv_eQTL_mRNAID,
          headerCellTemplate
        },
        {
          name: 'mRNA name',
          displayName: 'mRNA Name',
          headerTooltip: strings.gene_indiv_eQTL_mRNAName,
          headerCellTemplate
        },
        {
          name: 'orientation',
          headerTooltip: strings.gene_indiv_eQTL_orientation,
          headerCellTemplate
        },
        {
          name: 'expression correlation',
          type: 'number',
          headerTooltip: strings.gene_indiv_eQTL_corr,
          headerCellTemplate
        },
        {
          name: 'distance',
          type: 'number',
          headerTooltip: strings.gene_indiv_eQTL_dist,
          headerCellTemplate
        },
        {
          name: 'fdr',
          displayName: 'FDR',
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_eQTL_fdr,
          headerCellTemplate
        }
      ],
      data: geneData.eQTL_mRNA_coexpression
    },

    trnscpt_coding_potential: {
      ...gridDefaults,
      columnDefs: [
        {
          name: 'id',
          displayName: 'Transcript ID',
          headerTooltip: strings.gene_indiv_transcript_coding_transcripID,
          headerCellTemplate
        },
        {
          name: 'max ORF length',
          displayName: 'Max ORF Length',
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_transcript_coding_ORF_length,
          headerCellTemplate
        },
        {
          name: 'CPAT coding',
          displayName: 'CPAT Coding',
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_transcript_coding_CPAT_call,
          headerCellTemplate
        },
        {
          name: 'CPAT score',
          displayName: 'CPAT Coding',
          visible: false,
          headerTooltip: strings.gene_indiv_transcript_coding_CPAT_score,
          headerCellTemplate
        },
        {
          name: 'RNACode coding',
          displayName: 'RNACode Coding',
          headerTooltip: strings.gene_indiv_transcript_coding_RNACode_coding,
          headerCellTemplate
        },
        {
          name: 'TIEScore',
          displayName: 'TIEScore',
          visible: false,
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_transcript_coding_TIEScore,
          headerCellTemplate
        },
        {
          name: 'coding ORF num',
          displayName: 'Coding ORF Num',
          visible: false,
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_transcript_coding_ORF_num,
          headerCellTemplate
        },
        {
          name: 'exon length',
          displayName: 'Exon Length',
          visible: false,
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_transcript_coding_exon_length,
          headerCellTemplate
        },
        {
          name: 'exon num',
          displayName: 'Exon Num',
          visible: false,
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_transcript_coding_exon_num,
          headerCellTemplate
        },
        {
          name: 'expression level',
          displayName: 'Expression Level',
          visible: false,
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_transcript_coding_expr_level,
          headerCellTemplate
        },
        {
          name: 'expression rank within gene',
          displayName: 'Expression Rank',
          visible: false,
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_transcript_coding_expr_rank,
          headerCellTemplate
        },
        {
          name: 'phyloCSF coding',
          displayName: 'phyloCSF Coding',
          headerTooltip: strings.gene_indiv_transcript_coding_phyloCSF_coding,
          headerCellTemplate
        },
        {
          name: 'sORF riboseq coding',
          displayName: 'sORF riboseq Coding',
          headerTooltip: strings.gene_indiv_transcript_coding_riboseq_coding,
          headerCellTemplate
        },
        {
          name: 'splicing index',
          displayName: 'splicing index',
          visible: false,
          type: 'number',
          sort: {direction: 'asc'},
          headerTooltip: strings.gene_indiv_transcript_coding_splicing,
          headerCellTemplate
        }
      ],
      data: geneData.trnscpt_coding_potential
    }
  };

  // a function that will generate a QueryString given a location and config
  const zenbuQueryString = (loc, config, width) => {
    width = width || 1080;
    return $httpParamSerializer({
      config,
      loc,
      dwidth: width
    }).replace(/&/g, ';');
  };

  const zenbuLink = queryString => `
     <div class="modal-header">
       <div class="pull-right">
       <a href="http://fantom.gsc.riken.jp/zenbu/gLyphs/index.html#${queryString}" target="_blank">switch to full Zenbu</a>
         <button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="$close()">
           <span aria-hidden="true">&times;</span>
         </button>
       </div>
       <h4 class="modal-title" id="myModalLabel"><img height="30px" src="http://fantom.gsc.riken.jp/zenbu/images/zenbu_logo_small.png"></img> Zenbu Genome Browser View</h4>
     </div>
     <div class="modal-body" style="height: 620px;">
      <iframe class="col-xs-12" style="height: 600px; border: none;"
          src="http://fantom.gsc.riken.jp/zenbu/gLyphs/index_embed.html#${queryString}"></iframe>
     </div>
     <div class="modal-footer text-left"></div>`;

  // a function that will open a zenbu dialog
  const openZenbuView = (loc, config) => {
    $uibModal.open({
      animation: false,
      template: zenbuLink(zenbuQueryString(loc, config, 800)),
      controller: () => {},
      size: 'lg',
      resolve: {}
    });
  };

  const zenbuConfigs = {};
  dataPackage.resources[4].data.forEach(d => {
    zenbuConfigs[d.name] = [d.config, d.description];
  });

  console.log(zenbuConfigs);

  Object.assign(page, {
    editorOptions: {
      data: dataPackage,
      enableOpen: false
    },
    zenbuConfigs,
    gene: geneData,
    samples,
    ontology,
    getLinkText,
    openZenbuView,
    zenbuQueryString,
    ontology_plot: null,
    atlas_plot: null,
    grids
  });

  $scope.$on('$destroy', () => {
    d3.selectAll('.d3-tip').remove();
  });

  return;

  function selectOntologyPlot (ontology) {
    page.ontology_plot = ontology;
    drawOntologyPlot(ontology);
  }

  function drawOntologyPlot (plot) {
    $log.debug('redraw enrichment');

    // console.log(plot);
    // console.log(geneData.expression);

    chart.title(`${geneData.geneName} Enrichment`)
      .ontology(plot);

    d3.select('#expChart').datum(geneData.expression)
      .call(chart);

    $log.debug('done redraw enrichment');
  }

  function selectAtlasPlot (seriesID) {
    page.selectedSeriesID = seriesID;
    drawAtlasPlot(seriesID);
  }

  function drawAtlasPlot (seriesID) {
    seriesID = seriesID || page.selectedSeriesID;
    const t = atlas
      .filter(d => d.plot_name === seriesID);

    const plot = d3.nest()
      // .key(d => d.category)
      .key(d => d.plot_group)
      .key(d => d.plot_name)
      .entries(t)[0];

    $log.debug('redraw atlas');

    d3.selectAll('.d3-tip.box').remove();

    boxChart
      .title(`${geneData.geneName} ${plot.key}`);

    d3.select('#boxChart')
      .datum(plot.values)
      .call(boxChart);

    $log.debug('done redraw atlas');
  }
}

export default controller;
