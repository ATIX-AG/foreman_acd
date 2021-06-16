import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ApplicationDefinition from '../ApplicationDefinition';

const noop = () => {};

const fixtures = {
  'should render application definition': {
    data: {
      location: "Default Location",
      organization: "Default Organization",
      hostgroups: [],
      foremanDataUrl: "url/does/not/exist",
      ansibleDataUrl: "url/does/not/exist",
      services: [],
      ansibleVarsAll: [],
    },
    closeAlertModal: noop,
    loadAnsibleData: noop,
    initApplicationDefinition: noop,
    addApplicationDefinitionService: noop,
  },
};

describe('ApplicationDefinition', () =>
  testComponentSnapshotsWithFixtures(ApplicationDefinition, fixtures));
