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
  APPLICATION_INSTANCE_INIT,
  APPLICATION_INSTANCE_HOST_DELETE,
  APPLICATION_INSTANCE_HOST_ADD,
  APPLICATION_INSTANCE_HOST_EDIT_ACTIVATE,
  APPLICATION_INSTANCE_HOST_EDIT_CONFIRM,
  APPLICATION_INSTANCE_HOST_EDIT_CHANGE,
  APPLICATION_INSTANCE_HOST_EDIT_CANCEL,
  APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_OPEN,
  APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_REQUEST,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_SUCCESS,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_FAILURE,
} from './ApplicationInstanceConstants';

export const initApplicationInstance = (
  appDefinition,
  hosts,
  headerFormatter,
  inlineEditFormatter,
  inlineEditButtonsFormatter,
) => dispatch => {
  const initialState = {};

  initialState.columns = [
    {
      property: 'hostname',
      header: {
        label: 'Hostname',
        formatters: [headerFormatter],
        props: {
          index: 0,
          style: {
            width: '20%'
          }
        },
      },
      cell: {
        formatters: [inlineEditFormatter]
      }
    },
    {
      property: 'description',
      header: {
        label: 'Description',
        formatters: [headerFormatter],
        props: {
          index: 1,
          style: {
            width: '20%'
          }
        },
      },
      cell: {
        formatters: [inlineEditFormatter]
      }
    },
    {
      property: 'service',
      header: {
        label: 'Service',
        formatters: [headerFormatter],
        props: {
          index: 2,
          style: {
            width: '20%'
          }
        },
      },
      cell: {
        formatters: [inlineEditFormatter]
      }
    },
    {
      property: 'actions',
      header: {
        label: 'Actions',
        formatters: [actionHeaderCellFormatter],
        props: {
          index: 4,
          style: {
            width: '20%'
          }
        },
      },
      cell: {
        formatters: [inlineEditButtonsFormatter]
      }
    }
  ];

  initialState.appDefinition = appDefinition;
  initialState.hosts = hosts;

  dispatch({
    type: APPLICATION_INSTANCE_INIT,
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

export const loadApplicationDefinition = (
  applicationDefinitionId,
  additionalData,
) => dispatch => {
  dispatch({ type: APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_REQUEST });

  const realUrl = additionalData.url.replace("__id__", applicationDefinitionId);

  return api
    .get(realUrl, {}, {})
    .then(({ data }) =>
      dispatch({
        type: APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_SUCCESS,
        payload: data,
      })
    )
    .catch(error => dispatch(errorHandler(APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_FAILURE, error)));
};

export const addApplicationInstanceHost = (additionalData) => ({
  type: APPLICATION_INSTANCE_HOST_ADD,
  payload: {
    ...additionalData,
  },
});

export const deleteApplicationInstanceHost = (additionalData) => ({
  type: APPLICATION_INSTANCE_HOST_DELETE,
  payload: {
    ...additionalData,
  },
});

export const activateEditApplicationInstanceHost = (additionalData) => ({
  type: APPLICATION_INSTANCE_HOST_EDIT_ACTIVATE,
  payload: {
    ...additionalData,
  },
});

export const confirmEditApplicationInstanceHost = (rowData) => ({
  type: APPLICATION_INSTANCE_HOST_EDIT_CONFIRM,
  payload: {
    ...rowData,
  },
});

export const cancelEditApplicationInstanceHost = (rowData) => ({
  type: APPLICATION_INSTANCE_HOST_EDIT_CANCEL,
  payload: {
    ...rowData,
  },
});

export const changeEditApplicationInstanceHost = (value, additionalData) => ({
  type: APPLICATION_INSTANCE_HOST_EDIT_CHANGE,
  payload: {
    value,
    ...additionalData,
  },
});

export const openParameterSelectionModal = (additionalData) => ({
  type: APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_OPEN,
  payload: {
    ...additionalData,
  },
});

export const closeParameterSelectionModal = (additionalData) => ({
  type: APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_CLOSE,
  payload: {
    ...additionalData,
  },
});
