import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import reducer, { initialState } from '../ApplicationDefinitionReducer';

import {
  successState,
  editState,
  initApplicationDefinitionPayload,
  addServicePayload,
  deleteServicePayload,
  activateEditServicePayload,
  confirmEditServicePayload,
  cancelEditServicePayload,
  changeEditServicePayload,
  loadAnsibleDataRequestPayload,
  loadAnsibleDataSuccessPayload,
  loadAnsibleDataFailurePayload,
} from '../__fixtures__/applicationDefinitionReducer.fixtures';

import {
  APPLICATION_DEFINITION_INIT,
  APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_REQUEST,
  APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_SUCCESS,
  APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_FAILURE,
  APPLICATION_DEFINITION_SERVICE_DELETE,
  APPLICATION_DEFINITION_SERVICE_ADD,
  APPLICATION_DEFINITION_SERVICE_EDIT_ACTIVATE,
  APPLICATION_DEFINITION_SERVICE_EDIT_CONFIRM,
  APPLICATION_DEFINITION_SERVICE_EDIT_CHANGE,
  APPLICATION_DEFINITION_SERVICE_EDIT_CANCEL,
} from '../ApplicationDefinitionConstants';

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
      type: APPLICATION_DEFINITION_INIT,
      payload: initApplicationDefinitionPayload,
    },
  },
  'should add a service': {
    state: successState,
    action: {
      type: APPLICATION_DEFINITION_SERVICE_ADD,
      payload: addServicePayload,
    },
  },
  'should delete a service': {
    state: successState,
    action: {
      type: APPLICATION_DEFINITION_SERVICE_DELETE,
      payload: deleteServicePayload,
    },
  },
  'should activate edit service': {
    state: successState,
    action: {
      type: APPLICATION_DEFINITION_SERVICE_EDIT_ACTIVATE,
      payload: activateEditServicePayload,
    },
  },
  'should change edit service': {
    state: editState,
    action: {
      type: APPLICATION_DEFINITION_SERVICE_EDIT_CHANGE,
      payload: changeEditServicePayload,
    },
  },
  'should confirm edit service': {
    state: editState,
    action: {
      type: APPLICATION_DEFINITION_SERVICE_EDIT_CONFIRM,
      payload: confirmEditServicePayload,
    },
  },
  'should cancel edit service': {
    state: editState,
    action: {
      type: APPLICATION_DEFINITION_SERVICE_EDIT_CANCEL,
      payload: cancelEditServicePayload,
    },
  },
  'should request load param data': {
    state: successState,
    action: {
      type: APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_REQUEST,
      payload: loadAnsibleDataRequestPayload,
    },
  },
  'should load param data be successful': {
    state: successState,
    action: {
      type: APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_SUCCESS,
      payload: loadAnsibleDataSuccessPayload,
    },
  },
  'should load param data be erroneous': {
    state: successState,
    action: {
      type: APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_FAILURE,
      payload: loadAnsibleDataFailurePayload,
    },
  },
};

describe('ApplicationDefintionReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
