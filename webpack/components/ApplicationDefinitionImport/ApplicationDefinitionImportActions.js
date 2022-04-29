import React from 'react';
import { API, actionTypeGenerator } from 'foremanReact/redux/API';
import { addToast } from 'foremanReact/components/ToastsList';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';


import {
  setModalOpen,
  setModalClosed,
} from 'foremanReact/components/ForemanModal/ForemanModalActions';

import {
  actionHeaderCellFormatter,
} from 'patternfly-react';

import {
  propsToSnakeCase,
  propsToCamelCase,
} from 'foremanReact/common/helpers';

import {
  APPLICATION_DEFINITION_IMPORT_INIT,
  APPLICATION_DEFINITION_IMPORT_CLOSE_ALERT_MODAL,
  APPLICATION_DEFINITION_IMPORT_SERVICE_EDIT_CHANGE,
  APPLICATION_DEFINITION_IMPORT_FILE_REQUEST,
  APPLICATION_DEFINITION_IMPORT_FILE_SUCCESS,
  APPLICATION_DEFINITION_IMPORT_FILE_FAILURE,
} from './ApplicationDefinitionImportConstants';


export const initApplicationDefinitionImport = (
  ansiblePlaybookServices,
  headerFormatter,
  inlineEditFormatter,
) => dispatch => {
  const initialState = {};

  initialState.columns = [
    {
      property: 'name',
      header: {
        label: 'Service name',
        formatters: [headerFormatter],
        props: {
          index: 0,
          style: {
            width: '20%'
          }
        },
      },
      cell: {
        props: {
              index: 0,
            },
        formatters: [inlineEditFormatter]
      }
    },
    {
      property: 'hostgroup',
      header: {
        label: 'Hostgroup',
        formatters: [headerFormatter],
        props: {
          index: 1,
          style: {
            width: '20%'
          }
        },
      },
      cell: {
        props: {
              index: 1,
            },
        formatters: [inlineEditFormatter]
      }
    }
  ];

  initialState.ansiblePlaybookServices = ansiblePlaybookServices;

  dispatch({
    type: APPLICATION_DEFINITION_IMPORT_INIT,
    payload: initialState,
  });
};


const errorHandler = (msg, err) => {
  const error = {
    errorMsg: __('Failed to fetch data from server.'),
    statusText: err,
  };
  return { type: msg, payload: { error } };
};

export const closeAlertModal = () => ({
  type: APPLICATION_DEFINITION_IMPORT_CLOSE_ALERT_MODAL,
  payload: {}
});

export const changeEditApplicationDefinitionImportService = (value, additionalData) => ({
  type: APPLICATION_DEFINITION_IMPORT_SERVICE_EDIT_CHANGE,
  payload: {
    value,
    ...additionalData,
  },
});


export const handleImportAnsiblePlaybook = (
  file, e,) => async dispatch => {
  e.preventDefault();
  dispatch({
    type: APPLICATION_DEFINITION_IMPORT_FILE_REQUEST,
    payload: {
      app_definition_file: file,
    }});
  try {
    const formData = new FormData();

    // Update the formData object
    formData.append(
      "app_definition_file",
      file,
      file.name
    );
    const { data } = await API.post(
      '/acd/app_definitions/handle_file_upload', formData);
    dispatch(
        addToast({
          type: 'success',
          message: sprintf(
            __('Sucessfully synced imported app template')
          ),
          key: APPLICATION_DEFINITION_IMPORT_FILE_SUCCESS,
        })
      );
      return dispatch({
        type: APPLICATION_DEFINITION_IMPORT_FILE_SUCCESS,
        payload: {
          ansiblePlaybookServices: data,
        },
        response: data,
      });
    } catch (error) {
      dispatch(
        addToast({
          type: 'error',
          message: sprintf(__('Error occurred while importing app template: %s'), error.response.data.message),
          key: APPLICATION_DEFINITION_IMPORT_FILE_FAILURE,
        })
      );
      return dispatch({
        type: APPLICATION_DEFINITION_IMPORT_FILE_FAILURE,
        payload: {
          error: error,
        },
        response: error,
      });
    }
};
