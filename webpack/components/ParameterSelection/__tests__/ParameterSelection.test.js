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
    location: "Default Location",
    organization: "Default Organization",
    loadForemanDataUrl: "/acd/ui_acd_fdata/__id__",
    loading: false,
    data: newDefinition,
    error: { statusText: '', errorMsg: '' },
    initParameterSelection: noop,
    loadForemanData: noop,
    addParameter: noop,
    deleteParameter: noop,
  },
  'should render editDefinition': {
    location: "Default Location",
    organization: "Default Organization",
    loadForemanDataUrl: "/acd/ui_acd_fdata/__id__",
    loading: false,
    data: editDefinition,
    error: { statusText: '', errorMsg: '' },
    initParameterSelection: noop,
    loadForemanData: noop,
    addParameter: noop,
    deleteParameter: noop,
  },
  'should render newInstance': {
    location: "Default Location",
    organization: "Default Organization",
    loading: false,
    loadForemanDataUrl: "/acd/ui_acd_fdata/__id__",
    data: newInstance,
    error: { statusText: '', errorMsg: '' },
    initParameterSelection: noop,
    loadForemanData: noop,
    addParameter: noop,
    deleteParameter: noop,
  },
  'should render editInstance': {
    location: "Default Location",
    organization: "Default Organization",
    loading: false,
    loadForemanDataUrl: "/acd/ui_acd_fdata/__id__",
    data: editInstance,
    error: { statusText: '', errorMsg: '' },
    initParameterSelection: noop,
    loadForemanData: noop,
    addParameter: noop,
    deleteParameter: noop,
  },
};

describe('ParameterSelection', () =>
  testComponentSnapshotsWithFixtures(ParameterSelection, fixtures));
