import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import AddTableEntry from '../AddTableEntry';

const noop = () => {};

const fixtures = {
  'should render add parameter': {
    hidden: false,
    disabled: false,
    onAddTableEntry: noop,
  },
  'should render hidden button': {
    hidden: true,
    disabled: false,
    onAddTableEntry: noop,
  },
  'should render disabled button': {
    hidden: false,
    disabled: true,
    onAddTableEntry: noop,
  },
};

describe('AddTableEntry', () =>
  testComponentSnapshotsWithFixtures(AddTableEntry, fixtures));
