const parameterState = state => state.foremanAcd.parameterSelectionParameters;

export const selectLoading = state => parameterState(state).loading;
export const selectEditMode = state => parameterState(state).editMode;
export const selectForemanData = state => parameterState(state).foremanData;
export const selectParameterTypes = state => parameterState(state).parameterTypes;
export const selectParameters = state => parameterState(state).parameters;
export const selectSortingColumns = state => parameterState(state).sortingColumns;
export const selectColumns = state => parameterState(state).columns;
export const selectServiceDefinition = state => parameterState(state).serviceDefinition;
export const selectHostgroupId = state => parameterState(state).hostgroupId;
