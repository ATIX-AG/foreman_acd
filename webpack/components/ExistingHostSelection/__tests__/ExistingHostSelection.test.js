import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ExistingHostSelection from '../ExistingHostSelection';

const noop = () => {};

const fixtures = {
  'should render existing host selection': {
    location: 'Default Location',
    organization: 'Default Organization',
    services: [],
    allHosts: [],
    initExistingHostSelection: noop,
    loadHostsOfHostgroup: noop,
  },
};

describe('ExistingHostSelection', () =>
  testComponentSnapshotsWithFixtures(ExistingHostSelection, fixtures));
