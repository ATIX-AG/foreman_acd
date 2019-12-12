import React from 'react';
import * as sort from 'sortabular';

import {
  actionHeaderCellFormatter,
  sortableHeaderCellFormatter,
  tableCellFormatter,
  TABLE_SORT_DIRECTION
} from 'patternfly-react';

import api from 'foremanReact/API';

import {
  propsToSnakeCase,
  propsToCamelCase,
} from 'foremanReact/common/helpers';

import {
  isNewDefinition,
  isEditDefinition,
  isDefinition,
  isNewInstance,
  isEditInstance,
  isInstance,
  filterUsedParameterTypes,
} from './ParameterSelectionHelper';

import {
  PARAMETER_SELECTION_INIT,
  PARAMETER_SELECTION_TYPES,
  PARAMETER_SELECTION_DELETE,
  PARAMETER_SELECTION_ADD,
  PARAMETER_SELECTION_EDIT_ACTIVATE,
  PARAMETER_SELECTION_EDIT_CONFIRM,
  PARAMETER_SELECTION_EDIT_CHANGE,
  PARAMETER_SELECTION_EDIT_CANCEL,
  PARAMETER_SELECTION_SORT,
  PARAMETER_SELECTION_LOAD_FOREMAN_DATA_REQUEST,
  PARAMETER_SELECTION_LOAD_FOREMAN_DATA_SUCCESS,
  PARAMETER_SELECTION_LOAD_FOREMAN_DATA_FAILURE,
} from './ParameterSelectionConstants';

export const initParameterSelection = (
  mode,
  serviceDefinition,
  parameters,
  sortingFormatter,
  sortableTransform,
  inlineEditFormatter,
  inlineEditButtonsFormatter,
) => dispatch => {
  const initialState = {};

  initialState.sortingColumns = {
    name: {
      direction: TABLE_SORT_DIRECTION.ASC,
        position: 0
    }
  };
  initialState.serviceDefinition = serviceDefinition;

  let valueLabel = 'Value';
  if (isDefinition(mode)) {
    valueLabel = 'Default value';
  }

  initialState.columns = [
    {
      property: 'name',
      header: {
        label: 'Name',
        props: {
          index: 0,
          sort: true,
          style: {
            width: '20%'
          }
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter]
      },
      cell: {
        formatters: [isDefinition(mode) ? inlineEditFormatter : tableCellFormatter]
      }
    },
    {
      property: 'description',
      header: {
        label: 'Description',
        props: {
          index: 1,
          sort: true,
          style: {
            width: '20%'
          }
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter]
      },
      cell: {
        props: {
          index: 1
        },
        formatters: [isDefinition(mode) ? inlineEditFormatter : tableCellFormatter]
      }
    },
    {
      property: 'type',
      header: {
        label: 'Type',
        props: {
          index: 2,
          sort: true,
          style: {
            width: '20%'
          }
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter]
      },
      cell: {
        // we are always using the inlineEditFormatter so that
        // the well formatted type name is shown
        formatters: [inlineEditFormatter]
      }
    },
    {
      property: 'value',
      header: {
        label: valueLabel,
        props: {
          index: 3,
          sort: true,
          style: {
            width: '20%'
          }
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter]
      },
      cell: {
        formatters: [inlineEditFormatter]
      }
    },
    {
      property: 'actions',
      header: {
        label: 'Actions',
        props: {
          index: 4,
          style: {
            width: '20%'
          }
        },
        formatters: [actionHeaderCellFormatter]
      },
      cell: {
        formatters: [inlineEditButtonsFormatter]
      }
    }
  ];

  if (isNewDefinition(mode)) {
    initialState.parameters = [];
  } else if ((isEditDefinition(mode)) || (isInstance(mode))) {
    initialState.parameters = parameters;
    initialState.hostgroupId = serviceDefinition.hostgroup_id;
  } else {
    // FIXME: should never ever happen
  }

  if (isNewDefinition(mode)) {
    initialState.parameterTypes = PARAMETER_SELECTION_TYPES;
  } else {
    initialState.parameterTypes = filterUsedParameterTypes(PARAMETER_SELECTION_TYPES, parameters);
  }

  dispatch({
    type: PARAMETER_SELECTION_INIT,
    payload: initialState,
  });
}

const errorHandler = (msg, err) => {
  const error = {
    errorMsg: 'Failed to fetch data from server.',
    statusText: err,
  };
  return { type: msg, payload: { error } };
};

export const addParameter = (additionalData) => ({
  type: PARAMETER_SELECTION_ADD,
  payload: {
    ...additionalData,
  },
});

export const deleteParameter = (additionalData) => ({
  type: PARAMETER_SELECTION_DELETE,
  payload: {
    ...additionalData,
  },
});

export const activateEditParameter = (additionalData) => ({
  type: PARAMETER_SELECTION_EDIT_ACTIVATE,
  payload: {
    ...additionalData,
  },
});

export const confirmEditParameter = (rowData) => ({
  type: PARAMETER_SELECTION_EDIT_CONFIRM,
  payload: {
    ...rowData,
  },
});

export const cancelEditParameter = (rowData) => ({
  type: PARAMETER_SELECTION_EDIT_CANCEL,
  payload: {
    ...rowData,
  },
});

export const changeEditParameter = (value, additionalData) => ({
  type: PARAMETER_SELECTION_EDIT_CHANGE,
  payload: {
    value,
    ...additionalData,
  },
});

export const sortParameter = (selectedColumn, defaultSortingOrder) => ({
  type: PARAMETER_SELECTION_SORT,
  payload: {
    selectedColumn,
    defaultSortingOrder,
  },
});

export const loadForemanData = (
  hostgroupId,
  additionalData,
) => dispatch => {
  dispatch({ type: PARAMETER_SELECTION_LOAD_FOREMAN_DATA_REQUEST, payload: { clearParameters: additionalData.clearParameters } });

  const realUrl = additionalData.url.replace("__id__", hostgroupId);

  return api
    .get(realUrl, {}, {})
    .then(({ data }) =>
      dispatch({
        type: PARAMETER_SELECTION_LOAD_FOREMAN_DATA_SUCCESS,
        payload: data,
      })
    )
    .catch(error => dispatch(errorHandler(PARAMETER_SELECTION_LOAD_FOREMAN_DATA_FAILURE, error)));
};

