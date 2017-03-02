import controller from './trait.controller';
import datapackageBase from './datapackage.json!';

const datapackage = $routeParams => {
  const id = $routeParams.id.replace(':', '_');
  datapackageBase.resources[0] = `../../data/gene_json/${$routeParams.id}.json`;
  return {
    ...datapackageBase,
    resources: [
      `../../data/trait_json/${id}.json`,
      `../../data/trait_tsv/${id}.tsv`
    ]
  };
};

export default {
  title: $routeParams => $routeParams.id,
  controller,
  controllerAs: '$ctrl',
  templateUrl: 'components/trait/trait.html',
  datapackageUrl: 'components/trait/datapackage.json',
  datapackage
};
