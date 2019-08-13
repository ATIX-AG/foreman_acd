import { differenceBy, slice, includes, uniq } from 'lodash';
import Immutable from 'seamless-immutable';
import { createSelector } from 'reselect';

const parameterState = state => state.foremanAppcendep.parameterSelectionParameters;

export const selectLoading = state => parameterState(state).loading;
export const selectSimple = state => parameterState(state).simple;
