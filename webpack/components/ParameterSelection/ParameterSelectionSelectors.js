import { differenceBy, slice, includes, uniq } from 'lodash';
import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';

const parameterState = state => state.foremanAppcendep.parameterSelectionParameters;

export const selectLoading = state => parameterState(state).loading;
export const selectEditMode = state => parameterState(state).editMode;
export const selectPuppetEnv = state => parameterState(state).puppetEnv;
export const selectLifecycleEnv = state => parameterState(state).lifecycleEnv;
export const selectRows = state => parameterState(state).rows;
export const selectSortingColumns = state => parameterState(state).sortingColumns;
export const selectColumns = state => parameterState(state).columns;
export const selectSortingDisabled = state => parameterState(state).sortingDisabled;
export const selectSelectedApp = state => parameterState(state).selectedApp;
