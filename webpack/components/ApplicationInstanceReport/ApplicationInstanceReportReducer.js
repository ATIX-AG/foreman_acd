import Immutable from 'seamless-immutable';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

import {
  APPLICATION_INSTANCE_REPORT_INIT,
  APPLICATION_INSTANCE_REPORT_SET_ACTIVE_HOST,
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
    default: {
      return state;
    }
  }
};

export default applicationInstanceReport;
