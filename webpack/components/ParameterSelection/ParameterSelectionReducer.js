import Immutable from 'seamless-immutable';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

import {
  filterUsedParameterTypes,
} from './ParameterSelectionHelper';

import * as sort from 'sortabular';

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

export const initialState = Immutable({
  editMode: false,
  error: { errorMsg: '', status: '', statusText: '' },
});

const parameterSelectionParameters = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case INIT_PARAMETER_SELECTION: {
      return state.merge(payload);
    }
    case PARAMETER_ADD: {
      let rows = [];
      let index = 0;

      if ('rows' in state && state.rows !== undefined && state.rows.length > 0) {
        rows = cloneDeep(state.rows);
        index = Math.max(...rows.map(e => e.id)) + 1;
      }

      const newRow = {id: index, name: "", description: '', type: '', value: '', newEntry: true };
      newRow.backup = cloneDeep(newRow)
      rows.push(newRow);

      return state.merge({
        editMode: true,
        rows: rows
      });
    }
    case PARAMETER_DELETE: {
      const rows = state.rows.filter(v => v.id !== payload.rowData.id);
      return state.merge({
        rows: rows,
        parameterTypes: filterUsedParameterTypes(PARAMETER_TYPES, rows),
      })
    }
    case PARAMETER_EDIT_ACTIVATE: {
      const rows = cloneDeep(state.rows);
      const index = findIndex(rows, { id: payload.rowData.id });

      rows[index].backup = cloneDeep(rows[index]);

      return state.merge({
        editMode: true,
        rows: rows
      });
    }
    case PARAMETER_EDIT_CONFIRM: {
      const rows = cloneDeep(state.rows);
      const index = findIndex(rows, { id: payload.rowData.id });

      delete rows[index].backup;
      delete rows[index].newEntry;

      return state.merge({
        editMode: false,
        parameterTypes: filterUsedParameterTypes(PARAMETER_TYPES, rows),
        rows: rows
      });
    }
    case PARAMETER_EDIT_CHANGE: {
      const rows = cloneDeep(state.rows);
      const index = findIndex(rows, { id: payload.rowData.id });

      rows[index][payload.property] = payload.value;

      return state.set('rows', rows);
    }
    case PARAMETER_EDIT_CANCEL: {
      const rows = cloneDeep(state.rows);
      const index = findIndex(rows, { id: payload.rowData.id });

      rows[index] = cloneDeep(rows[index].backup);
      delete rows[index].backup;

      if (rows[index].newEntry === true) {
        rows.splice(index, 1);
      }

      return state.merge({
        editMode: false,
        rows: rows
      });
    }
    case PARAMETER_SORT: {
      const selectedColumn = payload.selectedColumn;
      return state.set(
        'sortingColumns',
        sort.byColumn({
          sortingColumns: state.sortingColumns,
          sortingOrder: payload.defaultSortingOrder,
          selectedColumn
        })
      );
    }
    case LOAD_PARAMETER_SELECTION_FAILURE: {
      return state.merge({ error: payload.error, loading: false });
    }
    case LOAD_PARAMETER_SELECTION_REQUEST: {
      return state.set('loading', true);
    }
    case LOAD_PARAMETER_SELECTION_SUCCESS: {
      return state.merge({
        appDefinition: payload.app_definition,
        loading: false,
        rows: JSON.parse(payload.app_definition.parameters),
        hostgroupId: payload.app_definition.hostgroup_id,
        foremanData: payload.fdata,
      });
    }
    case LOAD_FOREMAN_DATA_FAILURE: {
      return state.merge({
        error: payload.error,
        loading: false
      });
    }
    case LOAD_FOREMAN_DATA_REQUEST: {
      const newState = {
        foremanData: {},
        hostgroupId: -1,
        loading: true
      };

      if (payload.clearRows === true) {
        Object.assign(newState, { rows: [] });
      }

      return state.merge(newState);
    }
    case LOAD_FOREMAN_DATA_SUCCESS: {
      return state.merge({
        loading: false,
        foremanData: payload,
        hostgroupId: payload.hostgroup_id,
      });
    }
    default:
      return state;
  }
};

export default parameterSelectionParameters;
