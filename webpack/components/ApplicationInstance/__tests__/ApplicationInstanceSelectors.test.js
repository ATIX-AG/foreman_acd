import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectShowAlertModal,
  selectAlertModalText,
  selectAlertModalTitle,
  selectEditMode,
  selectAppDefinition,
  selectHosts,
  selectColumns,
  selectHiddenForemanParameterTypes,
  selectServices,
  selectParametersData,
  selectAnsibleVarsAll,
  selectParamEditMode,
} from '../ApplicationInstanceSelectors';

import { applicationInstanceConfData_1 } from '../__fixtures__/applicationInstanceConfData_1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    applicationInstanceConf: obj,
  },
});

const fixtures = {
  'should return showAlertModal from applicationInstanceConfData_1 fixtures': () =>
    selectShowAlertModal(stateFactory(applicationInstanceConfData_1)),
  'should return alertModalText from applicationInstanceConfData_1 fixtures': () =>
    selectAlertModalText(stateFactory(applicationInstanceConfData_1)),
  'should return alertModalTitle from applicationInstanceConfData_1 fixtures': () =>
    selectAlertModalTitle(stateFactory(applicationInstanceConfData_1)),
  'should return editMode from applicationInstanceConfData_1 fixtures': () =>
    selectEditMode(stateFactory(applicationInstanceConfData_1)),
  'should return appDefinition from applicationInstanceConfData_1 fixtures': () =>
    selectAppDefinition(stateFactory(applicationInstanceConfData_1)),
  'should return hosts from applicationInstanceConfData_1 fixtures': () =>
    selectHosts(stateFactory(applicationInstanceConfData_1)),
  'should return columns from applicationInstanceConfData_1 fixtures': () =>
    selectColumns(stateFactory(applicationInstanceConfData_1)),
  'should return hiddenForemanParameterTypes from applicationInstanceConfData_1 fixtures': () =>
    selectHiddenForemanParameterTypes(
      stateFactory(applicationInstanceConfData_1)
    ),
  'should return services from applicationInstanceConfData_1 fixtures': () =>
    selectServices(stateFactory(applicationInstanceConfData_1)),
  'should return parametersData from applicationInstanceConfData_1 fixtures': () =>
    selectParametersData(stateFactory(applicationInstanceConfData_1)),
  'should return ansibleVarsAll from applicationInstanceConfData_1 fixtures': () =>
    selectAnsibleVarsAll(stateFactory(applicationInstanceConfData_1)),
  'should return ParamEditMode from applicationInstanceConfData_1 fixtures': () =>
    selectParamEditMode(stateFactory(applicationInstanceConfData_1)),
};

describe('ApplicationInstanceSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
