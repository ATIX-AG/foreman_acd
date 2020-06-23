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
} from './ApplicationInstanceReportConstants';

export const initApplicationInstanceReport = (
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

export const loadReport = (dispatch, getState, id, url, live, initial) => {

  const reportState = getState().foremanAcd.applicationInstanceReport;

  if (live) {
    if ((reportState.activeHostId == id) || (initial == true)) {
      setTimeout(() => {
        loadReport(dispatch, getState, id, url, live, false);
      }, 1600)
    }
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

export const setActiveAndLoadLiveReport = (
  id,
  url,
) => (dispatch, getState) => {
  dispatch({
    payload: { activeHostId: id },
    type: APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_REQUEST
  });

  return loadReport(dispatch, getState, id, url, true, true);
}

export const setActiveAndLoadLastReport = (
  id,
  url,
) => (dispatch, getState) => {
  dispatch({
    payload: { activeHostId: id },
    type: APPLICATION_INSTANCE_DEPLOY_LOAD_REPORT_REQUEST
  });

  return loadReport(dispatch, getState, id, url, false, true);
};
