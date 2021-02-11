import React from 'react';
import api from 'foremanReact/API';

import {
  actionHeaderCellFormatter,
} from 'patternfly-react';

import {
  propsToSnakeCase,
  propsToCamelCase,
} from 'foremanReact/common/helpers';

import {
  APPLICATION_INSTANCE_REPORT_INIT,
  APPLICATION_INSTANCE_REPORT_SET_ACTIVE_HOST,
} from './ApplicationInstanceReportConstants';

export const initApplicationInstanceReport = (
  hosts,
) => dispatch => {
  const initialState = {};

  initialState.hosts = hosts;

  dispatch({
    type: APPLICATION_INSTANCE_REPORT_INIT,
    payload: initialState,
  });
};

const errorHandler = (msg, err) => {
  const error = {
    errorMsg: 'Failed to fetch data from server.',
    statusText: err,
  };
  return { type: msg, payload: { error } };
};

export const setActiveHost = (id) => ({
  type: APPLICATION_INSTANCE_REPORT_SET_ACTIVE_HOST,
  payload: { activeHostId: id },
});
