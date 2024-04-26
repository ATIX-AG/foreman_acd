import Immutable from 'seamless-immutable';

import {
  APPLICATION_INSTANCE_REPORT_INIT,
  APPLICATION_INSTANCE_REPORT_SET_ACTIVE_HOST,
  APPLICATION_INSTANCE_REPORT_LOAD_REPORT_REQUEST,
  APPLICATION_INSTANCE_REPORT_LOAD_REPORT_SUCCESS,
  APPLICATION_INSTANCE_REPORT_LOAD_REPORT_FAILURE,
} from './ApplicationInstanceReportConstants';

export const initialState = Immutable({
  name: false,
  error: { errorMsg: '', status: '', statusText: '' },
});

const applicationInstanceReport = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case APPLICATION_INSTANCE_REPORT_INIT: {
      return state.merge(payload);
    }
    case APPLICATION_INSTANCE_REPORT_SET_ACTIVE_HOST: {
      return state.merge({
        activeHostId: payload.activeHostId,
      });
    }
    case APPLICATION_INSTANCE_REPORT_LOAD_REPORT_REQUEST: {
      return state.merge({
        loading: true,
      });
    }
    case APPLICATION_INSTANCE_REPORT_LOAD_REPORT_SUCCESS: {
      return state.merge({
        deploymentState: payload.deploymentState,
        initialConfigureState: payload.initialConfigureState,
        initialConfigureJobUrl: payload.initialConfigureJobUrl,
        hosts: payload.hosts,
        loading: false,
      });
    }
    case APPLICATION_INSTANCE_REPORT_LOAD_REPORT_FAILURE: {
      return state.merge({
        error: payload.error,
        loading: false,
      });
    }
    default: {
      return state;
    }
  }
};

export default applicationInstanceReport;
