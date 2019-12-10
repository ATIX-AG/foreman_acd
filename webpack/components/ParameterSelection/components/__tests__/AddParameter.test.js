import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import AddParameter from '../AddParameter';

const noop = () => {};

const fixtures = {
  'should render add parameter': {
    hidden: false,
    disabled: false,
    onAddParameter: noop,
  },
  'should render hidden button': {
    hidden: true,
    disabled: false,
    onAddParameter: noop,
  },
  'should render disabled button': {
    hidden: false,
    disabled: true,
    onAddParameter: noop,
  },
};

describe('AddParameter', () =>
  testComponentSnapshotsWithFixtures(AddParameter, fixtures));
