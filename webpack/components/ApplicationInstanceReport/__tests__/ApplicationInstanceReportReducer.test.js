import { testReducerSnapshotWithFixtures } from 'react-redux-test-utils';
import reducer, { initialState } from '../ApplicationInstanceReportReducer';

import {
  successState,
  initApplicationInstanceReportPayload,
  setActiveHostPayload,
} from '../__fixtures__/applicationInstanceReportReducer.fixtures';

import {
  APPLICATION_INSTANCE_REPORT_INIT,
  APPLICATION_INSTANCE_REPORT_SET_ACTIVE_HOST,
} from '../ApplicationInstanceReportConstants';

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
      type: APPLICATION_INSTANCE_REPORT_INIT,
      payload: initApplicationInstanceReportPayload,
    },
  },
  'should set active host': {
    state: successState,
    action: {
      type: APPLICATION_INSTANCE_REPORT_SET_ACTIVE_HOST,
      payload: setActiveHostPayload,
    },
  },
};

describe('ApplicationInstanceReport', () =>
  testReducerSnapshotWithFixtures(reducer, fixtures));
