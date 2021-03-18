import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import EasyHeaderFormatter from '../EasyHeaderFormatter';

const noop = () => {};

const value = 'Hallo Welt';
const data = {
  header: {
    label: 'MyLabel',
    props: 0
  }
}

const fixtures = {
  'should render add parameter': {
    value,
    column: data,
  },
};

describe('EasyHeaderFormatter', () =>
  testComponentSnapshotsWithFixtures(EasyHeaderFormatter, fixtures));
