/* eslint camelcase: 0 */

const popupText = (title, text) => `
  ${title}
  <p class="text-muted">
    ${text}
  </p>
`;

export const strings = {
  landing_main_gene: ['Browse by Genes (n=59,110)', 'FANTOM CAT genes: classification, conservation, expression, trait assocation and more'],
  landing_main_trait: ['Browse by Traits (n=817)', 'GWAS and PICS traits: associated genes and enriched cells'],
  landing_main_cell: ['Browse by Ontologies (n=347)', 'sample ontology for cells: associated genes and enriched traits'],
  landing_main_gene_trait_asso: ['Gene-Trait Association', 'genes were associated to traits by their overlapping with GWAS and PICS SNPs'],
  landing_main_gene_cell_asso: ['Gene-Cell Association', 'genes were associated to cells by their expression in samples with the same ontology'],
  landing_main_trait_cell_enrich: ['Trait-Cell Enrichment', 'enrichment of trait-associated genes in cell-associated genes were tested with Fisher\'s exact test'],
  gene_list_refine_Annotation: ['Annotations', 'known genes annotated in GENCODEv19 or novel genes annotated in FANTOM CAT'],
  gene_list_refine_Category: ['FANTOM CAT Gene Category', 'FANTOM CAT gene category, based on gene class and DHS type'],
  gene_list_refine_Class: ['FANTOM CAT Gene Class', 'FANTOM CAT gene class, based coding potential and genomic context (about)'],
  gene_list_refine_DHS_support: ['DHS Support Type', 'strongest TSS supported by Roadmap promoter, enhancer or dyadic DHS '],
  gene_list_refine_TIR_Conservation: ['Transcription Initation Region Conservation', 'conserved if TIR contains GERP elements with RS score >50% background (P<0.05), or not'],
  gene_list_refine_Exon_Conservation: ['Exonic Region Conservation', 'conserved if exons contain GERP elements with RS score >50% background (P<0.05), or not'],
  gene_list_refine_Trait_vs_Cell_Enrichment: ['Trait-Cell Enrichment', 'associated with enriched trait-cell pairs, or not'],
  gene_list_refine_eQT_mRNA_Coexpression: ['mRNA eQTL Co-expression ', 'co-expressed with eQTL-linked mRNA (FDR<0.05), or not'],
  gene_list_refine_Dynamic_Expression: ['Dynamic Expression', 'dynamically expression in FANTOM5 sample series (FDR<0.05, edgeR), or not'],
  gene_list_table_GeneID: ['Gene ID', 'FANTOM CAT gene ID'],
  gene_list_table_Gene_Name: ['Name', 'FANTOM CAT gene name'],
  gene_list_table_Gene_Category: ['Category', 'FANTOM CAT gene category, based on gene class and DHS type'],
  gene_list_table_Gene_Class: ['Class', 'FANTOM CAT gene class, based coding potential and genomic context'],
  gene_list_table_DHS_Support: ['DHS Support Type', 'type of Roadmap DHS support at its strongest TSS'],
  gene_list_table_Alias_Symbol: ['Aliases and Symbols', 'aliases and symbols from HGNC'],
  gene_list_table_TIR_Conservation: ['Transcription Initation Region Conservation', 'shows RS score if TIR contains GERP elements with RS score >50% background (P<0.05), or empty'],
  gene_list_table_Exon_Conservation: ['Exonic Region Conservation', 'shows RS score if exon contains GERP elements with RS score >50% background (P<0.05), or empty'],
  gene_list_table_Trait_vs_Cell_Enrichment: ['Trait-Cell Enrichment', 'shows FDR of the Fisher\'s extact test if it associates with enriched trait-cell pairs, or empty'],
  gene_list_table_eQT_mRNA_Coexpression: ['mRNA eQTL Co-expression ', 'shows FDR of the Spearman Correlation if it co-expressed with eQTL-linked mRNA (FDR<0.05), or empty'],
  gene_list_table_Dynamic_Expression: ['Dynamic Expression', 'shows FDR of edgeR if it is dynamically expressed (FDR<0.05), or empty'],
  gene_indiv_basic_info_head: ['Basic Information', 'basic information including info from HGNC, GENCODEv19 and FANTOM CAT '],
  gene_indiv_basic_info_official_name: ['Basic Information', 'approved names from HGNC'],
  gene_indiv_basic_info_official_symbol: ['Basic Information', 'approved symbols from HGNC'],
  gene_indiv_basic_info_CAT_class: ['Basic Information', 'FANTOM CAT gene class, based coding potential and genomic context'],
  gene_indiv_basic_info_CAT_category: ['Basic Information', 'FANTOM CAT gene category, based on gene class and DHS type'],
  gene_indiv_basic_info_GENCODE_biotype: ['Basic Information', '"biotypes" as annotated in GENCODEv19'],
  gene_indiv_basic_info_roadmap_DHS: ['Basic Information', 'type of Roadmap DHS support at its strongest TSS'],
  gene_indiv_basic_info_external_ID: ['Basic Information', 'external ID and links from HGNC'],
  gene_indiv_cons_head: ['Conservation', 'conservation based on overlap with GERP elements'],
  gene_indiv_cons_TIR: ['Transcription Initation Region', 'conservation data of transcription initation region'],
  gene_indiv_cons_exon: ['Exonic Region', 'conservation data of exonic region'],
  gene_indiv_cons_conservation: ['Conservation', 'defined as conserved or not based on maximum RS score compared against background '],
  gene_indiv_cons_max_RS_score: ['Maximum RS Score ', 'maximum RS score of the overlapping GERP elements'],
  gene_indiv_cons_p_val: ['Binomial P-value', 'p-value of binomial test of whether maximum RS score is higher than median of the background in 100x shuffles '],
  gene_indiv_cons_pct: ['Percentile of Maximum RS Score', 'percentile of maximum RS score in 100x shuffles into background '],
  gene_indiv_zenbu_head: ['Zenbu Genome Browser', 'multiple views on Zenbu focus on various aspects of FANTOM CAT '],
  gene_indiv_zenbu_minimal: ['Minimal Zenbu View', 'displays minimal information, including CAGE signal, gene, transcripts and conservation'],
  gene_indiv_zenbu_main: ['Main Zenbu View', 'displays essential information, e.g. expression, conservation and SNPs and more'],
  gene_indiv_zenbu_expression: ['Expression Zenbu View', 'focus on expression profile, e.g. expression levels, sample ontology enrichment, dynamic expression and more'],
  gene_indiv_zenbu_assembly: ['Assembly Zenbu View', 'focus on assembly information, e.g. source transcripts, FANTOM CAT at other cutoffs and more '],
  gene_indiv_zenbu_epigenome: ['Epigenome Zenbu View', 'focus on epigenomic information, e.g. Roadmap chromHMM state and histone marks'],
  gene_indiv_zenbu_evolution: ['Evolution Zenbu View', 'focus on evolutionary information, e.g. RS score, orthlogous expression in other species'],
  gene_indiv_zenbu_extended: ['Extended Zenbu View', 'displays integrated information and users can turn on extra tracks for elaborated information'],
  gene_indiv_ontology_head: ['Associated Sample Ontology', 'association of genes to a cell type (as sample ontology) were tested using Mann-whitney Rank sum test'],
  gene_indiv_ontology_name: ['Ontology Name', 'description of the sample ontology'],
  gene_indiv_ontology_ID: ['Ontology ID', 'ID of the sample onotlogy'],
  gene_indiv_ontology_fold: ['Fold of Mean CPM', 'fold difference of the mean CPM of samples annotated with the onology versus those that are not'],
  gene_indiv_ontology_p_val: ['Mann Whitney Rank Sum Test P-value', 'p-value of the Mann Whitney rank sum test on the CPM of samples annotated with the onology versus those that are not'],
  gene_indiv_ontology_frac: ['Fraction Expressed', 'fraction of samples annotated with the onology is expressed (>0.01 CPM)'],
  gene_indiv_ontology_mean_cpm: ['Mean CPM', 'mean CPM of samples annotated with the onology'],
  gene_indiv_traitcell_head: ['Trait-Cell Enrichment', 'association with trait and cell (sample ontolgy) pairs that are significantly enriched in Fisher\'s exact test'],
  gene_indiv_traitcell_traitID: ['Trait ID', 'ID of the trait (PICS for fine-mapped and others GWAS)'],
  gene_indiv_traitcell_traitname: ['Trait name', 'description of the trait'],
  gene_indiv_traitcell_ontologyID: ['Ontology ID', 'ID of the sample onotlogy'],
  gene_indiv_traitcell_ontologyname: ['Ontology Name', 'description of the sample ontology'],
  gene_indiv_traitcell_fdr: ['FDR of Trait-Cell Enrichment', 'BH adjusted P-value (FDR) of Fisher\'s exact test of trait-associated genes in cell-associated genes '],
  gene_indiv_traitcell_odds_ratio: ['Odds Ratio of Trait-Cell Enrichment', 'odds ratio of Fisher\'s exact test of trait-associated genes in cell-associated genes '],
  gene_indiv_traitcell_literature: ['Curated Literature Support', 'manually curated literature support of the biological plausibility the enriched trait-cell pair'],
  gene_indiv_transcript_coding_head: ['Transcript Coding Potential', 'Coding potential of transcript based on CPAT, RNACode, phyloCSF and Riboseq'],
  gene_indiv_transcript_coding_transcripID: ['Transcript ID', 'ID of the transcript'],
  gene_indiv_transcript_coding_CPAT_call: ['CPAT coding', 'Called as coding or not, based on CPAT score'],
  gene_indiv_transcript_coding_CPAT_score: ['CPAT score', 'CPAT score, called as coding if >0.363'],
  gene_indiv_transcript_coding_RNACode_coding: ['RNACode coding', 'Contains an ORF that is called as coding by RNACode or not'],
  gene_indiv_transcript_coding_phyloCSF_coding: ['phyloCSF coding', 'Contains an ORF that is called as coding by phyloCSF or not'],
  gene_indiv_transcript_coding_riboseq_coding: ['Riboseq coding', 'Contains an ORF that is called as coding by riboseq data in sORFs.org or not'],
  gene_indiv_transcript_coding_TIEScore: ['TIEScore', 'TIEScore of the transcript'],
  gene_indiv_transcript_coding_ORF_num: ['Coding ORF num', 'Number of ORFs that are called as coding'],
  gene_indiv_transcript_coding_ORF_length: ['Max ORF length', 'Length of its longest ORFs in nt'],
  gene_indiv_transcript_coding_exon_length: ['Exon length', 'Total length of all exons of the transcript'],
  gene_indiv_transcript_coding_exon_num: ['Exon num', 'Number of exons the transcript has'],
  gene_indiv_transcript_coding_expr_level: ['Expression level', 'Expression level of the transcript, represented by 75 percentile of its FPKM in 107 RNA-seq libraries estimated using Sailfish'],
  gene_indiv_transcript_coding_expr_rank: ['Expression rank within gene', 'Ranking within its parental based on expression level'],
  gene_indiv_transcript_coding_splicing: ['Splicing index', 'Splicing index of the transcript, defined as the average of the sum of the ratio of junction spanning reads to spliced reads of each of its introns across 107 RNA-seq libraries'],
  gene_indiv_trait_head: ['Associated Traits', 'association of genes to trait based on their overlap with GWAS and fine-mapped SNPs'],
  gene_indiv_trait_traitID: ['Trait ID', 'ID of the trait (PICS for fine-mapped and others GWAS)'],
  gene_indiv_trait_traitname: ['Trait name', 'description of the trait'],
  gene_indiv_trait_num_snp: ['Number of SNPs', 'number of associated SNPs overlap with gene'],
  gene_indiv_trait_p_val: ['Best P-value of SNPs', 'best P-value of the associated SNP from their original literature (or zero if fine-mapped)'],
  gene_indiv_eQTL_head: ['Co-expressed eQTL-linked mRNA', 'overlap with eQTL SNPs of mRNAs and significantly co-expressed with the mRNAs'],
  gene_indiv_eQTL_mRNAID: ['mRNA Gene ID', 'gene ID of the eQTL-linked and co-expressed mRNA'],
  gene_indiv_eQTL_mRNAName: ['mRNA Gene Name', 'gene name of the eQTL-linked and co-expressed mRNA'],
  gene_indiv_eQTL_orientation: ['Orientation', 'sense or antisense to the eQTL-linked and co-expressed mRNA'],
  gene_indiv_eQTL_corr: ['Spearman Correlation Rho', 'spearman correlation (rho) of its expression profile with the  eQTL-linked mRNA in 1,829 FANTOM5 samples'],
  gene_indiv_eQTL_dist: ['Distance', 'distance between its strongest TSS to that of the eQTL-linked mRNA'],
  gene_indiv_eQTL_fdr: ['FDR of Spearman Correlation', 'FDR of spearman correlation of its expression profile with the eQTL-linked mRNA in 1,829 FANTOM5 samples'],
  gene_indiv_dynamic_head: ['Dynamic Expression', 'dynamically expression in FANTOM5 sample series (FDR<0.05, edgeR, comparing to time point 0 or untreated sample)'],
  gene_indiv_dynamic_seriesname: ['Expression Series Name', 'description of the sample series'],
  gene_indiv_dynamic_seriesID: ['Expression Series ID', 'ID of the sample series'],
  gene_indiv_dynamic_maxFC: ['Maximum Fold Change', 'maximum (absolute) fold change of all comparisons within a series'],
  gene_indiv_dynamic_fdr: ['Best FDR', 'FDR of the comparisons within a series with maximum fold change'],
  trait_list_refine_Trait_Type: ['Types of Traits', 'GWAS traits organized as disease ontology (DOID), human phenotype ontology (HP), Medical Subject Headings (MeSH) or experiment factor ontology (EFO), and fine-mapped traits as Probabilistic Identification of Causal SNPs (PICS)'],
  trait_list_refine_SNPs: ['Types of SNPs', 'trait associated SNPs are GWAS lead / proxy or fine-mapped '],
  trait_list_refine_Enriched_Ontologies: ['Trait-Cell Enrichment', 'with enriched sample ontologies  (FDR<0.05, Fisher\'s exact test), or not'],
  trait_list_table_traitID: ['Trait ID', 'ID of the trait (PICS for fine-mapped and others GWAS)'],
  trait_list_table_traitname: ['Trait name', 'name of the trait'],
  trait_list_table_description: ['Description', 'description of the trait, from GWASdb'],
  trait_list_table_lead_GWAS_SNP: ['Number of Lead GWAS SNPs', 'number of lead GWAS SNPs of the trait overlap with gene'],
  trait_list_table_proxy_GWAS_SNP: ['Number of Proxy GWAS SNPs', 'number of proxy GWAS SNPs of the trait overlap with gene'],
  trait_list_table_fina_mapped_SNP: ['Number of fine-mapped SNPs', 'number of fine-mapped (PICS) SNPs of the trait overlap with gene'],
  trait_list_table_associated_genes: ['Number of Associated Genes', 'number of genes assoicated with the trait, based on overlaping with SNPs'],
  trait_list_table_enriched_ontologies: ['Number of Enriched Ontologies', 'number of sample ontologies enriched with the trait (FDR<0.05, Fisher\'s exact test)'],
  trait_indiv_refine_Category: ['FANTOM CAT Gene Category', 'FANTOM CAT gene category, based on gene class and DHS type'],
  trait_indiv_refine_Class: ['FANTOM CAT Gene Class', 'FANTOM CAT gene class, based coding potential and genomic context (about)'],
  trait_indiv_original_literature_head: ['Traits in Originating Literature ', 'actual text describing the texts in their original genome-wide association studies '],
  trait_indiv_gene_table_head: ['Genes Associated with the Trait ', 'list of genes assoicated with the trait, based on overlaping with SNPs, can be filtered based on its enriched ontolgies'],
  trait_indiv_gene_table_GeneID: ['Gene ID', 'FANTOM CAT gene ID'],
  trait_indiv_gene_table_Gene_Name: ['Name', 'FANTOM CAT gene name'],
  trait_indiv_gene_table_Gene_Category: ['Category', 'FANTOM CAT gene category, based on gene class and DHS type'],
  trait_indiv_gene_table_Gene_Class: ['Class', 'FANTOM CAT gene class, based coding potential and genomic context'],
  trait_indiv_gene_table_p_val: ['Best P-value of SNPs', 'best P-value of the associated SNP from their original literature (or zero if fine-mapped)'],
  trait_indiv_ontology_table_head: ['Sample Ontologies Enriched in the Trait ', 'enrichment based on Fisher\'s exact test on trait-associated genes vs cell-associated genes, enriched if FDR<0.05'],
  trait_indiv_ontology_table_ontologyID: ['Ontology ID', 'ID of the sample onotlogy'],
  trait_indiv_ontology_table_ontologyname: ['Ontology Name', 'description of the sample ontology'],
  trait_indiv_ontology_table_numGene: ['Number of Genes', 'number of genes associated with both the trait and the sample ontology'],
  trait_indiv_ontology_table_fdr: ['FDR of Trait-Cell Enrichment', 'BH adjusted P-value (FDR) of Fisher\'s exact test of trait-associated genes in cell-associated genes '],
  trait_indiv_ontology_table_odds_ratio: ['Odds Ratio of Trait-Cell Enrichment', 'odds ratio of Fisher\'s exact test of trait-associated genes in cell-associated genes '],
  trait_indiv_ontology_table_literature: ['Curated Literature Support', 'manually curated literature support of the biological plausibility the enriched trait-cell pair'],
  ontology_list_refine_Ontology_Type: ['Type of Sample Ontology', 'sample ontology for cell types (CL) or anatomy (UBERON)'],
  ontology_list_refine_Enriched_Traits: ['Trait-Cell Enrichment', 'with enriched traits  (FDR<0.05, Fisher\'s exact test), or not'],
  ontology_list_table_ontologyID: ['Ontology ID', 'ID of the sample onotlogy'],
  ontology_list_table_ontologyname: ['Ontology Name', 'official name of the sample ontology'],
  ontology_list_table_description: ['Description', 'description of the sample ontology'],
  ontology_list_table_samples: ['Number of Samples', 'number of FANTOM5 samples were annotated with the sample ontology'],
  ontology_list_table_associated_genes: ['Number of Associated Genes', 'number of genes assoicated with the sample ontology, based on Mann-Whitney rank sum test (P<0.05)'],
  ontology_list_table_enriched_traits: ['Number of Enriched Traits', 'number of traits enriched with the sample ontology (FDR<0.05, Fisher\'s exact test)'],
  ontology_indiv_refine_Category: ['FANTOM CAT Gene Category', 'FANTOM CAT gene category, based on gene class and DHS type'],
  ontology_indiv_refine_Class: ['FANTOM CAT Gene Class', 'FANTOM CAT gene class, based coding potential and genomic context (about)'],
  ontology_indiv_samples_head: ['FANTOM5 Samples', 'FANTOM5 samples annotated with the sample onotology'],
  ontology_indiv_gene_table_head: ['Genes Associated with the Sample Ontology ', 'list of genes assoicated with the sample ontology, based on  Mann Whitney rank sum test on the CPM of samples annotated with the onology versus those that are not'],
  ontology_indiv_gene_table_GeneID: ['Gene ID', 'FANTOM CAT gene ID'],
  ontology_indiv_gene_table_Gene_Name: ['Name', 'FANTOM CAT gene name'],
  ontology_indiv_gene_table_Gene_Category: ['Category', 'FANTOM CAT gene category, based on gene class and DHS type'],
  ontology_indiv_gene_table_Gene_Class: ['Class', 'FANTOM CAT gene class, based coding potential and genomic context'],
  ontology_indiv_gene_table_p_val: ['Mann Whitney Rank Sum Test P-value', 'p-value of the Mann Whitney rank sum test on the CPM of samples annotated with the onology versus those that are not'],
  ontology_indiv_gene_table_fold: ['Fold of Mean CPM', 'fold difference of the mean CPM of samples annotated with the onology versus those that are not'],
  ontology_indiv_trait_table_head: ['Traits Enriched in the Sample Ontology', 'enrichment based on Fisher\'s exact test on trait-associated genes vs cell-associated genes, enriched if FDR<0.05'],
  ontology_indiv_trait_table_traitID: ['Trait ID', 'ID of the trait (PICS for fine-mapped and others GWAS)'],
  ontology_indiv_trait_table_traitname: ['Trait name', 'name of the trait'],
  ontology_indiv_trait_table_numGene: ['Number of Genes', 'number of genes associated with both the trait and the sample ontology'],
  ontology_indiv_trait_table_fdr: ['FDR of Trait-Cell Enrichment', 'BH adjusted P-value (FDR) of Fisher\'s exact test of trait-associated genes in cell-associated genes '],
  ontology_indiv_trait_table_odds_ratio: ['Odds Ratio of Trait-Cell Enrichment', 'odds ratio of Fisher\'s exact test of trait-associated genes in cell-associated genes '],
  ontology_indiv_trait_table_literature: ['Curated Literature Support', 'manually curated literature support of the biological plausibility the enriched trait-cell pair']
};

Object.keys(strings).forEach(k => {
  strings[k] = popupText(strings[k][0], strings[k][1]);
});
