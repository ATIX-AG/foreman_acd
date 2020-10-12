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
} from './ApplicationDefinitionConstants';

export const initApplicationDefinition = (
  services,
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
            width: '20%'
          }
        },
      },
      cell: {
        formatters: [inlineEditButtonsFormatter]
      }
    }
  ];

  initialState.services = services;

  dispatch({
    type: APPLICATION_DEFINITION_INIT,
    payload: initialState,
  });
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
