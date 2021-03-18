import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import LockTableEntry from '../LockTableEntry';

const noop = () => {};

const fixtures = {
  'should render unlock table entry': {
    hidden: false,
    disabled: false,
    onLockTableEntry: noop,
    additionalData: { rowData: { locked: false } },
  },
  'should render locked table entry': {
    hidden: false,
    disabled: false,
    onLockTableEntry: noop,
    additionalData: { rowData: { locked: true } },
  },
  'should render hidden button': {
    hidden: true,
    disabled: false,
    onLockTableEntry: noop,
    additionalData: {},
  },
  'should render disabled button': {
    hidden: false,
    disabled: true,
    onLockTableEntry: noop,
    additionalData: { rowData: { locked: false } },
  },
};

describe('LockTableEntry', () =>
  testComponentSnapshotsWithFixtures(LockTableEntry, fixtures));
