import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectEditMode,
  selectAnsiblePlaybook,
  selectServices,
  selectColumns,
  selectParametersData,
  selectAnsibleVarsAll,
  selectParamEditMode,
} from '../ApplicationDefinitionSelectors';

import {
  applicationDefinitionConfData_1,
} from '../__fixtures__/applicationDefinitionConfData_1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    applicationDefinitionConf: obj,
  },
});

const fixtures = {
  'should return editMode from applicationDefinitionConfData_1 fixtures': () =>
    selectEditMode(stateFactory(applicationDefinitionConfData_1)),
  'should return ansiblePlaybook from applicationDefinitionConfData_1 fixtures': () =>
    selectAnsiblePlaybook(stateFactory(applicationDefinitionConfData_1)),
  'should return services from applicationDefinitionConfData_1 fixtures': () =>
    selectServices(stateFactory(applicationDefinitionConfData_1)),
  'should return parametersData from applicationDefinitionConfData_1 fixtures': () =>
    selectParametersData(stateFactory(applicationDefinitionConfData_1)),
  'should return columns from applicationDefinitionConfData_1 fixtures': () =>
    selectColumns(stateFactory(applicationDefinitionConfData_1)),
  'should return ansibleVarsAll from applicationDefinitionConfData_1 fixtures': () =>
    selectAnsibleVarsAll(stateFactory(applicationDefinitionConfData_1)),
  'should return ParamEditMode from applicationDefinitionConfData_1 fixtures': () =>
    selectParamEditMode(stateFactory(applicationDefinitionConfData_1)),
};

describe('ApplicationDefinitionSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
