import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import reducer, { initialState } from '../ParameterSelectionReducer';

import {
  successState,
  editState,
  initParameterSelectionPayload,
  addParameterPayload,
  deleteParameterPayload,
  activateEditParameterPayload,
  confirmEditParameterPayload,
  cancelEditParameterPayload,
  changeEditParameterPayload,
  sortParameterPayload,
  loadForemanDataRequestPayload,
  loadForemanDataSuccessPayload,
  loadForemanDataFailurePayload,
  loadParameterSelectionRequestPayload,
  loadParameterSelectionSuccessPayload,
  loadParameterSelectionFailurePayload,
} from '../__fixtures__/parameterSelectionReducer.fixtures';

import {
  PARAMETER_SELECTION_INIT,
  PARAMETER_SELECTION_DELETE,
  PARAMETER_SELECTION_ADD,
  PARAMETER_SELECTION_EDIT_ACTIVATE,
  PARAMETER_SELECTION_EDIT_CONFIRM,
  PARAMETER_SELECTION_EDIT_CHANGE,
  PARAMETER_SELECTION_EDIT_CANCEL,
  PARAMETER_SELECTION_SORT,
  PARAMETER_SELECTION_LOAD_FOREMAN_DATA_REQUEST,
  PARAMETER_SELECTION_LOAD_FOREMAN_DATA_SUCCESS,
  PARAMETER_SELECTION_LOAD_FOREMAN_DATA_FAILURE,
} from '../ParameterSelectionConstants';

const fixtures = {
  'should return initial state': {
    state: initialState,
    action: {
      type: undefined,
      payload: {},
    },
  },

  'should initialize component': {
    state: initialState,
    action: {
      type: PARAMETER_SELECTION_INIT,
      payload: initParameterSelectionPayload,
    },
  },
  'should add a parameter': {
    state: successState,
    action: {
      type: PARAMETER_SELECTION_ADD,
      payload: addParameterPayload,
    },
  },
  'should delete a parameter': {
    state: successState,
    action: {
      type: PARAMETER_SELECTION_DELETE,
      payload: deleteParameterPayload,
    },
  },
  'should activate edit parameter': {
    state: successState,
    action: {
      type: PARAMETER_SELECTION_EDIT_ACTIVATE,
      payload: activateEditParameterPayload,
    },
  },
  'should confirm edit parameter': {
    state: editState,
    action: {
      type: PARAMETER_SELECTION_EDIT_CONFIRM,
      payload: confirmEditParameterPayload,
    },
  },
  'should cancel edit parameter': {
    state: editState,
    action: {
      type: PARAMETER_SELECTION_EDIT_CANCEL,
      payload: cancelEditParameterPayload,
    },
  },
  'should change edit parameter': {
    state: editState,
    action: {
      type: PARAMETER_SELECTION_EDIT_CHANGE,
      payload: changeEditParameterPayload,
    },
  },
  'should sort parameter': {
    state: successState,
    action: {
      type: PARAMETER_SELECTION_SORT,
      payload: sortParameterPayload,
    },
  },
  'should request load foreman data': {
    state: successState,
    action: {
      type: PARAMETER_SELECTION_LOAD_FOREMAN_DATA_REQUEST,
      payload: loadForemanDataRequestPayload,
    },
  },
  'should load foreman data be successful': {
    state: successState,
    action: {
      type: PARAMETER_SELECTION_LOAD_FOREMAN_DATA_SUCCESS,
      payload: loadForemanDataSuccessPayload,
    },
  },
  'should load foreman data be erroneous': {
    state: successState,
    action: {
      type: PARAMETER_SELECTION_LOAD_FOREMAN_DATA_FAILURE,
      payload: loadForemanDataFailurePayload,
    },
  },
};

describe('ParameterSelectionReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
