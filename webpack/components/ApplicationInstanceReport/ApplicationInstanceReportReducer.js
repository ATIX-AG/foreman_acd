import Immutable from 'seamless-immutable';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

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
        loading: true,
        activeHostId: payload.activeHostId,
      })
    }
    case APPLICATION_INSTANCE_REPORT_LOAD_REPORT_REQUEST: {
      // Nothing to do
      return state;
    }
    case APPLICATION_INSTANCE_REPORT_LOAD_REPORT_SUCCESS: {
      return state.merge({
        deploymentState: payload.deployment_state,
        hosts: payload.hosts,
      });
    }
    case APPLICATION_INSTANCE_REPORT_LOAD_REPORT_FAILURE: {
      console.log("Error while loading report data: "+ payload.error);
      return state.merge({ error: payload.error});
    }
    default: {
      return state;
    }
  }
};

export default applicationInstanceReport;
