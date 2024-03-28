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

import { parameterSelectionData1 } from '../__fixtures__/parameterSelectionData1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    parameterSelectionParameters: obj,
  },
});

const fixtures = {
  'should return loading from parameterSelectionData1 fixtures': () =>
    selectLoading(stateFactory(parameterSelectionData1)),
  'should return editMode from parameterSelectionData1 fixtures': () =>
    selectEditMode(stateFactory(parameterSelectionData1)),
  'should return paramData from parameterSelectionData1 fixtures': () =>
    selectParamData(stateFactory(parameterSelectionData1)),
  'should return allowedParameterTypes from parameterSelectionData1 fixtures': () =>
    selectAllowedParameterTypes(stateFactory(parameterSelectionData1)),
  'should return parameterTypes from parameterSelectionData1 fixtures': () =>
    selectParameterTypes(stateFactory(parameterSelectionData1)),
  'should return parameters from parameterSelectionData1 fixtures': () =>
    selectParameters(stateFactory(parameterSelectionData1)),
  'should return sortingColumns from parameterSelectionData1 fixtures': () =>
    selectSortingColumns(stateFactory(parameterSelectionData1)),
  'should return columns from parameterSelectionData1 fixtures': () =>
    selectColumns(stateFactory(parameterSelectionData1)),
  'should return ParamDefinition from parameterSelectionData1 fixtures': () =>
    selectParamDefinition(stateFactory(parameterSelectionData1)),
  'should return hostgroupId from parameterSelectionData1 fixtures': () =>
    selectHostgroupId(stateFactory(parameterSelectionData1)),
  'should return editParamsRowIndex from parameterSelectionData1 fixtures': () =>
    selectEditParamsRowIndex(stateFactory(parameterSelectionData1)),
};

describe('ParameterSelectionSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
