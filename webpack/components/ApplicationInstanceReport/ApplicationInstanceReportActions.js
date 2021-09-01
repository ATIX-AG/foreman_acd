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
  APPLICATION_INSTANCE_REPORT_LOAD_REPORT_REQUEST,
  APPLICATION_INSTANCE_REPORT_LOAD_REPORT_SUCCESS,
  APPLICATION_INSTANCE_REPORT_LOAD_REPORT_FAILURE,
} from './ApplicationInstanceReportConstants';

export const initApplicationInstanceReport = (
  hosts, deploymentState,
) => dispatch => {
  const initialState = {};

  initialState.hosts = hosts;
  initialState.deploymentState = deploymentState;

  dispatch({
    type: APPLICATION_INSTANCE_REPORT_INIT,
    payload: initialState,
  });
};

export const loadReportData = (
  reportDataUrl,
  appInstanceId,
) => dispatch => {
  dispatch({ type: APPLICATION_INSTANCE_REPORT_LOAD_REPORT_REQUEST });

  const baseUrl = reportDataUrl;
  const realUrl = baseUrl.replace("__id__", appInstanceId);

  return api
    .get(realUrl, {}, {})
    .then(({ data }) =>
      dispatch({
        type: APPLICATION_INSTANCE_REPORT_LOAD_REPORT_SUCCESS,
        payload: { ...data }
      })
    )
    .catch(error => dispatch(errorHandler(APPLICATION_INSTANCE_REPORT_LOAD_REPORT_FAILURE, error)));
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
