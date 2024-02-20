import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectEditMode,
  selectAnsiblePlaybookServices,
  selectColumns,
} from '../ApplicationDefinitionImportSelectors';

import { applicationDefinitionImportConfData_1 } from '../__fixtures__/applicationDefinitionImportConfData_1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    applicationDefinitionImportConf: obj,
  },
});

const fixtures = {
  'should return editMode from applicationDefinitionImportConfData_1 fixtures': () =>
    selectEditMode(stateFactory(applicationDefinitionImportConfData_1)),
  'should return services from applicationDefinitionImportConfData_1 fixtures': () =>
    selectAnsiblePlaybookServices(
      stateFactory(applicationDefinitionImportConfData_1)
    ),
  'should return columns from applicationDefinitionImportConfData_1 fixtures': () =>
    selectColumns(stateFactory(applicationDefinitionImportConfData_1)),
};

describe('ApplicationDefinitionImportSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
