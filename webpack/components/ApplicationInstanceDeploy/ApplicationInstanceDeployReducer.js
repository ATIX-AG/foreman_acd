import Immutable from 'seamless-immutable';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

import {
  APPLICATION_INSTANCE_DEPLOY_INIT,
  APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_REQUEST,
  APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_SUCCESS,
  APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_FAILURE,
} from './ApplicationInstanceDeployConstants';

export const initialState = Immutable({
  name: false,
  error: { errorMsg: '', status: '', statusText: '' },
});

const applicationInstanceDeployReport = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case APPLICATION_INSTANCE_DEPLOY_INIT: {
      return state.merge(payload);
    }
    case APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_REQUEST: {
      return state.merge({
        loading: true,
        activeHostId: payload.activeHostId,
      })
    }
    case APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_SUCCESS: {
      return state.merge({
        report: payload,
        loading: false,
      });
    }
    case APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_FAILURE: {
      return state.merge({
        error: payload.error,
        loading: false
      });
    }
    default: {
      return state;
    }
  }
};

export default applicationInstanceDeployReport;
