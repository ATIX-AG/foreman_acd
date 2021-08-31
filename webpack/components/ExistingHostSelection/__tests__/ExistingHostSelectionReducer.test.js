import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import reducer, { initialState } from '../ExistingHostSelectionReducer';

import {
  successState,
  initExistingHostSelectionPayload,
  existingHostSelectionSelectionChangedPayload,
  loadExistingHostSelectionSuccessPayload,
  loadExistingHostSelectionFailurePayload,
} from '../__fixtures__/existingHostSelectionReducer.fixtures';

import {
  EXISTING_HOST_SELECTION_INIT,
  EXISTING_HOST_SELECTION_LOAD_HOSTS_SUCCESS,
  EXISTING_HOST_SELECTION_LOAD_HOSTS_FAILURE,
  EXISTING_HOST_SELECTION_SELECTION_CHANGED,
} from '../ExistingHostSelectionConstants';

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
      type: EXISTING_HOST_SELECTION_INIT,
      payload: initExistingHostSelectionPayload,
    },
  },
  'should handle changed existiong host selection': {
    state: successState,
    action: {
      type: EXISTING_HOST_SELECTION_SELECTION_CHANGED,
      payload: existingHostSelectionSelectionChangedPayload,
    },
  },
  'should load host data be successful': {
    state: successState,
    action: {
      type: EXISTING_HOST_SELECTION_LOAD_HOSTS_SUCCESS,
      payload: loadExistingHostSelectionSuccessPayload,
    },
  },
  'should load host data be erroneous': {
    state: successState,
    action: {
      type: EXISTING_HOST_SELECTION_LOAD_HOSTS_FAILURE,
      payload: loadExistingHostSelectionFailurePayload,
    },
  },
};

describe('ExistingHostSelectionReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
