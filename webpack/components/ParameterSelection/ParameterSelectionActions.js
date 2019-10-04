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
  PUPPET_ENV_REQUEST,
  PUPPET_ENV_SUCCESS,
  PUPPET_ENV_FAILURE,
  LIFECYCLE_ENV_REQUEST,
  LIFECYCLE_ENV_SUCCESS,
  LIFECYCLE_ENV_FAILURE,
  INIT_PARAMETER_SELECTION,
  PARAMETER_DELETE,
  PARAMETER_ADD,
  PARAMETER_EDIT_ACTIVATE,
  PARAMETER_EDIT_CONFIRM,
  PARAMETER_EDIT_CHANGE,
  PARAMETER_EDIT_CANCEL,
  PARAMETER_SORT,
} from './ParameterSelectionConstants';

export const initParameterSelection = (
  definition,
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
        formatters: [definition ? inlineEditFormatter : tableCellFormatter]
      }
    },
    {
      property: 'type',
      header: {
        label: 'Type',
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
        formatters: [definition ? inlineEditFormatter : tableCellFormatter]
      }
    },
    {
      property: 'value',
      header: {
        label: 'Value',
        props: {
          index: 2,
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
          index: 2
        },
        formatters: [inlineEditFormatter]
      }
    },
    {
      property: 'description',
      header: {
        label: 'Description',
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
        formatters: [definition ? inlineEditFormatter : tableCellFormatter]
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
  initialState.rows = parameters;

  dispatch({
    type: INIT_PARAMETER_SELECTION,
    payload: initialState,
  });
}

export const getPuppetEnvironments = (
  url,
  pagination,
  search
) => dispatch => {
  dispatch({ type: PUPPET_ENV_REQUEST });

  const params = {
    ...propsToSnakeCase(pagination || {}),
    ...(search || {})
  };

  return api
    .get(url, {}, params)
    .then(({ data }) =>
      dispatch({
        type: PUPPET_ENV_SUCCESS,
        payload: Object.assign(...data.results.map(item => ({[item["id"]]: item["name"]})))
      })
    )
    .catch(error => dispatch(errorHandler(PUPPET_ENV_FAILURE, error)));
};

export const getLifecycleEnvironments = (
  url,
  organization,
  pagination,
  search
) => dispatch => {
  dispatch({ type: LIFECYCLE_ENV_REQUEST });

  // TODO: handle organization

  const params = {
    ...propsToSnakeCase(pagination || {}),
    ...(search || {})
  };

  return api
    .get(url, {}, params)
    .then(({ data }) =>
      dispatch({
        type: LIFECYCLE_ENV_SUCCESS,
        payload: Object.assign(...data.results.map(item => ({[item["id"]]: item["name"]})))
      })
    )
    .catch(error => dispatch(errorHandler(LIFECYCLE_ENV_FAILURE, error)));
};

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

