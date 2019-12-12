import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import RailsData from '../RailsData';

const noop = () => {};

const fixtures = {
  'should render rails data input field': {
    view: 'nice_view',
    parameter: 'nice_param',
    value: 'nice_value',
  },
};

describe('RailsData', () =>
  testComponentSnapshotsWithFixtures(RailsData, fixtures));
