import Immutable from 'seamless-immutable';

import { cloneDeep, findIndex, findLastIndex } from 'lodash';

import { filterParameterTypes } from './ParameterSelectionHelper';

import * as sort from 'sortabular';

import {
  PARAMETER_SELECTION_INIT,
  PARAMETER_SELECTION_TYPES,
  PARAMETER_SELECTION_LOCK,
  PARAMETER_SELECTION_DELETE,
  PARAMETER_SELECTION_ADD,
  PARAMETER_SELECTION_EDIT_ACTIVATE,
  PARAMETER_SELECTION_EDIT_CONFIRM,
  PARAMETER_SELECTION_EDIT_CHANGE,
  PARAMETER_SELECTION_EDIT_CANCEL,
  PARAMETER_SELECTION_SORT,
  PARAMETER_SELECTION_LOAD_PARAM_DATA_REQUEST,
  PARAMETER_SELECTION_LOAD_PARAM_DATA_SUCCESS,
  PARAMETER_SELECTION_LOAD_PARAM_DATA_FAILURE,
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
  PARAMETER_SELECTION_COMPLEX_DATA_MODAL_OPEN,
  PARAMETER_SELECTION_COMPLEX_DATA_MODAL_CLOSE,
} from './ParameterSelectionConstants';

export const initialState = Immutable({
  editMode: false,
  error: { errorMsg: '', status: '', statusText: '' },
});

const parameterSelectionParameters = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case PARAMETER_SELECTION_INIT: {
      return state.merge(payload);
    }
    case PARAMETER_SELECTION_ADD: {
      let parameters = [];
      let index = 1;

      if (
        'parameters' in state &&
        state.parameters !== undefined &&
        state.parameters.length > 0
      ) {
        parameters = cloneDeep(state.parameters);
        index = Math.max(...parameters.map(e => e.id)) + 1;
      }

      const newRow = {
        id: index,
        locked: false,
        name: '',
        description: '',
        type: '',
        value: '',
        isYaml: false,
        newEntry: true,
      };
      if (state.paramType == 'PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE') {
        newRow.type = 'complex';
      }
      newRow.backup = cloneDeep(newRow);
      parameters.push(newRow);
      return state.merge({
        editMode: true,
        parameters,
        editParamsRowIndex: index,
      });
    }
    case PARAMETER_SELECTION_LOCK: {
      const parameters = cloneDeep(state.parameters);
      const index = findIndex(parameters, { id: payload.rowData.id });

      if (parameters[index].locked !== undefined) {
        parameters[index].locked = !parameters[index].locked;
      } else {
        parameters[index].locked = true;
      }

      return state.merge({
        parameters,
      });
    }
    case PARAMETER_SELECTION_DELETE: {
      const parameters = state.parameters.filter(
        v => v.id !== payload.rowData.id
      );
      return state.merge({
        parameters,
        parameterTypes: filterParameterTypes(
          state.allowedParameterTypes,
          parameters
        ),
      });
    }
    case PARAMETER_SELECTION_EDIT_ACTIVATE: {
      const parameters = cloneDeep(state.parameters);
      const index = findIndex(parameters, { id: payload.rowData.id });

      parameters[index].backup = cloneDeep(parameters[index]);
      return state.merge({
        editMode: true,
        parameters,
        editParamsRowIndex: index,
      });
    }
    case PARAMETER_SELECTION_EDIT_CONFIRM: {
      const parameters = cloneDeep(state.parameters);
      const index = findIndex(parameters, { id: payload.rowData.id });

      delete parameters[index].backup;
      delete parameters[index].newEntry;

      return state.merge({
        editMode: false,
        parameterTypes: filterParameterTypes(
          state.allowedParameterTypes,
          parameters
        ),
        parameters,
      });
    }
    case PARAMETER_SELECTION_EDIT_CHANGE: {
      const parameters = cloneDeep(state.parameters);
      const index = findIndex(parameters, { id: payload.rowData.id });

      if (!parameters[index].isYaml && payload.property == 'value') {
        parameters[index].value = payload.value;
      } else if (payload.property != 'value') {
        parameters[index][payload.property] = payload.value;
      }
      return state.merge({
        parameters,
        editParamsRowIndex: index,
      });
    }
    case PARAMETER_SELECTION_EDIT_CANCEL: {
      const parameters = cloneDeep(state.parameters);
      const index = findIndex(parameters, { id: payload.rowData.id });

      parameters[index] = cloneDeep(parameters[index].backup);
      delete parameters[index].backup;

      if (parameters[index].newEntry === true) {
        parameters.splice(index, 1);
      }

      return state.merge({
        editMode: false,
        parameters,
      });
    }
    case PARAMETER_SELECTION_SORT: {
      const { selectedColumn } = payload;
      return state.set(
        'sortingColumns',
        sort.byColumn({
          sortingColumns: state.sortingColumns,
          sortingOrder: payload.defaultSortingOrder,
          selectedColumn,
        })
      );
    }
    case PARAMETER_SELECTION_LOAD_PARAM_DATA_FAILURE: {
      return state.merge({
        error: payload.error,
        loading: false,
      });
    }
    case PARAMETER_SELECTION_LOAD_PARAM_DATA_REQUEST: {
      let newState = {};

      if (payload.dataType == PARAMETER_SELECTION_PARAM_TYPE_FOREMAN) {
        newState = {
          paramData: {},
          hostgroupId: -1,
          loading: true,
        };
      } else if (payload.dataType == PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE) {
        newState = {
          loading: true,
        };
      }

      if (payload.clearParameters === true) {
        Object.assign(newState, { parameters: [] });
      }

      return state.merge(newState);
    }
    case PARAMETER_SELECTION_LOAD_PARAM_DATA_SUCCESS: {
      let newState = {};

      if (payload.dataType == PARAMETER_SELECTION_PARAM_TYPE_FOREMAN) {
        newState = {
          loading: false,
          paramData: payload,
          hostgroupId: payload.hostgroup_id,
        };
      }

      return state.merge(newState);
    }
    case PARAMETER_SELECTION_COMPLEX_DATA_MODAL_OPEN: {
      return state;
    }
    case PARAMETER_SELECTION_COMPLEX_DATA_MODAL_CLOSE: {
      let str;
      const element = document.getElementById('yamlData');
      if (element != null) {
        str = element.value;
      } else {
        str = '';
      }
      let newState = {};
      const index = state.editParamsRowIndex;
      const parameters = cloneDeep(state.parameters);
      if (payload.mode == 'save') {
        parameters[index].value = str;
        if (str == '') {
          parameters[index].isYaml = false;
        } else {
          parameters[index].isYaml = true;
        }
        newState = {
          parameters,
        };
      } else {
        newState = {};
      }
      return state.merge(newState);
    }
    default:
      return state;
  }
};

export default parameterSelectionParameters;
