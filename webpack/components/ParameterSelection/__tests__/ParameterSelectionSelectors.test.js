import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectLoading,
  selectEditMode,
  selectForemanData,
  selectParameterTypes,
  selectParameters,
  selectSortingColumns,
  selectColumns,
  selectServiceDefinition,
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
  'should return parameters from parameterSelectionData_1 fixtures': () =>
    selectParameters(stateFactory(parameterSelectionData_1)),
  'should return sortingColumns from parameterSelectionData_1 fixtures': () =>
    selectSortingColumns(stateFactory(parameterSelectionData_1)),
  'should return columns from parameterSelectionData_1 fixtures': () =>
    selectColumns(stateFactory(parameterSelectionData_1)),
  'should return serviceDefinition from parameterSelectionData_1 fixtures': () =>
    selectServiceDefinition(stateFactory(parameterSelectionData_1)),
  'should return hostgroupId from parameterSelectionData_1 fixtures': () =>
    selectHostgroupId(stateFactory(parameterSelectionData_1)),
};

describe('ParameterSelectionSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
