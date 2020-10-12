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
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
  PARAMETER_SELECTION_LOAD_PARAM_DATA_REQUEST,
  PARAMETER_SELECTION_LOAD_PARAM_DATA_SUCCESS,
  PARAMETER_SELECTION_LOAD_PARAM_DATA_FAILURE,
} from './ParameterSelectionConstants';

export const initParameterSelection = (
  paramType,
  paramDefinition,
  parameters,
  useDefaultValue,
  allowNameAdjustment,
  allowDescriptionAdjustment,
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
  initialState.paramDefinition = paramDefinition;

  let valueLabel = 'Value';
  if (useDefaultValue) {
    valueLabel = 'Default value';
  }

  initialState.columns = []
  const addToColumns = (obj, idx) => {
    obj.header.props.index = idx;
    initialState.columns.push(obj);
  }

  let idx = 0;
  addToColumns( {
      property: 'name',
      header: {
        label: 'Name',
        props: {
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
        formatters: [allowNameAdjustment ? inlineEditFormatter : tableCellFormatter]
      }
    }, idx++);

  addToColumns( {
      property: 'description',
      header: {
        label: 'Description',
        props: {
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
        formatters: [allowDescriptionAdjustment ? inlineEditFormatter : tableCellFormatter]
      }
    }, idx++);

  if (paramType == PARAMETER_SELECTION_PARAM_TYPE_FOREMAN) {
    addToColumns( {
      property: 'type',
      header: {
        label: 'Type',
        props: {
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
    }, idx++);
  }

  addToColumns( {
      property: 'value',
      header: {
        label: valueLabel,
        props: {
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
    }, idx++);

  addToColumns( {
      property: 'actions',
      header: {
        label: 'Actions',
        props: {
          style: {
            width: '20%'
          }
        },
        formatters: [actionHeaderCellFormatter]
      },
      cell: {
        formatters: [inlineEditButtonsFormatter]
      }
    }, idx++);

  initialState.parameters = parameters;

  if ((paramType == PARAMETER_SELECTION_PARAM_TYPE_FOREMAN) && (parameters)) {
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

export const loadParamData = (attr) => dispatch => {
  dispatch( { type: PARAMETER_SELECTION_LOAD_PARAM_DATA_REQUEST, payload: { dataType: attr.dataType, clearParameters: attr.clearParameters } });

  let realUrl = attr.url.replace("__id__", attr.paramDefinition.dataId);

  if (attr.paramDefinition.hasOwnProperty('dataSubId')) {
    realUrl = realUrl.replace("__subid__", attr.paramDefinition.dataSubId);
  }

  return api
    .get(realUrl, {}, {})
    .then(({ data }) =>
      dispatch({
        type: PARAMETER_SELECTION_LOAD_PARAM_DATA_SUCCESS,
        payload: { ...data, dataType: attr.dataType }
      })
    )
    .catch(error => dispatch(errorHandler(PARAMETER_SELECTION_LOAD_PARAM_DATA_FAILURE, error)));
};

