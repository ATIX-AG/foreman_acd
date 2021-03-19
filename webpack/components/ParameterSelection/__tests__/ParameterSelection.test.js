import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ParameterSelection from '../ParameterSelection';

import {
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
} from '../ParameterSelectionConstants';

const noop = () => {};

const fixtures = {
  'should render foreman parameter selection': {
    location: "Default Location",
    organization: "Default Organization",
    editModeCallback: noop,
    paramDataUrl: "/acd/ui_acd_fdata/__id__",
    paramType: PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
    data: {
      type: PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
      parameters: [],
      useDefaultValue: true,
      allowRowAdjustment: true,
      allowNameAdjustment: true,
      allowDescriptionAdjustment: true,
    },
    addParameter: noop,
    confirmEditParametre: noop,
    cancelEditParameter: noop,
    editModeCallback: noop,
    loadParamData: noop,
    initParameterSelection: noop,
  },

  'should render ansible parameter selection': {
    location: "Default Location",
    organization: "Default Organization",
    editModeCallback: noop,
    paramType: PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
    data: {
      type: PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
      parameters: [],
      useDefaultValue: false,
      allowRowAdjustment: true,
      allowNameAdjustment: true,
      allowDescriptionAdjustment: true,
    },
    addParameter: noop,
    confirmEditParametre: noop,
    cancelEditParameter: noop,
    editModeCallback: noop,
    loadParamData: noop,
    initParameterSelection: noop,
  }
};

describe('ParameterSelection', () =>
  testComponentSnapshotsWithFixtures(ParameterSelection, fixtures));
