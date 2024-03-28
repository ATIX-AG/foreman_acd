const applicationDefinitionImportConf = state =>
  state.foremanAcd.applicationDefinitionImportConf;

export const selectEditMode = state =>
  applicationDefinitionImportConf(state).editMode;
export const selectColumns = state =>
  applicationDefinitionImportConf(state).columns;
export const selectAnsiblePlaybookServices = state =>
  applicationDefinitionImportConf(state).ansiblePlaybookServices;
export const selectShowAlertModal = state =>
  applicationDefinitionImportConf(state).showAlertModal;
export const selectAlertModalText = state =>
  applicationDefinitionImportConf(state).alertModalText;
export const selectAlertModalTitle = state =>
  applicationDefinitionImportConf(state).alertModalTitle;
