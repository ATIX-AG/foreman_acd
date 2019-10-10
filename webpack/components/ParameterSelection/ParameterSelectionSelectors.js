import { differenceBy, slice, includes, uniq } from 'lodash';
import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';

const parameterState = state => state.foremanAppcendep.parameterSelectionParameters;

export const selectLoading = state => parameterState(state).loading;
export const selectEditMode = state => parameterState(state).editMode;
export const selectForemanData = state => parameterState(state).foremanData;
export const selectRows = state => parameterState(state).rows;
export const selectSortingColumns = state => parameterState(state).sortingColumns;
export const selectColumns = state => parameterState(state).columns;
export const selectSortingDisabled = state => parameterState(state).sortingDisabled;
export const selectAppDefinition = state => parameterState(state).appDefinition;
export const selectHostgroupId = state => parameterState(state).hostgroupId;
