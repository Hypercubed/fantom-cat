import controller from './ontology.controller';
import datapackageBase from './datapackage.json!';

const datapackage = $routeParams => {
  const id = $routeParams.id.replace(':', '_');
  return {
    ...datapackageBase,
    resources: [
      `../../data/ontology_json/${id}.json`,
      `../../data/ontology_tsv/${id}.tsv`
    ]
  };
};

export default {
  title: $routeParams => $routeParams.id,
  controller,
  controllerAs: '$ctrl',
  templateUrl: 'components/ontology/ontology.html',
  datapackageUrl: 'components/ontology/datapackage.json',
  datapackage
};
