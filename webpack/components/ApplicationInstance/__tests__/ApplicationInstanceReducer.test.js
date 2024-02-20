import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import reducer, { initialState } from '../ApplicationInstanceReducer';

import {
  successState,
  editState,
  initApplicationInstancePayload,
  closeAlertModalPayload,
  addHostPayload,
  deleteHostPayload,
  activateEditHostPayload,
  confirmEditHostPayload,
  cancelEditHostPayload,
  changeEditHostPayload,
  loadApplicationDefinitionRequestPayload,
  loadApplicationDefinitionSuccessPayload,
  loadApplicationDefinitionFailurePayload,
} from '../__fixtures__/applicationInstanceReducer.fixtures';

import {
  APPLICATION_INSTANCE_INIT,
  APPLICATION_INSTANCE_CLOSE_ALERT_MODAL,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_REQUEST,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_SUCCESS,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_FAILURE,
  APPLICATION_INSTANCE_HOST_DELETE,
  APPLICATION_INSTANCE_HOST_ADD,
  APPLICATION_INSTANCE_HOST_EDIT_ACTIVATE,
  APPLICATION_INSTANCE_HOST_EDIT_CONFIRM,
  APPLICATION_INSTANCE_HOST_EDIT_CHANGE,
  APPLICATION_INSTANCE_HOST_EDIT_CANCEL,
} from '../ApplicationInstanceConstants';

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
      type: APPLICATION_INSTANCE_INIT,
      payload: initApplicationInstancePayload,
    },
  },
  'should close alert modal': {
    state: successState,
    action: {
      type: APPLICATION_INSTANCE_CLOSE_ALERT_MODAL,
      payload: closeAlertModalPayload,
    },
  },
  'should add a host': {
    state: successState,
    action: {
      type: APPLICATION_INSTANCE_HOST_ADD,
      payload: addHostPayload,
    },
  },
  'should delete a host': {
    state: successState,
    action: {
      type: APPLICATION_INSTANCE_HOST_DELETE,
      payload: deleteHostPayload,
    },
  },
  'should activate edit host': {
    state: successState,
    action: {
      type: APPLICATION_INSTANCE_HOST_EDIT_ACTIVATE,
      payload: activateEditHostPayload,
    },
  },
  'should change edit host': {
    state: editState,
    action: {
      type: APPLICATION_INSTANCE_HOST_EDIT_CHANGE,
      payload: changeEditHostPayload,
    },
  },
  'should confirm edit host': {
    state: editState,
    action: {
      type: APPLICATION_INSTANCE_HOST_EDIT_CONFIRM,
      payload: confirmEditHostPayload,
    },
  },
  'should cancel edit host': {
    state: editState,
    action: {
      type: APPLICATION_INSTANCE_HOST_EDIT_CANCEL,
      payload: cancelEditHostPayload,
    },
  },
  'should request load param data': {
    state: successState,
    action: {
      type: APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_REQUEST,
      payload: loadApplicationDefinitionRequestPayload,
    },
  },
  'should load param data be successful': {
    state: successState,
    action: {
      type: APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_SUCCESS,
      payload: loadApplicationDefinitionSuccessPayload,
    },
  },
  'should load param data be erroneous': {
    state: successState,
    action: {
      type: APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_FAILURE,
      payload: loadApplicationDefinitionFailurePayload,
    },
  },
};

describe('ApplicationInstanceReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
