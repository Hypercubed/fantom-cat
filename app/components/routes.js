/* eslint camelcase: 0 */

import angular from 'angular';

import 'common/styles/animation.css!';
import 'common/styles/common.less!';

import grid from 'common/services/grid/grid';

import aboutHTML from 'components/about/about.md!md';
import errorHTML from 'components/error/error.html!text';

import 'angular-json-tree';
import 'angular-json-tree/dist/angular-json-tree.css!';

import facets from 'common/services/facets/facets';

import genesRoute from './genes/genes.route';
import geneRoute from './gene/gene.route';

import ontologiesRoute from './ontologies/ontologies.route';
import ontologyRoute from './ontology/ontology.route';

import traitsRoute from './traits/traits.route';
import traitRoute from './trait/trait.route';

import homeComponent from './home/home.component';

import {strings} from './strings';

configRoutes.$inject = ['$routeProvider'];
function configRoutes ($routeProvider) {
  $routeProvider
  .when('/about', {
    template: aboutHTML
  })
  .when('/error', {
    template: errorHTML
  })
  .when('/404', {
    template: errorHTML
  })
  .when('/', {
    title: 'FANTOM CAT',
    template: '<home></home>'
  })
  .when('/genes', genesRoute)
  .when('/genes/:id', geneRoute)

  .when('/ontologies', ontologiesRoute)
  .when('/ontologies/:id', ontologyRoute)

  .when('/traits', traitsRoute)
  .when('/traits/:id', traitRoute)

  .otherwise({redirectTo: '/'});
}

popups.$inject = ['$rootScope'];
function popups ($rootScope) {
  $rootScope.strings = strings;
}

const routes = angular
  .module('routes', [
    grid,
    'ui.grid.exporter',
    facets,
    'angular-json-tree'
  ])
  // .component('facet', facetComponent)
  .component('home', homeComponent)
  .config(configRoutes)
  .run(popups)
  .constant('strings', strings)
  .name;

export default routes;
