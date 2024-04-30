import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ParameterSelection from '../ParameterSelection';

import {
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
} from '../ParameterSelectionConstants';

const noop = () => {};

const baseFixtures = {
  loading: true,
  location: 'Default Location',
  organization: 'Default Organization',
  editMode: false,
  editModeCallback: noop,
  paramDataUrl: '/acd/ui_acd_fdata/__id__',
  paramType: '',
  data: {},
  initParameterSelection: noop,
  addParameter: noop,
  deleteParameter: noop,
  lockParameter: noop,
  activateEditParameter: noop,
  confirmEditParameter: noop,
  cancelEditParameter: noop,
  changeEditParameter: noop,
  sortParameter: noop,
  openParameterSelectionDialogBox: noop,
  closeParameterSelectionDialogBox: noop,
  loadParamData: noop,
};

const fixtures = {
  'should render loading': baseFixtures,

  'should render foreman parameter selection': {
    ...baseFixtures,
    ...{
      loading: false,
      paramType: PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
      data: {
        type: PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
        parameters: [],
        useDefaultValue: true,
        allowRowAdjustment: true,
        allowNameAdjustment: true,
        allowDescriptionAdjustment: true,
      },
    },
  },

  'should render ansible parameter selection': {
    ...baseFixtures,
    ...{
      loading: false,
      paramType: PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
      data: {
        type: PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
        parameters: [],
        useDefaultValue: false,
        allowRowAdjustment: true,
        allowNameAdjustment: true,
        allowDescriptionAdjustment: true,
      },
    },
  },
};

describe('ParameterSelection', () =>
  testComponentSnapshotsWithFixtures(ParameterSelection, fixtures));
