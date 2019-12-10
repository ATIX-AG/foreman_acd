import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import DeleteParameter from '../DeleteParameter';

const noop = () => {};

const fixtures = {
  'should render delete parameter': {
    hidden: false,
    disabled: false,
    onDeleteParameter: noop,
    additionalData: {},
  },
  'should render hidden button': {
    hidden: true,
    disabled: false,
    onDeleteParameter: noop,
    additionalData: {},
  },
  'should render disabled button': {
    hidden: false,
    disabled: true,
    onDeleteParameter: noop,
    additionalData: {},
  },
};

describe('DeleteParameter', () =>
  testComponentSnapshotsWithFixtures(DeleteParameter, fixtures));
