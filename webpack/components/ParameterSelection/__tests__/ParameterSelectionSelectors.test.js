import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectLoading,
  selectEditMode,
  selectParamData,
  selectAllowedParameterTypes,
  selectParameterTypes,
  selectParameters,
  selectSortingColumns,
  selectColumns,
  selectParamDefinition,
  selectHostgroupId,
  selectEditParamsRowIndex,
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
  'should return paramData from parameterSelectionData_1 fixtures': () =>
    selectParamData(stateFactory(parameterSelectionData_1)),
  'should return allowedParameterTypes from parameterSelectionData_1 fixtures': () =>
    selectAllowedParameterTypes(stateFactory(parameterSelectionData_1)),
  'should return parameterTypes from parameterSelectionData_1 fixtures': () =>
    selectParameterTypes(stateFactory(parameterSelectionData_1)),
  'should return parameters from parameterSelectionData_1 fixtures': () =>
    selectParameters(stateFactory(parameterSelectionData_1)),
  'should return sortingColumns from parameterSelectionData_1 fixtures': () =>
    selectSortingColumns(stateFactory(parameterSelectionData_1)),
  'should return columns from parameterSelectionData_1 fixtures': () =>
    selectColumns(stateFactory(parameterSelectionData_1)),
  'should return ParamDefinition from parameterSelectionData_1 fixtures': () =>
    selectParamDefinition(stateFactory(parameterSelectionData_1)),
  'should return hostgroupId from parameterSelectionData_1 fixtures': () =>
    selectHostgroupId(stateFactory(parameterSelectionData_1)),
  'should return editParamsRowIndex from parameterSelectionData_1 fixtures': () =>
    selectEditParamsRowIndex(stateFactory(parameterSelectionData_1)),
};

describe('ParameterSelectionSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
