/* global describe, beforeEach, it, cy, context */
/* eslint xo/filename-case: 0 */

describe('Project χ - lncRNA', () => {
  context('home', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('cy.should - assert that <title> is correct', () => {
      cy.title().should('include', 'FANTOM CAT');
      cy.get('home svg').find('circle')
        .should('have.length', 6);
    });
  });

  context('genes', () => {
    beforeEach(() => {
      cy.visit('/genes');
    });

    it('cy.should - have genes page', () => {
      cy.title().should('include', 'FANTOM CAT | Genes');
    });
  });

  context('gene', () => {
    beforeEach(() => {
      cy.visit('/genes/ENSGR0000225661.2');
    });

    it('cy.should - have gene page', () => {
      cy.title().should('include', 'ENSGR0000225661.2');
      cy.get('#charts > h1')
        .should('contain', 'RPL14P5')
        .should('contain', 'ENSGR0000225661.2');
    });
  });

  context('traits', () => {
    beforeEach(() => {
      cy.visit('/traits');
    });

    it('cy.should - have traits page', () => {
      cy.title().should('include', 'FANTOM CAT | Traits');
    });
  });

  context('trait', () => {
    beforeEach(() => {
      cy.visit('/traits/PICS:0012');
    });

    it('cy.should - have trait page', () => {
      cy.title().should('include', 'PICS:0012');
      cy.get('#charts > h1')
        .should('contain', 'Multiple sclerosis')
        .should('contain', 'PICS:0012');
    });
  });

  context('ontologies', () => {
    beforeEach(() => {
      cy.visit('/ontologies');
    });

    it('cy.should - have ontologies page', () => {
      cy.title().should('include', 'FANTOM CAT | Ontologies');
    });
  });

  context('ontology', () => {
    beforeEach(() => {
      cy.visit('/ontologies/UBERON:0002771');
    });

    it('cy.should - have ontology page', () => {
      cy.title().should('include', 'UBERON:0002771');
      cy.get('#charts > h1')
        .should('contain', 'middle temporal gyrus')
        .should('contain', 'UBERON:0002771');
    });
  });
});
