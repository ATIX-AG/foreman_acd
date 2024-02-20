const applicationDefinitionConf = state =>
  state.foremanAcd.applicationDefinitionConf;

export const selectShowAlertModal = state =>
  applicationDefinitionConf(state).showAlertModal;
export const selectAlertModalText = state =>
  applicationDefinitionConf(state).alertModalText;
export const selectAlertModalTitle = state =>
  applicationDefinitionConf(state).alertModalTitle;
export const selectEditMode = state =>
  applicationDefinitionConf(state).editMode;
export const selectAnsiblePlaybook = state =>
  applicationDefinitionConf(state).ansiblePlaybook;
export const selectServices = state =>
  applicationDefinitionConf(state).services;
export const selectColumns = state => applicationDefinitionConf(state).columns;
export const selectHiddenForemanParameterTypes = state =>
  applicationDefinitionConf(state).hiddenForemanParameterTypes;
export const selectParametersData = state =>
  applicationDefinitionConf(state).parametersData;
export const selectAnsibleVarsAll = state =>
  applicationDefinitionConf(state).ansibleVarsAll;
export const selectParamEditMode = state =>
  applicationDefinitionConf(state).paramEditMode;
