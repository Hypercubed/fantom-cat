import controller from './gene.controller';
import datapackageBase from './datapackage.json!';

const datapackage = $routeParams => {
  datapackageBase.resources[0] = `../../data/gene_json/${$routeParams.id}.json`;
  return {
    ...datapackageBase,
    resources: datapackageBase.resources.slice()
  };
};

export default {
  title: $routeParams => $routeParams.id,
  controller,
  controllerAs: 'page',
  templateUrl: 'components/gene/gene.html',
  datapackageUrl: 'components/gene/datapackage.json',
  datapackage
};
