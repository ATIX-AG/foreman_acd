import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import EditTableEntry from '../EditTableEntry';

const noop = () => {};

const fixtures = {
  'should render edit table entry': {
    hidden: false,
    disabled: false,
    handleLocking: false,
    onEditTableEntry: noop,
    additionalData: {},
  },
  'should render hidden button': {
    hidden: true,
    disabled: false,
    handleLocking: false,
    onEditTableEntry: noop,
    additionalData: {},
  },
  'should render disabled button': {
    hidden: false,
    disabled: true,
    handleLocking: false,
    onEditTableEntry: noop,
    additionalData: {},
  },
  'should render locked button': {
    hidden: false,
    disabled: false,
    handleLocking: true,
    onEditTableEntry: noop,
    additionalData: { rowData: { locked: true } },
  },
  'should render locked and disabled button': {
    hidden: false,
    disabled: true,
    handleLocking: true,
    onEditTableEntry: noop,
    additionalData: { rowData: { locked: true } },
  },
  'should render hidde, locked and disabled button': {
    hidden: true,
    disabled: true,
    handleLocking: true,
    onEditTableEntry: noop,
    additionalData: { rowData: { locked: true } },
  },
};

describe('EditTableEntry', () =>
  testComponentSnapshotsWithFixtures(EditTableEntry, fixtures));
