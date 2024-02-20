import React from 'react';
import api from 'foremanReact/API';
import {
  setModalOpen,
  setModalClosed,
} from 'foremanReact/components/ForemanModal/ForemanModalActions';

import { actionHeaderCellFormatter } from 'patternfly-react';

import {
  propsToSnakeCase,
  propsToCamelCase,
} from 'foremanReact/common/helpers';

import {
  APPLICATION_INSTANCE_INIT,
  APPLICATION_INSTANCE_CLOSE_ALERT_MODAL,
  APPLICATION_INSTANCE_HOST_DELETE,
  APPLICATION_INSTANCE_HOST_ADD,
  APPLICATION_INSTANCE_HOST_EDIT_ACTIVATE,
  APPLICATION_INSTANCE_HOST_EDIT_CONFIRM,
  APPLICATION_INSTANCE_HOST_EDIT_CHANGE,
  APPLICATION_INSTANCE_HOST_EDIT_CANCEL,
  APPLICATION_INSTANCE_HOST_EDIT_ERROR,
  APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_OPEN,
  APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_OPEN,
  APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_INSTANCE_ADD_EXISTING_HOSTS_MODAL_OPEN,
  APPLICATION_INSTANCE_ADD_EXISTING_HOSTS_MODAL_CLOSE,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_REQUEST,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_SUCCESS,
  APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_FAILURE,
  APPLICATION_INSTANCE_CHANGE_PARAMETER_SELECTION_MODE,
} from './ApplicationInstanceConstants';

import { supportedPluginsToHiddenParameterTypes } from '../../helper';

export const initApplicationInstance = (
  appDefinition,
  hosts,
  ansibleVarsAll,
  supportedPlugins,
  headerFormatter,
  inlineEditFormatter,
  inlineEditButtonsFormatter
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
            width: '30%',
          },
        },
      },
      cell: {
        formatters: [inlineEditFormatter],
      },
    },
    {
      property: 'description',
      header: {
        label: 'Description',
        formatters: [headerFormatter],
        props: {
          index: 1,
          style: {
            width: '30%',
          },
        },
      },
      cell: {
        formatters: [inlineEditFormatter],
      },
    },
    {
      property: 'service',
      header: {
        label: 'Service',
        formatters: [headerFormatter],
        props: {
          index: 2,
          style: {
            width: '20%',
          },
        },
      },
      cell: {
        formatters: [inlineEditFormatter],
      },
    },
    {
      property: 'actions',
      header: {
        label: 'Actions',
        formatters: [actionHeaderCellFormatter],
        props: {
          index: 4,
          style: {
            width: '20%',
          },
        },
      },
      cell: {
        formatters: [inlineEditButtonsFormatter],
      },
    },
  ];

  initialState.appDefinition = appDefinition;
  initialState.hosts = hosts;
  initialState.ansibleVarsAll = ansibleVarsAll;
  initialState.hiddenForemanParameterTypes = supportedPluginsToHiddenParameterTypes(
    supportedPlugins
  );

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

export const closeAlertModal = () => ({
  type: APPLICATION_INSTANCE_CLOSE_ALERT_MODAL,
  payload: {},
});

export const loadApplicationDefinition = (
  applicationDefinitionId,
  additionalData
) => dispatch => {
  dispatch({ type: APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_REQUEST });

  const realUrl = additionalData.url.replace('__id__', applicationDefinitionId);

  return api
    .get(realUrl, {}, {})
    .then(({ data }) =>
      dispatch({
        type: APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_SUCCESS,
        payload: data,
      })
    )
    .catch(error =>
      dispatch(
        errorHandler(
          APPLICATION_INSTANCE_LOAD_APPLICATION_DEFINITION_FAILURE,
          error
        )
      )
    );
};

export const addApplicationInstanceHost = additionalData => ({
  type: APPLICATION_INSTANCE_HOST_ADD,
  payload: {
    ...additionalData,
  },
});

export const deleteApplicationInstanceHost = additionalData => ({
  type: APPLICATION_INSTANCE_HOST_DELETE,
  payload: {
    ...additionalData,
  },
});

export const activateEditApplicationInstanceHost = additionalData => ({
  type: APPLICATION_INSTANCE_HOST_EDIT_ACTIVATE,
  payload: {
    ...additionalData,
  },
});

export const confirmEditApplicationInstanceHost = allData => async dispatch => {
  // Host name can not be empty

  if (allData.rowData.hostname == '') {
    dispatch({
      type: APPLICATION_INSTANCE_HOST_EDIT_ERROR,
      payload: __('Every host needs to have a valid name'),
    });
    return;
  }

  // Host name can only have specific characters

  const hostname = allData.rowData.hostname.toLowerCase();
  const hostnameRegex = /^[0-9a-z]([0-9a-z\-]{0,61}[0-9a-z])$/;

  if (hostname.match(hostnameRegex) == undefined) {
    dispatch({
      type: APPLICATION_INSTANCE_HOST_EDIT_ERROR,
      payload: __(
        'The hostname uses not allowed characters. See https://en.wikipedia.org/wiki/Hostname#Syntax for more details.'
      ),
    });
    return;
  }

  // Service can not be empty

  if (allData.rowData.service == '') {
    dispatch({
      type: APPLICATION_INSTANCE_HOST_EDIT_ERROR,
      payload: __('Every host needs to be assigned to a service.'),
    });
    return;
  }

  // Validation if host name is already used (only for new host entrys)

  const url = '/acd/ui_acd_validate_hostname';
  const validationData = {};

  validationData.appDefId = allData.appDefinition.id;
  validationData.serviceId = allData.rowData.service;
  validationData.hostname = allData.rowData.hostname;

  if (allData.rowData.newEntry === true) {
    try {
      const response = await api.get(url, {}, validationData);

      if (response.data.result === true) {
        dispatch({
          type: APPLICATION_INSTANCE_HOST_EDIT_CONFIRM,
          payload: {
            ...allData,
          },
        });
      } else {
        dispatch({
          type: APPLICATION_INSTANCE_HOST_EDIT_ERROR,
          payload: __(
            `Hostname '${allData.rowData.hostname}' is already used. This check also includes hosts outside this application instance.`
          ),
        });
      }
    } catch (error) {
      dispatch({
        type: APPLICATION_INSTANCE_HOST_EDIT_ERROR,
        payload: __('Error during validation if hostname is already used.'),
      });
    }
  } else {
    dispatch({
      type: APPLICATION_INSTANCE_HOST_EDIT_CONFIRM,
      payload: {
        ...allData,
      },
    });
  }
};

export const cancelEditApplicationInstanceHost = rowData => ({
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

export const openForemanParameterSelectionModal = additionalData => dispatch => {
  dispatch({
    type: APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_OPEN,
    payload: {
      ...additionalData,
    },
  });
  dispatch(setModalOpen({ id: 'AppInstanceForemanParamSelection' }));
};

export const closeForemanParameterSelectionModal = additionalData => dispatch => {
  dispatch({
    type: APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE,
    payload: {
      ...additionalData,
    },
  });

  dispatch(setModalClosed({ id: 'AppInstanceForemanParamSelection' }));
};

export const openAnsibleParameterSelectionModal = additionalData => dispatch => {
  dispatch({
    type: APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_OPEN,
    payload: {
      ...additionalData,
    },
  });
  dispatch(setModalOpen({ id: 'AppInstanceAnsibleParamSelection' }));
};

export const closeAnsibleParameterSelectionModal = additionalData => dispatch => {
  dispatch({
    type: APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE,
    payload: {
      ...additionalData,
    },
  });

  dispatch(setModalClosed({ id: 'AppInstanceAnsibleParamSelection' }));
};

export const openAddExistingHostsModal = additionalData => dispatch => {
  dispatch({
    type: APPLICATION_INSTANCE_ADD_EXISTING_HOSTS_MODAL_OPEN,
    payload: {
      ...additionalData,
    },
  });
  dispatch(setModalOpen({ id: 'AppInstanceAddExistingHosts' }));
};

export const closeAddExistingHostsModal = additionalData => dispatch => {
  dispatch({
    type: APPLICATION_INSTANCE_ADD_EXISTING_HOSTS_MODAL_CLOSE,
    payload: {
      ...additionalData,
    },
  });

  dispatch(setModalClosed({ id: 'AppInstanceAddExistingHosts' }));
};

export const changeParameterSelectionMode = additionalData => ({
  type: APPLICATION_INSTANCE_CHANGE_PARAMETER_SELECTION_MODE,
  payload: {
    ...additionalData,
  },
});
