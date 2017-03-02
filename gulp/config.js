import pkg from '../package.json';

export default {
  deploy: {
    ghPages: {
      /* none */
    }
  },
  template: {
    version: pkg.version,
    title: 'FANTOM CAT',
    webcomponents: false
  }
};
