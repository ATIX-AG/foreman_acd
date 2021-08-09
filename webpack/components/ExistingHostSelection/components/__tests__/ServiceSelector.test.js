import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ServiceSelector from '../ServiceSelector';

const noop = () => {};

const data = [
  { name: 'report 1', status: 'done' },
  { name: 'report 2', status: 'pending' }
];

const fixtures = {
  'should render the service selector': {
    hidden: false,
    label: 'Test Label',
    viewText: 'view service',
    selectValue: '1',
    onChange: noop,
    options: { first: 'first', second: 'second'},
    additionalData: { moreData: 'moooore' },
  },
  'should render the hidden service selector': {
    hidden: true,
    label: 'Test Label',
    viewText: 'view service',
    selectValue: '1',
    onChange: noop,
    options: { first: 'first', second: 'second'},
    additionalData: { },
  },
};

describe('ServiceSelector', () =>
  testComponentSnapshotsWithFixtures(ServiceSelector, fixtures));

