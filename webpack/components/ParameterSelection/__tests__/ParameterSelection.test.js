import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ParameterSelection from '../ParameterSelection';

import {
  newDefinition,
  editDefinition,
  newInstance,
  editInstance,
} from '../__fixtures__/parameterSelection.fixtures'

jest.mock('foremanReact/components/common/forms/Select');

const noop = () => {};

const fixtures = {
  'should render newDefinition': {
    loading: false,
    data: newDefinition,
    error: { statusText: '', errorMsg: '' },
    initParameterSelection: noop,
    loadForemanData: noop,
  },
  'should render editDefinition': {
    loading: false,
    data: editDefinition,
    error: { statusText: '', errorMsg: '' },
    initParameterSelection: noop,
    loadForemanData: noop,
  },
  'should render newInstance': {
    loading: false,
    data: newInstance,
    error: { statusText: '', errorMsg: '' },
    initParameterSelection: noop,
    loadForemanData: noop,
  },
  'should render editInstance': {
    loading: false,
    data: editInstance,
    error: { statusText: '', errorMsg: '' },
    initParameterSelection: noop,
    loadForemanData: noop,
  },
};

describe('ParameterSelection', () =>
  testComponentSnapshotsWithFixtures(ParameterSelection, fixtures));
