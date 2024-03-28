import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectShowAlertModal,
  selectAlertModalText,
  selectAlertModalTitle,
  selectEditMode,
  selectAnsiblePlaybook,
  selectServices,
  selectColumns,
  selectHiddenForemanParameterTypes,
  selectParametersData,
  selectAnsibleVarsAll,
  selectParamEditMode,
} from '../ApplicationDefinitionSelectors';

import { applicationDefinitionConfData1 } from '../__fixtures__/applicationDefinitionConfData1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    applicationDefinitionConf: obj,
  },
});

const fixtures = {
  'should return showAlertModal from applicationDefinitionConfData1 fixtures': () =>
    selectShowAlertModal(stateFactory(applicationDefinitionConfData1)),
  'should return alertModalText from applicationDefinitionConfData1 fixtures': () =>
    selectAlertModalText(stateFactory(applicationDefinitionConfData1)),
  'should return alertModalTitle from applicationDefinitionConfData1 fixtures': () =>
    selectAlertModalTitle(stateFactory(applicationDefinitionConfData1)),
  'should return editMode from applicationDefinitionConfData1 fixtures': () =>
    selectEditMode(stateFactory(applicationDefinitionConfData1)),
  'should return ansiblePlaybook from applicationDefinitionConfData1 fixtures': () =>
    selectAnsiblePlaybook(stateFactory(applicationDefinitionConfData1)),
  'should return services from applicationDefinitionConfData1 fixtures': () =>
    selectServices(stateFactory(applicationDefinitionConfData1)),
  'should return parametersData from applicationDefinitionConfData1 fixtures': () =>
    selectParametersData(stateFactory(applicationDefinitionConfData1)),
  'should return columns from applicationDefinitionConfData1 fixtures': () =>
    selectColumns(stateFactory(applicationDefinitionConfData1)),
  'should return hiddenForemanParameterTypes from applicationDefinitionConfData1 fixtures': () =>
    selectHiddenForemanParameterTypes(
      stateFactory(applicationDefinitionConfData1)
    ),
  'should return ansibleVarsAll from applicationDefinitionConfData1 fixtures': () =>
    selectAnsibleVarsAll(stateFactory(applicationDefinitionConfData1)),
  'should return ParamEditMode from applicationDefinitionConfData1 fixtures': () =>
    selectParamEditMode(stateFactory(applicationDefinitionConfData1)),
};

describe('ApplicationDefinitionSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
