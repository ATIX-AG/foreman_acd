import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ApplicationInstance from '../ApplicationInstance';

const noop = () => {};

const fixtures = {
  'should render application instance': {
    data: {
      location: 'Default Location',
      organization: 'Default Organization',
      appDefinition: {},
      hosts: [],
      ansibleVarsAll: [],
    },
    closeAlertModal: noop,
    loadApplicationDefinition: noop,
    initApplicationInstance: noop,
    addApplicationInstanceHost: noop,
  },
};

describe('ApplicationInstance', () =>
  testComponentSnapshotsWithFixtures(ApplicationInstance, fixtures));
