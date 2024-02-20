import React from 'react';
import * as sort from 'sortabular';
import { translate as __ } from 'foremanReact/common/I18n';

import api from 'foremanReact/API';

import {
  propsToSnakeCase,
  propsToCamelCase,
} from 'foremanReact/common/helpers';

import {
  EXISTING_HOST_SELECTION_INIT,
  EXISTING_HOST_SELECTION_LOAD_HOSTS_SUCCESS,
  EXISTING_HOST_SELECTION_LOAD_HOSTS_FAILURE,
  EXISTING_HOST_SELECTION_SELECTION_CHANGED,
} from './ExistingHostSelectionConstants';

export const initExistingHostSelection = allHosts => dispatch => {
  const initialState = {};

  initialState.alreadyUsedHosts = undefined;
  initialState.serviceId = undefined;
  initialState.selectedHosts = [];
  initialState.hostsInHostgroup = {};
  initialState.allHosts = allHosts;

  dispatch({
    type: EXISTING_HOST_SELECTION_INIT,
    payload: initialState,
  });
};

export const loadHostsOfHostgroup = (serviceId, additionalData) => dispatch => {
  const selService = additionalData.services.filter(s => s.id == serviceId)[0];
  const realUrl = additionalData.url.replace(
    '__hostgroup_id__',
    selService.hostgroup
  );

  return api
    .get(realUrl, {}, {})
    .then(({ data }) =>
      dispatch({
        type: EXISTING_HOST_SELECTION_LOAD_HOSTS_SUCCESS,
        payload: {
          hosts: data.results,
          serviceId: parseInt(serviceId),
        },
      })
    )
    .catch(error =>
      dispatch(errorHandler(EXISTING_HOST_SELECTION_LOAD_HOSTS_FAILURE, error))
    );
};

export const hostSelectionChanged = ({ left, right }) => ({
  type: EXISTING_HOST_SELECTION_SELECTION_CHANGED,
  payload: {
    selection: right.items,
  },
});

const errorHandler = (msg, err) => {
  const error = {
    errorMsg: __('Failed to fetch data from server.'),
    statusText: err,
  };
  return { type: msg, payload: { error } };
};
