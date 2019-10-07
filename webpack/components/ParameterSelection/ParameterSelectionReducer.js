import Immutable from 'seamless-immutable';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

import * as sort from 'sortabular';

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
  LOAD_PARAMETER_SELECTION_REQUEST,
  LOAD_PARAMETER_SELECTION_SUCCESS,
  LOAD_PARAMETER_SELECTION_FAILURE,
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
    case PUPPET_ENV_REQUEST: {
      return state.set('loading', true);
    }
    case PUPPET_ENV_SUCCESS: {
      return state.merge({
        loading: false,
        puppetEnv: payload,
      })
    }
    case PUPPET_ENV_FAILURE: {
      return state.merge({ error: payload.error, loading: false });
    }
    case LIFECYCLE_ENV_REQUEST: {
      return state.set('loading', true);
    }
    case LIFECYCLE_ENV_SUCCESS: {
      return state.merge({
        loading: false,
        lifecycleEnv: payload,
      })
    }
    case LIFECYCLE_ENV_FAILURE: {
      return state.merge({ error: payload.error, loading: false });
    }
    case PARAMETER_ADD: {
      const rows = cloneDeep(state.rows);
      const index = findLastIndex(rows, 'id') + 1;

      const newRow = {id: index+1, name: "", description: '', type: '', value: '', newEntry: true };
      rows.push(newRow);
      rows[index].backup = cloneDeep(rows[index]);

      return state.merge({
        'editMode': true,
        'sortingDisabled': true,
        'rows': rows
      });
    }
    case PARAMETER_DELETE: {
      return state.set(
        'rows',
        state.rows.filter(v => v.id !== payload.rowData.id)
      )
    }
    case PARAMETER_EDIT_ACTIVATE: {
      const rows = cloneDeep(state.rows);
      const index = findIndex(rows, { id: payload.rowData.id });

      rows[index].backup = cloneDeep(rows[index]);

      return state.merge({
        'editMode': true,
        'rows': rows
      });
    }
    case PARAMETER_EDIT_CONFIRM: {
      const rows = cloneDeep(state.rows);
      const index = findIndex(rows, { id: payload.rowData.id });

      delete rows[index].backup;
      delete rows[index].newEntry;

      return state.merge({
        'editMode': false,
        'sortingDisabled': false,
        'rows': rows
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
        'editMode': false,
        'sortingDisabled': false,
        'rows': rows
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
    case LOAD_PARAMETER_SELECTION_REQUEST: {
      return state.set('loading', true);
    }
    case LOAD_PARAMETER_SELECTION_SUCCESS: {
      return state.merge({
        selectedApp: payload.id,
        loading: false,
        rows: JSON.parse(payload.parameters),
      });
    }
    case LOAD_PARAMETER_SELECTION_FAILURE: {
      return state.merge({ error: payload.error, loading: false });
    }
    default:
      return state;
  }
};

export default parameterSelectionParameters;
