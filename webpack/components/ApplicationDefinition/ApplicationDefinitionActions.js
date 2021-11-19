import React from 'react';
import api from 'foremanReact/API';

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
  APPLICATION_DEFINITION_INIT,
  APPLICATION_DEFINITION_CLOSE_ALERT_MODAL,
  APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_REQUEST,
  APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_SUCCESS,
  APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_FAILURE,
  APPLICATION_DEFINITION_SERVICE_DELETE,
  APPLICATION_DEFINITION_SERVICE_ADD,
  APPLICATION_DEFINITION_SERVICE_EDIT_ACTIVATE,
  APPLICATION_DEFINITION_SERVICE_EDIT_CONFIRM,
  APPLICATION_DEFINITION_SERVICE_EDIT_CHANGE,
  APPLICATION_DEFINITION_SERVICE_EDIT_CANCEL,
  APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_OPEN,
  APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_OPEN,
  APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_DEFINITION_CHANGE_PARAMETER_SELECTION_MODE,
} from './ApplicationDefinitionConstants';

import {
  supportedPluginsToHiddenParameterTypes,
} from '../../helper';

import {
  transformAnsiblePlaybook,
} from './ApplicationDefinitionHelper';

export const initApplicationDefinition = (
  ansiblePlaybook,
  services,
  ansibleVarsAll,
  supportedPlugins,
  headerFormatter,
  inlineEditFormatter,
  inlineEditButtonsFormatter,
) => dispatch => {
  const initialState = {};

  initialState.columns = [
    {
      property: 'name',
      header: {
        label: 'Name',
        formatters: [headerFormatter],
        props: {
          index: 0,
          style: {
            width: '15%'
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
            width: '10%'
          }
        },
      },
      cell: {
        formatters: [inlineEditFormatter]
      }
    },
    {
      property: 'hostgroup',
      header: {
        label: 'Hostgroup',
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
      property: 'ansibleGroup',
      header: {
        label: 'Ansible Group',
        formatters: [headerFormatter],
        props: {
          index: 3,
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
      property: 'minCount',
      header: {
        label: 'min count',
        formatters: [headerFormatter],
        props: {
          index: 4,
          style: {
            width: '10%'
          }
        },
      },
      cell: {
        formatters: [inlineEditFormatter]
      }
    },
    {
      property: 'maxCount',
      header: {
        label: 'max count',
        formatters: [headerFormatter],
        props: {
          index: 5,
          style: {
            width: '10%'
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
          index: 6,
          style: {
            width: '15%'
          }
        },
      },
      cell: {
        formatters: [inlineEditButtonsFormatter]
      }
    }
  ];

  if (ansiblePlaybook !== undefined) {
    initialState.ansiblePlaybook = transformAnsiblePlaybook(ansiblePlaybook);
  }
  initialState.services = services;
  initialState.ansibleVarsAll = ansibleVarsAll;
  initialState.hiddenForemanParameterTypes = supportedPluginsToHiddenParameterTypes(supportedPlugins);

  dispatch({
    type: APPLICATION_DEFINITION_INIT,
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
  type: APPLICATION_DEFINITION_CLOSE_ALERT_MODAL,
  payload: {}
});

export const loadAnsibleData = (
  ansiblePlaybookId,
  additionalData
) => dispatch => {
  dispatch({ type: APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_REQUEST });

  const baseUrl = additionalData.url;
  const realUrl = baseUrl.replace("__id__", ansiblePlaybookId);

  return api
    .get(realUrl, {}, {})
    .then(({ data }) =>
      dispatch({
        type: APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_SUCCESS,
        payload: { ...data }
      })
    )
    .catch(error => dispatch(errorHandler(APPLICATION_DEFINITION_LOAD_ANSIBLE_DATA_FAILURE, error)));
};

export const addApplicationDefinitionService = (additionalData) => ({
  type: APPLICATION_DEFINITION_SERVICE_ADD,
  payload: {
    ...additionalData,
  },
});

export const deleteApplicationDefinitionService = (additionalData) => ({
  type: APPLICATION_DEFINITION_SERVICE_DELETE,
  payload: {
    ...additionalData,
  },
});

export const activateEditApplicationDefinitionService = (additionalData) => ({
  type: APPLICATION_DEFINITION_SERVICE_EDIT_ACTIVATE,
  payload: {
    ...additionalData,
  },
});

export const confirmEditApplicationDefinitionService = (rowData) => ({
  type: APPLICATION_DEFINITION_SERVICE_EDIT_CONFIRM,
  payload: {
    ...rowData,
  },
});

export const cancelEditApplicationDefinitionService = (rowData) => ({
  type: APPLICATION_DEFINITION_SERVICE_EDIT_CANCEL,
  payload: {
    ...rowData,
  },
});

export const changeEditApplicationDefinitionService = (value, additionalData) => ({
  type: APPLICATION_DEFINITION_SERVICE_EDIT_CHANGE,
  payload: {
    value,
    ...additionalData,
  },
});

export const openForemanParameterSelectionModal = (additionalData) => dispatch => {
  dispatch({
    type: APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_OPEN,
    payload: {
      ...additionalData,
    }
  });
  dispatch(
    setModalOpen({ id: 'AppDefinitionForemanParamSelection' })
  );
}

export const closeForemanParameterSelectionModal = (additionalData) => dispatch => {
  dispatch({
    type: APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE,
    payload: {
      ...additionalData,
    }
  });

  dispatch(
    setModalClosed({ id: 'AppDefinitionForemanParamSelection' })
  );
}

export const openAnsibleParameterSelectionModal = (additionalData) => dispatch => {
  dispatch({
    type: APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_OPEN,
    payload: {
      ...additionalData,
    }
  });
  dispatch(
    setModalOpen({ id: 'AppDefinitionAnsibleParamSelection' })
  );
}

export const closeAnsibleParameterSelectionModal = (additionalData) => dispatch => {
  dispatch({
    type: APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE,
    payload: {
      ...additionalData,
    }
  });

  dispatch(
    setModalClosed({ id: 'AppDefinitionAnsibleParamSelection' })
  );
}

export const changeParameterSelectionMode = (additionalData) => ({
  type: APPLICATION_DEFINITION_CHANGE_PARAMETER_SELECTION_MODE,
  payload: {
    ...additionalData,
  },
})
