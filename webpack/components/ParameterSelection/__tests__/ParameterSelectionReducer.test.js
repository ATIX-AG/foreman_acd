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
  INIT_PARAMETER_SELECTION,
  PARAMETER_DELETE,
  PARAMETER_ADD,
  PARAMETER_EDIT_ACTIVATE,
  PARAMETER_EDIT_CONFIRM,
  PARAMETER_EDIT_CHANGE,
  PARAMETER_EDIT_CANCEL,
  PARAMETER_SORT,
  LOAD_FOREMAN_DATA_REQUEST,
  LOAD_FOREMAN_DATA_SUCCESS,
  LOAD_FOREMAN_DATA_FAILURE,
  LOAD_PARAMETER_SELECTION_REQUEST,
  LOAD_PARAMETER_SELECTION_SUCCESS,
  LOAD_PARAMETER_SELECTION_FAILURE,
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
      type: INIT_PARAMETER_SELECTION,
      payload: initParameterSelectionPayload,
    },
  },
  'should add a parameter': {
    state: successState,
    action: {
      type: PARAMETER_ADD,
      payload: addParameterPayload,
    },
  },
  'should delete a parameter': {
    state: successState,
    action: {
      type: PARAMETER_DELETE,
      payload: deleteParameterPayload,
    },
  },
  'should activate edit parameter': {
    state: successState,
    action: {
      type: PARAMETER_EDIT_ACTIVATE,
      payload: activateEditParameterPayload,
    },
  },
  'should confirm edit parameter': {
    state: editState,
    action: {
      type: PARAMETER_EDIT_CONFIRM,
      payload: confirmEditParameterPayload,
    },
  },
  'should cancel edit parameter': {
    state: editState,
    action: {
      type: PARAMETER_EDIT_CANCEL,
      payload: cancelEditParameterPayload,
    },
  },
  'should change edit parameter': {
    state: editState,
    action: {
      type: PARAMETER_EDIT_CHANGE,
      payload: changeEditParameterPayload,
    },
  },
  'should sort parameter': {
    state: successState,
    action: {
      type: PARAMETER_SORT,
      payload: sortParameterPayload,
    },
  },
  'should request load foreman data': {
    state: successState,
    action: {
      type: LOAD_FOREMAN_DATA_REQUEST,
      payload: loadForemanDataRequestPayload,
    },
  },
  'should load foreman data be successful': {
    state: successState,
    action: {
      type: LOAD_FOREMAN_DATA_SUCCESS,
      payload: loadForemanDataSuccessPayload,
    },
  },
  'should load foreman data be erroneous': {
    state: successState,
    action: {
      type: LOAD_FOREMAN_DATA_FAILURE,
      payload: loadForemanDataFailurePayload,
    },
  },
  'should request parameter selection': {
    state: initialState,
    action: {
      type: LOAD_PARAMETER_SELECTION_REQUEST,
      payload: loadParameterSelectionRequestPayload,
    },
  },
  'should load parameter selection be successful': {
    state: initialState,
    action: {
      type: LOAD_PARAMETER_SELECTION_SUCCESS,
      payload: loadParameterSelectionSuccessPayload,
    },
  },
  'should load parameter selection be erroneous': {
    state: initialState,
    action: {
      type: LOAD_PARAMETER_SELECTION_FAILURE,
      payload: loadParameterSelectionFailurePayload,
    },
  },
};

describe('ParameterSelectionReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
