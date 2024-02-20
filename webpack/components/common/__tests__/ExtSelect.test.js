import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ExtSelect from '../ExtSelect';

const noop = () => {};

const fixtures = {
  'should render selection field': {
    hidden: false,
    editable: false,
    viewText: '',
    selectValue: '1',
    onChange: noop,
    options: { first: 'first', second: 'second' },
    additionalData: { moreData: 'moooore' },
  },
  'should render hidden selection field': {
    hidden: true,
    editable: false,
    viewText: '',
    selectValue: null,
    onChange: noop,
    options: {},
    additionalData: {},
  },
  'should render disabled button': {
    hidden: false,
    editable: true,
    viewText: 'Awesome Text',
    selectValue: '0',
    onChange: noop,
    options: { first: 'first', second: 'second' },
    additionalData: {},
  },
};

describe('ExtSelect', () =>
  testComponentSnapshotsWithFixtures(ExtSelect, fixtures));
