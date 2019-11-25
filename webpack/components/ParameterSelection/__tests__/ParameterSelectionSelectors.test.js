import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectLoading,
  selectEditMode,
  selectForemanData,
  selectParameterTypes,
  selectRows,
  selectSortingColumns,
  selectColumns,
  selectAppDefinition,
  selectHostgroupId,
} from '../ParameterSelectionSelectors';

import {
  parameterSelectionData_1,
} from '../__fixtures__/parameterSelectionData_1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    parameterSelectionParameters: obj,
  },
});

const fixtures = {
  'should return loading from parameterSelectionData_1 fixtures': () =>
    selectLoading(stateFactory(parameterSelectionData_1)),
  'should return editMode from parameterSelectionData_1 fixtures': () =>
    selectEditMode(stateFactory(parameterSelectionData_1)),
  'should return foremanData from parameterSelectionData_1 fixtures': () =>
    selectForemanData(stateFactory(parameterSelectionData_1)),
  'should return parameterTypes from parameterSelectionData_1 fixtures': () =>
    selectParameterTypes(stateFactory(parameterSelectionData_1)),
  'should return rows from parameterSelectionData_1 fixtures': () =>
    selectRows(stateFactory(parameterSelectionData_1)),
  'should return sortingColumns from parameterSelectionData_1 fixtures': () =>
    selectSortingColumns(stateFactory(parameterSelectionData_1)),
  'should return columns from parameterSelectionData_1 fixtures': () =>
    selectColumns(stateFactory(parameterSelectionData_1)),
  'should return appDefinition from parameterSelectionData_1 fixtures': () =>
    selectAppDefinition(stateFactory(parameterSelectionData_1)),
  'should return hostgroupId from parameterSelectionData_1 fixtures': () =>
    selectHostgroupId(stateFactory(parameterSelectionData_1)),
};

describe('ParameterSelectionSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));