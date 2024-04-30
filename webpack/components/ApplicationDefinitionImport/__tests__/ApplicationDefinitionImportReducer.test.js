import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import reducer, { initialState } from '../ApplicationDefinitionImportReducer';

import {
  editState,
  initApplicationDefinitionImportPayload,
  changeEditServicePayload,
} from '../__fixtures__/applicationDefinitionImportReducer.fixtures';

import {
  APPLICATION_DEFINITION_IMPORT_INIT,
  APPLICATION_DEFINITION_IMPORT_SERVICE_EDIT_CHANGE,
} from '../ApplicationDefinitionImportConstants';

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
      type: APPLICATION_DEFINITION_IMPORT_INIT,
      payload: initApplicationDefinitionImportPayload,
    },
  },
  'should change edit service': {
    state: editState,
    action: {
      type: APPLICATION_DEFINITION_IMPORT_SERVICE_EDIT_CHANGE,
      payload: changeEditServicePayload,
    },
  },
};

describe('ApplicationDefinitionImportReducer', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
