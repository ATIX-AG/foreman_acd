import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import DeleteTableEntry from '../DeleteTableEntry';

const noop = () => {};

const fixtures = {
  'should render delete parameter': {
    hidden: false,
    disabled: false,
    onDeleteTableEntry: noop,
    additionalData: {},
  },
  'should render hidden button': {
    hidden: true,
    disabled: false,
    onDeleteTableEntry: noop,
    additionalData: {},
  },
  'should render disabled button': {
    hidden: false,
    disabled: true,
    onDeleteTableEntry: noop,
    additionalData: {},
  },
};

describe('DeleteTableEntry', () =>
  testComponentSnapshotsWithFixtures(DeleteTableEntry, fixtures));
