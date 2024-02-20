import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectEditMode,
  selectAnsiblePlaybookServices,
  selectColumns,
} from '../ApplicationDefinitionImportSelectors';

import { applicationDefinitionImportConfData1 } from '../__fixtures__/applicationDefinitionImportConfData1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    applicationDefinitionImportConf: obj,
  },
});

const fixtures = {
  'should return editMode from applicationDefinitionImportConfData1 fixtures': () =>
    selectEditMode(stateFactory(applicationDefinitionImportConfData1)),
  'should return services from applicationDefinitionImportConfData1 fixtures': () =>
    selectAnsiblePlaybookServices(
      stateFactory(applicationDefinitionImportConfData1)
    ),
  'should return columns from applicationDefinitionImportConfData1 fixtures': () =>
    selectColumns(stateFactory(applicationDefinitionImportConfData1)),
};

describe('ApplicationDefinitionImportSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
