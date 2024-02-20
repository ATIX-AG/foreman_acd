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

import { applicationInstanceConfData1 } from '../__fixtures__/applicationInstanceConfData1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    applicationInstanceConf: obj,
  },
});

const fixtures = {
  'should return showAlertModal from applicationInstanceConfData1 fixtures': () =>
    selectShowAlertModal(stateFactory(applicationInstanceConfData1)),
  'should return alertModalText from applicationInstanceConfData1 fixtures': () =>
    selectAlertModalText(stateFactory(applicationInstanceConfData1)),
  'should return alertModalTitle from applicationInstanceConfData1 fixtures': () =>
    selectAlertModalTitle(stateFactory(applicationInstanceConfData1)),
  'should return editMode from applicationInstanceConfData1 fixtures': () =>
    selectEditMode(stateFactory(applicationInstanceConfData1)),
  'should return appDefinition from applicationInstanceConfData1 fixtures': () =>
    selectAppDefinition(stateFactory(applicationInstanceConfData1)),
  'should return hosts from applicationInstanceConfData1 fixtures': () =>
    selectHosts(stateFactory(applicationInstanceConfData1)),
  'should return columns from applicationInstanceConfData1 fixtures': () =>
    selectColumns(stateFactory(applicationInstanceConfData1)),
  'should return hiddenForemanParameterTypes from applicationInstanceConfData1 fixtures': () =>
    selectHiddenForemanParameterTypes(
      stateFactory(applicationInstanceConfData1)
    ),
  'should return services from applicationInstanceConfData1 fixtures': () =>
    selectServices(stateFactory(applicationInstanceConfData1)),
  'should return parametersData from applicationInstanceConfData1 fixtures': () =>
    selectParametersData(stateFactory(applicationInstanceConfData1)),
  'should return ansibleVarsAll from applicationInstanceConfData1 fixtures': () =>
    selectAnsibleVarsAll(stateFactory(applicationInstanceConfData1)),
  'should return ParamEditMode from applicationInstanceConfData1 fixtures': () =>
    selectParamEditMode(stateFactory(applicationInstanceConfData1)),
};

describe('ApplicationInstanceSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
