const parameterState = state => state.foremanAcd.parameterSelectionParameters;

export const selectLoading = state => parameterState(state).loading;
export const selectEditMode = state => parameterState(state).editMode;
export const selectParamData = state => parameterState(state).paramData;
export const selectAllowedParameterTypes = state => parameterState(state).allowedParameterTypes;
export const selectParameterTypes = state => parameterState(state).parameterTypes;
export const selectParameters = state => parameterState(state).parameters;
export const selectSortingColumns = state => parameterState(state).sortingColumns;
export const selectColumns = state => parameterState(state).columns;
export const selectParamDefinition = state => parameterState(state).paramDefinition;
export const selectHostgroupId = state => parameterState(state).hostgroupId;
export const selectEditParamsRowIndex = state => parameterState(state).editParamsRowIndex;
