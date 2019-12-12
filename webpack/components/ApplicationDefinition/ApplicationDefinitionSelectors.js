const applicationDefinitionConf = state => state.foremanAcd.applicationDefinitionConf;

export const selectEditMode = state => applicationDefinitionConf(state).editMode;
export const selectServices = state => applicationDefinitionConf(state).services;
export const selectColumns = state => applicationDefinitionConf(state).columns;
export const selectIsModalOpen = state => applicationDefinitionConf(state).isModalOpen;
export const selectParametersData = state => applicationDefinitionConf(state).parametersData;
