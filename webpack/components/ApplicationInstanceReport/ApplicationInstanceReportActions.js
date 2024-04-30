import api from 'foremanReact/API';

import {
  APPLICATION_INSTANCE_REPORT_INIT,
  APPLICATION_INSTANCE_REPORT_SET_ACTIVE_HOST,
  APPLICATION_INSTANCE_REPORT_LOAD_REPORT_REQUEST,
  APPLICATION_INSTANCE_REPORT_LOAD_REPORT_SUCCESS,
  APPLICATION_INSTANCE_REPORT_LOAD_REPORT_FAILURE,
} from './ApplicationInstanceReportConstants';

export const initApplicationInstanceReport = (
  hosts,
  deploymentState,
  initialConfigureState,
  initialConfigureJobUrl
) => dispatch => {
  const initialState = {};

  initialState.hosts = hosts;
  initialState.deploymentState = deploymentState;
  initialState.initialConfigureState = initialConfigureState;
  initialState.initialConfigureJobUrl = initialConfigureJobUrl;

  // Decide if it should show only the initial Configure job state + URL or
  // the URL to all configuration jobs
  if (initialConfigureState === 'unconfigured') {
    initialState.showInitialConfigureJob = true;
  } else {
    initialState.showInitialConfigureJob = false;
  }

  dispatch({
    type: APPLICATION_INSTANCE_REPORT_INIT,
    payload: initialState,
  });
};

export const loadReportData = (
  reportDataUrl,
  appInstanceId
) => async dispatch => {
  dispatch({ type: APPLICATION_INSTANCE_REPORT_LOAD_REPORT_REQUEST });

  const baseUrl = reportDataUrl;
  const realUrl = baseUrl.replace('__id__', appInstanceId);

  try {
    const { data } = await api.get(realUrl, {}, {});
    dispatch({
      type: APPLICATION_INSTANCE_REPORT_LOAD_REPORT_SUCCESS,
      payload: { ...data },
    });
  } catch (error) {
    dispatch(
      errorHandler(APPLICATION_INSTANCE_REPORT_LOAD_REPORT_FAILURE, error)
    );
  }
};

const errorHandler = (msg, err) => {
  const error = {
    errorMsg: 'Failed to fetch data from server.',
    statusText: err,
  };
  return { type: msg, payload: { error } };
};

export const setActiveHost = id => ({
  type: APPLICATION_INSTANCE_REPORT_SET_ACTIVE_HOST,
  payload: { activeHostId: id },
});
