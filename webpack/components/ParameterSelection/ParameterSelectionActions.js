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
  INIT_PARAMETER_SELECTION,
  PARAMETER_TYPES,
  PARAMETER_DELETE,
  PARAMETER_ADD,
  PARAMETER_EDIT_ACTIVATE,
  PARAMETER_EDIT_CONFIRM,
  PARAMETER_EDIT_CHANGE,
  PARAMETER_EDIT_CANCEL,
  PARAMETER_SORT,
  LOAD_PARAMETER_SELECTION_REQUEST,
  LOAD_PARAMETER_SELECTION_SUCCESS,
  LOAD_PARAMETER_SELECTION_FAILURE,
  LOAD_FOREMAN_DATA_REQUEST,
  LOAD_FOREMAN_DATA_SUCCESS,
  LOAD_FOREMAN_DATA_FAILURE,
} from './ParameterSelectionConstants';

export const initParameterSelection = (
  mode,
  appDefinition,
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
  initialState.sortingDisabled = false;

  initialState.appDefinition = appDefinition;

  var valueLabel = 'Value';
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
            width: '25%'
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
        props: {
          index: 2
        },
        formatters: [isDefinition(mode) ? inlineEditFormatter : tableCellFormatter]
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
            width: '25%'
          }
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter]
      },
      cell: {
        props: {
          index: 3
        },
        formatters: [inlineEditFormatter]
      }
    },
    {
      property: 'actions',
      header: {
        label: 'Actions',
        props: {
          index: 4
        },
        formatters: [actionHeaderCellFormatter]
      },
      cell: {
        props: {
          index: 4
        },
        formatters: [inlineEditButtonsFormatter]
      }
    }
  ];

  if ((isNewDefinition(mode)) || (isNewInstance(mode))) {
    initialState.rows = [];
  } else if ((isEditDefinition(mode)) || (isEditInstance(mode))) {
    initialState.rows = parameters;
    initialState.hostgroupId = appDefinition.hostgroup_id;
  } else {
    // FIXME: should never ever happen
  }

  if (isNewDefinition(mode) || isNewInstance(mode)) {
    initialState.parameterTypes = PARAMETER_TYPES;
  } else {
    initialState.parameterTypes = filterUsedParameterTypes(PARAMETER_TYPES, parameters);
  }

  dispatch({
    type: INIT_PARAMETER_SELECTION,
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
  type: PARAMETER_ADD,
  payload: {
    ...additionalData,
  },
});

export const deleteParameter = (additionalData) => ({
  type: PARAMETER_DELETE,
  payload: {
    ...additionalData,
  },
});

export const activateEditParameter = (additionalData) => ({
  type: PARAMETER_EDIT_ACTIVATE,
  payload: {
    ...additionalData,
  },
});

export const confirmEditParameter = (rowData) => ({
  type: PARAMETER_EDIT_CONFIRM,
  payload: {
    ...rowData,
  },
});

export const cancelEditParameter = (rowData) => ({
  type: PARAMETER_EDIT_CANCEL,
  payload: {
    ...rowData,
  },
});

export const changeEditParameter = (value, additionalData) => ({
  type: PARAMETER_EDIT_CHANGE,
  payload: {
    value,
    ...additionalData,
  },
});

export const sortParameter = (selectedColumn, defaultSortingOrder) => ({
  type: PARAMETER_SORT,
  payload: {
    selectedColumn,
    defaultSortingOrder,
  },
});

export const loadParameterSelection = (
  url,
  applicationDefinitionId
) => dispatch => {
  dispatch({ type: LOAD_PARAMETER_SELECTION_REQUEST });

  var realUrl = url.replace("__id__", applicationDefinitionId);

  return api
    .get(realUrl, {}, {})
    .then(({ data }) =>
      dispatch({
        type: LOAD_PARAMETER_SELECTION_SUCCESS,
        payload: data,
      })
    )
    .catch(error => dispatch(errorHandler(LOAD_PARAMETER_SELECTION_FAILURE, error)));
};

export const loadForemanData = (
  url,
  hostgroupId,
  clearRows = false,
) => dispatch => {
  dispatch({ type: LOAD_FOREMAN_DATA_REQUEST, payload: { clearRows: clearRows } });

  var realUrl = url.replace("__id__", hostgroupId);

  return api
    .get(realUrl, {}, {})
    .then(({ data }) =>
      dispatch({
        type: LOAD_FOREMAN_DATA_SUCCESS,
        payload: data,
      })
    )
    .catch(error => dispatch(errorHandler(LOAD_FOREMAN_DATA_FAILURE, error)));
};

