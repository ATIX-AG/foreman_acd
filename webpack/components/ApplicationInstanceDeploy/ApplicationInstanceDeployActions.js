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
  APPLICATION_INSTANCE_DEPLOY_INIT,
  APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_REQUEST,
  APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_SUCCESS,
  APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_FAILURE,
} from './ApplicationInstanceDeployConstants';

export const initApplicationInstanceDeploy = (
  hosts,
) => dispatch => {
  const initialState = {};

  initialState.hosts = hosts;

  dispatch({
    type: APPLICATION_INSTANCE_DEPLOY_INIT,
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

export const loadReport = (dispatch, getState, id, url, initial) => {

  const reportState = getState().foremanAcd.applicationInstanceDeployReport;

  if ((reportState.activeHostId == id) || (initial == true)) {
    setTimeout(() => {
      loadReport(dispatch, getState, id, url, false);
    }, 1600)
  }

  return api
    .get(url, {}, {})
    .then(({ data }) =>
      dispatch({
        type: APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_SUCCESS,
        payload: data.results,
      })
    )
    .catch(error => dispatch(errorHandler(APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_FAILURE, error)));
};

export const setActiveAndLoadReport = (
  id,
  url,
) => (dispatch, getState) => {
  dispatch({
    payload: { activeHostId: id },
    type: APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_REQUEST
  });

  return loadReport(dispatch, getState, id, url, true);
};
